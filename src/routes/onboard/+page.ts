import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ url }) => {
	const callback = url.searchParams.get('callback');
	if (!callback) {
		error(400, 'no callback parameter');
	}

	const state = url.searchParams.get('state');
	if (!state) {
		error(400, 'no state parameter');
	}

	return {
		callback: callback,
		state: state
	};
};
