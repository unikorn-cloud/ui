import * as Api from '$lib/openapi/server';
import { removeCredentials } from '$lib/credentials.js';

export function client(token: string): BaseAPI {
	const config = new Api.Configuration({
		basePath: '',
		accessToken: 'Bearer ' + token
	});

	return new Api.DefaultApi(config);
}

export function error(error: Error): void {
	// Perhaps raise a toast here or something??
	console.log(error);

	if (error.response.status == 401) {
		removeCredentials();
		return;
	}
}
