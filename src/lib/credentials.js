import { sessionStorage } from '$lib/sessionStorage.js';

// token is the authorization bearer token for making API requests.
export const token = sessionStorage('token');

// email is the user's email address.
export const email = sessionStorage('email');

// This is called when the initial access token is acquired from the oauth
// exchange.  It uses the token to rescope to a project, that's either selected
// from persistent storage, and as a fallback, just selects the first one the
// user has access too as a default.
export function setCredentials(accessToken, emailAddress) {
	// Set everything else up first, then update the token.
	// Everything should hang off the presence of a token, so we expect the
	// other details to be ready to be consumed by that point.
	email.set(emailAddress);
	token.set(accessToken);
}

// Remove credentials i.e. on token expiry.
export function removeCredentials() {
	token.set(null);
	email.set(null);
}
