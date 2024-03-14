import { writable } from 'svelte/store';
import { sessionStorage } from '$lib/sessionStorage.js';

// token is the authorization bearer token for making API requests.
export const token = sessionStorage('token');

// idToken is the user's idToken and contains OIDC information about them.
export const profile = sessionStorage('id_token');

// This is called when the initial access token is acquired from the oauth
// exchange.  It uses the token to rescope to a project, that's either selected
// from persistent storage, and as a fallback, just selects the first one the
// user has access too as a default.
export function setCredentials(accessToken, idToken) {
	// Set everything else up first, then update the token.
	// Everything should hang off the presence of a token, so we expect the
	// other details to be ready to be consumed by that point.
	profile.set(idToken);
	token.set(accessToken);
}

// Remove credentials i.e. on token expiry.
// It retains the ID token information for a login hint.
export function removeCredentials() {
	token.set(null);
}

// Fully logs out and forgets everything about a user.
export function logout() {
	token.set(null);
	profile.set(null);
}
