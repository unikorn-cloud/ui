import { browser } from '$app/environment';

import * as OIDC from '$lib/oidc';
import { token, profile } from '$lib/credentials';

import Base64url from 'crypto-js/enc-base64url';
import SHA256 from 'crypto-js/sha256';

export enum LoginType {
	// Normal login flow will set the credentials in the browser.
	Normal = 'normal',
	// PAT flow will return the credentials as a POST.
	PAT = 'pat'
}

export interface Oauth2State {
	type: LoginType;
}

export function login() {
	loginWithType(LoginType.Normal);
}

export function loginWithType(loginType: LoginType) {
	let claims: { email: string } | undefined;

	// Get the ID token first, as we can use it, if it exists to aid login below...
	profile.subscribe((value) => {
		if (!value) {
			claims = undefined;
			return;
		}

		claims = JSON.parse(value);
	});

	token.subscribe(async (token) => {
		/* When a token isn't set, and its on the browser, do authentication */
		if (!browser || (loginType == LoginType.Normal && token)) {
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

		const state: Oauth2State = {
			type: loginType
		};

		// TODO: set a nonce
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: OIDC.clientID,
			redirect_uri: `${window.location.protocol}//${window.location.host}/oauth2/callback`,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge,
			scope: 'openid email profile',
			nonce: nonceHash,
			state: JSON.stringify(state)
		});

		// Set the login hint if we can as that avoids the login prompt.
		if (claims) {
			query.set('login_hint', claims.email);
		}

		const url = new URL(oidc.authorization_endpoint);
		url.search = query.toString();

		document.location = url.toString();
	});
}
