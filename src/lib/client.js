import * as Api from '$lib/openapi/server';

export function client(token) {
	const config = new Api.Configuration({
		basePath: '',
		accessToken: 'Bearer ' + token
	});

	return new Api.DefaultApi(config);
}
