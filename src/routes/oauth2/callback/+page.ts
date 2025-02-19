import type { PageLoad } from './$types';

import { redirect } from '@sveltejs/kit';

// Server-side code exchange has occurred now and we are passed back our tokens
// that can be used against the various APIs.
export const load: PageLoad = ({ data }) => {
	window.sessionStorage.setItem('token', JSON.stringify(data.token));
	window.sessionStorage.setItem('profile', JSON.stringify(data.idToken));

	redirect(307, window.sessionStorage.getItem('oidc_location') || '/');
};
