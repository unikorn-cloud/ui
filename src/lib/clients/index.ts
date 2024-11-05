import { env } from '$env/dynamic/public';

import * as OIDC from '$lib/oidc';
import type { InternalToken } from '$lib/oauth2';

import * as KubernetesApi from '$lib/openapi/kubernetes';
import * as ApplicationApi from '$lib/openapi/application';
import * as IdentityApi from '$lib/openapi/identity';
import * as RegionApi from '$lib/openapi/region';
import { token, removeCredentials } from '$lib/credentials';
import type { ToastSettings } from '@skeletonlabs/skeleton';

import { ROOT_CONTEXT, defaultTextMapSetter, trace } from '@opentelemetry/api';
import type { Span } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

// authenticationMiddleware performs logout if the request is unauthorized.
function authenticationMiddleware(): IdentityApi.Middleware {
	return {
		post: (ctx: IdentityApi.ResponseContext): Promise<void | Response> => {
			return new Promise((resolve) => {
				if (ctx.response.status == 401) removeCredentials();
				resolve();
			});
		}
	};
}

// traceContextMiddleware injects w3c trace context to support request tracing and simple
// handling of support requests.
function traceContextMiddleware(toastStore: any): IdentityApi.Middleware {
	// Cache the span across the call so we can get at the trace
	// context, in particular the trace ID, after the call completes.
	let span: Span;

	return {
		pre: (ctx: IdentityApi.RequestContext): Promise<IdentityApi.FetchParams | void> => {
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
		post: (ctx: IdentityApi.ResponseContext): Promise<Response | void> => {
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
async function accessToken(tokens: InternalToken): Promise<string> {
	if (!tokens) return '';

	// TODO: we could get multiple API calls concurrently, at which point
	// we are repeating the operation, be nice if we could handle this
	// somehow.
	if (new Date(Date.now()).toJSON() > tokens.expiry) {
		const discovery = await OIDC.discovery();

		const form = new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: tokens.refresh_token
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
			const err = result as IdentityApi.ModelError;

			if (err.error == IdentityApi.ModelErrorErrorEnum.InvalidGrant) {
				removeCredentials();
			}

			// This will utimately turn into a 400 due to missing headers.
			// TODO: Not the best way to handle things to be honest.
			return '';
		}

		const new_token = result as InternalToken;

		// Set the expiry time so we know when to perform a rotation.
		// Add a little wiggle room in there to account for any latency.
		const expiry = new Date(Date.now());
		expiry.setSeconds(expiry.getSeconds() + new_token.expires_in - 60);
		new_token.expiry = expiry.toJSON();

		// Update the session storage.
		token.set(new_token);

		Object.assign(tokens, new_token);
	}

	return tokens.token_type + ' ' + tokens.access_token;
}

// client gets a new initialized client with auth and any additional middlewares.
// NOTE: the toast store must be initialized in a svelte compenent or the context
// lookup for the store will fail, hence we have to pass it in.
export function kubernetes(toastStore: any, tokens: InternalToken): KubernetesApi.DefaultApi {
	const config = new KubernetesApi.Configuration({
		basePath: env.PUBLIC_KUBERNETES_HOST,
		accessToken: async () => accessToken(tokens),
		middleware: [authenticationMiddleware(), traceContextMiddleware(toastStore)]
	});

	return new KubernetesApi.DefaultApi(config);
}

export function application(toastStore: any, tokens: InternalToken): ApplicationApi.DefaultApi {
	const config = new ApplicationApi.Configuration({
		basePath: env.PUBLIC_APPLICATION_HOST,
		accessToken: async () => accessToken(tokens),
		middleware: [authenticationMiddleware(), traceContextMiddleware(toastStore)]
	});

	return new ApplicationApi.DefaultApi(config);
}

export function identity(toastStore: any, tokens: InternalToken): IdentityApi.DefaultApi {
	const config = new IdentityApi.Configuration({
		basePath: env.PUBLIC_OAUTH2_ISSUER,
		accessToken: async () => accessToken(tokens),
		middleware: [authenticationMiddleware(), traceContextMiddleware(toastStore)]
	});

	return new IdentityApi.DefaultApi(config);
}

export function region(toastStore: any, tokens: InternalToken): RegionApi.DefaultApi {
	const config = new RegionApi.Configuration({
		basePath: env.PUBLIC_REGION_HOST,
		accessToken: async () => accessToken(tokens),
		middleware: [authenticationMiddleware(), traceContextMiddleware(toastStore)]
	});

	return new RegionApi.DefaultApi(config);
}

// error is a generic fallback when an exception occurs, everything else should
// be handled in a middleware, and not on a per API basis.
export function error(error: Error): void {
	console.log(error);
}
