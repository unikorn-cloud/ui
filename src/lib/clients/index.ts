import { env } from '$env/dynamic/public';

import * as OIDC from '$lib/oidc';
import type { InternalToken } from '$lib/oauth2';

import * as ServerApi from '$lib/openapi/server';
import * as IdentityApi from '$lib/openapi/identity';
import { removeCredentials } from '$lib/credentials';
import type { ToastSettings } from '@skeletonlabs/skeleton';

import { ROOT_CONTEXT, defaultTextMapSetter, trace } from '@opentelemetry/api';
import type { Span } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

// authenticationMiddleware performs logout if the request is unauthorized.
function authenticationMiddleware(): ServerApi.Middleware {
	return {
		post: (ctx: ServerApi.ResponseContext): Promise<void | Response> => {
			return new Promise((resolve) => {
				if (ctx.response.status == 401) removeCredentials();
				resolve();
			});
		}
	};
}

// traceContextMiddleware injects w3c trace context to support request tracing and simple
// handling of support requests.
function traceContextMiddleware(toastStore: any): ServerApi.Middleware {
	// Cache the span across the call so we can get at the trace
	// context, in particular the trace ID, after the call completes.
	let span: Span;

	return {
		pre: (ctx: ServerApi.RequestContext): Promise<ServerApi.FetchParams | void> => {
			return new Promise((resolve) => {
				const tracer = trace.getTracer('unikorn-ui');
				span = tracer.startSpan(ctx.url);

				const propagator = new W3CTraceContextPropagator();

				propagator.inject(
					trace.setSpanContext(ROOT_CONTEXT, span.spanContext()),
					ctx.init.headers,
					defaultTextMapSetter
				);

				resolve();
			});
		},
		post: (ctx: ServerApi.ResponseContext): Promise<Response | void> => {
			return new Promise((resolve) => {
				span.end();

				if (!ctx.response.ok) {
					const toast: ToastSettings = {
						autohide: false,
						message: `Server request failed, please quote request ID ${span.spanContext().traceId} when requesting help`,
						background: 'variant-filled-error'
					};

					toastStore.trigger(toast);
				}

				resolve();
			});
		}
	};
}

// accessToken is a callback to get the Authorization header.  Crucially this
// also has a reference to the full token, so san see when the access token
// has expired and refresh it using the refresh token.
async function accessToken(token: InternalToken): Promise<string> {
	if (new Date(Date.now()).toJSON() > token.expiry) {
		const discovery = await OIDC.discovery();

		const form = new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: token.refresh_token
		});

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: form.toString()
		};

		const response = await fetch(discovery.token_endpoint, options);

		const result = await response.json();

		if (!response.ok) {
			console.log('ruh roh', result);
		}

		const new_token = result as InternalToken;

		// Do an in-place update of the token so as not to trigger
		// a refresh of all the things.
		Object.assign(token, new_token);

		// Set the expiry time so we know when to perform a rotation.
		// Add a little wiggle room in there to account for any latency.
		const expiry = new Date(Date.now());
		expiry.setSeconds(expiry.getSeconds() + token.expires_in - 60);
		token.expiry = expiry.toJSON();
	}

	return token.token_type + ' ' + token.access_token;
}

// client gets a new initialized client with auth and any additional middlewares.
// NOTE: the toast store must be initialized in a svelte compenent or the context
// lookup for the store will fail, hence we have to pass it in.
export function client(toastStore: any, token: InternalToken): ServerApi.DefaultApi {
	const config = new ServerApi.Configuration({
		basePath: env.PUBLIC_API_HOST,
		accessToken: async () => accessToken(token),
		middleware: [authenticationMiddleware(), traceContextMiddleware(toastStore)]
	});

	return new ServerApi.DefaultApi(config);
}

export function identityClient(toastStore: any, token: InternalToken): IdentityApi.DefaultApi {
	const config = new IdentityApi.Configuration({
		basePath: env.PUBLIC_OAUTH2_ISSUER,
		accessToken: async () => accessToken(token),
		middleware: [authenticationMiddleware(), traceContextMiddleware(toastStore)]
	});

	return new IdentityApi.DefaultApi(config);
}

// error is a generic fallback when an exception occurs, everything else should
// be handled in a middleware, and not on a per API basis.
export function error(error: Error): void {
	console.log(error);
}
