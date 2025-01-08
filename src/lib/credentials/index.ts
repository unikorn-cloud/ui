import { sessionstore } from '$lib/sessionstore';
import { browser } from '$app/environment';

import type { Token, InternalToken } from '$lib/oauth2';
import type { IDToken } from '$lib/oidc';

// token is the authorization bearer token for making API requests.
export const token = sessionstore<InternalToken>('token');

// idToken is the user's idToken and contains OIDC information about them.
export const profile = sessionstore<IDToken>('id_token');

// This is called when the initial access token is acquired from the oauth
// exchange.  It uses the token to rescope to a project, that's either selected
// from persistent storage, and as a fallback, just selects the first one the
// user has access too as a default.
export function setCredentials(tokens: InternalToken, idToken: IDToken) {
	// Set everything else up first, then update the token.
	profile.set(idToken);
	// Everything should hang off the presence of an access token, so we expect the
	// other details to be ready to be consumed by that point.
	token.set(tokens);
}

// Remove credentials i.e. on token expiry.
// It retains the ID token information for a login hint.
export function removeCredentials() {
	token.clear();
	// This flushes any stores so we can see the access token is undefined.
	if (browser) window.location.reload();
}

// Fully logs out and forgets everything about a user.
export function logout() {
	profile.clear();
	token.clear();
	// This flushes any stores so we can see the access token is undefined.
	if (browser) window.location.reload();
}
