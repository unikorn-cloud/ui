import * as Api from '$lib/openapi/server';
import { removeCredentials } from '$lib/credentials.js';
import { ToastSettings } from '@skeletonlabs/skeleton';
import { ROOT_CONTEXT, defaultTextMapSetter, propagation, trace } from '@opentelemetry/api';
import type { Span } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

// authenticationMiddleware performs logout if the request is unauthorized.
function authenticationMiddleware(): Api.Middleware {
	return {
		post: (ctx: Api.ErrorContext): Promise<Response | void> => {
			if (ctx.response.status != 401) return;
			removeCredentials();
		}
	};
}

// traceContextMiddleware injects w3c trace context to support request tracing and simple
// handling of support requests.
function traceContextMiddleware(toastStore: any): Api.Middleware {
	// Cache the span across the call so we can get at the trace
	// context, in particular the trace ID, after the call completes.
	let span: Span;

	return {
		pre: (ctx: Api.RequestContext): Promise<Api.FetchParams | void> => {
			let tracer = trace.getTracer('unikorn-ui');
			span = tracer.startSpan(ctx.url);
			console.log(span);

			const propagator = new W3CTraceContextPropagator();

			propagator.inject(
				trace.setSpanContext(ROOT_CONTEXT, span.spanContext()),
				ctx.init.headers,
				defaultTextMapSetter
			);
			console.log(ctx);
		},
		post: (ctx: Api.ErrorContext): Promise<Response | void> => {
			span.end();

			if (ctx.response.ok) return;

			const toast: ToastSettings = {
				autohide: false,
				message: `Server request failed, please quote request ID ${span.spanContext().traceId} when requesting help`,
				background: 'variant-filled-error'
			};

			toastStore.trigger(toast);
		}
	};
}

// client gets a new initialized client with auth and any additional middlewares.
// NOTE: the toast store must be initialized in a svelte compenent or the context
// lookup for the store will fail, hence we have to pass it in.
export function client(toastStore: any, token: string): BaseAPI {
	const config = new Api.Configuration({
		basePath: '',
		accessToken: 'Bearer ' + token,
		middleware: [authenticationMiddleware(), traceContextMiddleware(toastStore)]
	});

	return new Api.DefaultApi(config);
}

// error is a generic fallback when an exception occurs, everything else should
// be handled in a middleware, and not on a per API basis.
export function error(error: Error): void {
	console.log(error);
}
