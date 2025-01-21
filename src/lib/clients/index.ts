import { env } from '$env/dynamic/public';

import * as OIDC from '$lib/oidc';
import type { InternalToken } from '$lib/oauth2';

import * as Kubernetes from '$lib/openapi/kubernetes';
import * as Compute from '$lib/openapi/compute';
import * as Application from '$lib/openapi/application';
import * as Identity from '$lib/openapi/identity';
import * as Region from '$lib/openapi/region';
import { token, removeCredentials } from '$lib/credentials';
import type { ToastSettings } from '@skeletonlabs/skeleton';

import { ROOT_CONTEXT, defaultTextMapSetter, trace } from '@opentelemetry/api';
import type { Span } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

// authenticationMiddleware performs logout if the request is unauthorized.
function authenticationMiddleware(): Identity.Middleware {
	return {
		post: (ctx: Identity.ResponseContext): Promise<void | Response> => {
			return new Promise((resolve) => {
				if (ctx.response.status == 401) removeCredentials();
				resolve();
			});
		}
	};
}

// traceContextMiddleware injects w3c trace context to support request tracing and simple
// handling of support requests.
function traceContextMiddleware(): Identity.Middleware {
	// Cache the span across the call so we can get at the trace
	// context, in particular the trace ID, after the call completes.
	let span: Span;

	return {
		pre: (ctx: Identity.RequestContext): Promise<Identity.FetchParams | void> => {
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
		post: (ctx: Identity.ResponseContext): Promise<Response | void> => {
			return new Promise((resolve) => {
				span.end();
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
			const err = result as Identity.ModelError;

			if (err.error == Identity.ModelErrorErrorEnum.InvalidGrant) {
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
export function kubernetes(
	tokens: InternalToken,
	fetch?: Kubernetes.FetchAPI
): Kubernetes.DefaultApi {
	const config = new Kubernetes.Configuration({
		basePath: env.PUBLIC_KUBERNETES_HOST,
		accessToken: async () => accessToken(tokens),
		middleware: [authenticationMiddleware(), traceContextMiddleware()],
		fetchApi: fetch
	});

	return new Kubernetes.DefaultApi(config);
}

export function compute(tokens: InternalToken, fetch?: Compute.FetchAPI): Compute.DefaultApi {
	const config = new Compute.Configuration({
		basePath: env.PUBLIC_COMPUTE_HOST,
		accessToken: async () => accessToken(tokens),
		middleware: [authenticationMiddleware(), traceContextMiddleware()],
		fetchApi: fetch
	});

	return new Compute.DefaultApi(config);
}

export function application(
	tokens: InternalToken,
	fetch?: Application.FetchAPI
): Application.DefaultApi {
	const config = new Application.Configuration({
		basePath: env.PUBLIC_APPLICATION_HOST,
		accessToken: async () => accessToken(tokens),
		middleware: [authenticationMiddleware(), traceContextMiddleware()],
		fetchApi: fetch
	});

	return new Application.DefaultApi(config);
}

export function identity(tokens: InternalToken, fetch?: Identity.FetchAPI): Identity.DefaultApi {
	const config = new Identity.Configuration({
		basePath: env.PUBLIC_OAUTH2_ISSUER,
		accessToken: async () => accessToken(tokens),
		middleware: [authenticationMiddleware(), traceContextMiddleware()],
		fetchApi: fetch
	});

	return new Identity.DefaultApi(config);
}

export function region(tokens: InternalToken, fetch?: Region.FetchAPI): Region.DefaultApi {
	const config = new Region.Configuration({
		basePath: env.PUBLIC_REGION_HOST,
		accessToken: async () => accessToken(tokens),
		middleware: [authenticationMiddleware(), traceContextMiddleware()],
		fetchApi: fetch
	});

	return new Region.DefaultApi(config);
}

// error is a generic fallback when an exception occurs, everything else should
// be handled in a middleware, and not on a per API basis.
export function error(error: Error): void {
	console.log(error);
}
