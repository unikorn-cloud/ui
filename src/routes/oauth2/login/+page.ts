import type { PageLoad } from './$types';

import { redirect } from '@sveltejs/kit';

// Second step in authentication, the server has generated a nonce and PKCE code
// verifier and saved them to the browser as cookies.  We need to now redirect
// to the OIDC server.
export const load: PageLoad = () => {
	redirect(307, '/oauth2/login2');
};
