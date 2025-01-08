import { browser } from '$app/environment';

import * as OIDC from '$lib/oidc';
import type { InternalToken } from '$lib/oauth2';
import { token, profile } from '$lib/credentials';

import Base64url from 'crypto-js/enc-base64url';
import SHA256 from 'crypto-js/sha256';

export function login() {
	let claims: OIDC.IDToken;

	// Get the ID token first, as we can use it, if it exists to aid login below...
	profile.subscribe((value: OIDC.IDToken) => {
		claims = value;
	});

	token.subscribe(async (at: InternalToken) => {
		if (!browser) {
			return;
		}

		// Don't login when we're in the UI and we already have a token.
		if (at) {
			return;
		}

		const oidc = await OIDC.discovery();

		const nonceBytes = new Uint8Array(16);
		crypto.getRandomValues(nonceBytes);

		const nonce = btoa(nonceBytes.toString());
		const nonceHash = SHA256(nonce).toString(Base64url);

		window.sessionStorage.setItem('oidc_nonce', nonce);

		/* Kck off the oauth2/oidc authentication code flow */
		/* TODO: it may be better to use Passport */
		let codeChallengeVerifierBytes = new Uint8Array(32);
		crypto.getRandomValues(codeChallengeVerifierBytes);

		const codeChallengeVerifier = btoa(codeChallengeVerifierBytes.toString());
		const codeChallenge = SHA256(codeChallengeVerifier).toString(Base64url);

		window.sessionStorage.setItem('oauth2_code_challenge_verifier', codeChallengeVerifier);
		window.sessionStorage.setItem('oauth2_location', window.location.pathname);

		// TODO: set a nonce
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: OIDC.clientID,
			redirect_uri: `${window.location.protocol}//${window.location.host}/oauth2/callback`,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge,
			scope: 'openid email profile',
			nonce: nonceHash
		});

		// Set the login hint if we can as that avoids the login prompt.
		if (claims && claims.email) {
			query.set('login_hint', claims.email);
		}

		const url = new URL(oidc.authorization_endpoint);
		url.search = query.toString();

		document.location = url.toString();
	});
}
