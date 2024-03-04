import { v4 as uuidv4 } from 'uuid';
import * as Api from '$lib/openapi/server';
import { removeCredentials } from '$lib/credentials.js';
import { ToastSettings } from '@skeletonlabs/skeleton';

// authenticationMiddleware performs logout if the request is unauthorized.
function authenticationMiddleware(): Api.Middleware {
	return {
		post: (ctx: Api.ErrorContext): Promise<Response | void> => {
			if (ctx.response.status != 401) return;
			removeCredentials();
		}
	};
}

// baggageMiddleware injects w3c baggage to support request tracing and simple
// handling of support requests.
// TODO: this probably wants to be a full OpenTelemetry trace context
// but baby steps, because otel is impregnable!
function baggageMiddleware(toastStore: any): Api.Middleware {
	const requestID = uuidv4();

	return {
		pre: (ctx: Api.RequestContext): Promise<Api.FetchParams | void> => {
			ctx.init.headers['baggage'] = `request-id=${requestID}`;
		},
		post: (ctx: Api.ErrorContext): Promise<Response | void> => {
			if (ctx.response.ok) return;

			const toast: ToastSettings = {
				autohide: false,
				message: `Server request failed, please quote request ID ${requestID} when requesting help`,
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
		middleware: [authenticationMiddleware(), baggageMiddleware(toastStore)]
	});

	return new Api.DefaultApi(config);
}

// error is a generic fallback when an exception occurs, everything else should
// be handled in a middleware, and not on a per API basis.
export function error(error: Error): void {
	console.log(error);
}
