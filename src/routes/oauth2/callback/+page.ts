export const ssr = false;

import Base64url from 'crypto-js/enc-base64url';
import SHA256 from 'crypto-js/sha256';
import { createRemoteJWKSet, jwtVerify } from 'jose';

import type { PageLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

import type { InternalToken } from '$lib/oauth2';
import * as OIDC from '$lib/oidc';

type OAuth2Error = {
	error: string;
	error_description: string;
};

export const load: PageLoad = async ({ url, fetch }) => {
	// Error checking...
	const nonce = window.sessionStorage.getItem('oidc_nonce');
	if (!nonce) {
		error(400, 'OIDC nonce not present in session store');
	}

	window.sessionStorage.removeItem('oidc_nonce');

	const code_verifier = window.sessionStorage.getItem('oauth2_code_challenge_verifier');
	if (!code_verifier) {
		error(400, 'Code verifier not present in session store');
	}

	window.sessionStorage.removeItem('oauth2_code_challenge_verifier');

	if (url.searchParams.has('error')) {
		error(
			400,
			`oauth2 authentication failed with error ${url.searchParams.get('error')}: ${url.searchParams.get('error_description')}`
		);
	}

	const code = url.searchParams.get('code');
	if (!code) {
		error(400, `oauth2 authentication did not respond with an authorization code`);
	}

	// Code exchange...
	const discovery = await OIDC.discovery(fetch);

	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		client_id: OIDC.clientID,
		client_secret: OIDC.clientSecret,
		redirect_uri: `${window.location.protocol}//${window.location.host}/oauth2/callback`,
		code: code,
		code_verifier: code_verifier
	});

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: body.toString()
	};

	const response = await fetch(discovery.token_endpoint, options);

	const result = await response.json();

	if (!response.ok) {
		const e = result as OAuth2Error;

		error(400, `oauth2 token exchange failed with error ${e.error}: ${e.error_description}`);
	}

	const jwks = createRemoteJWKSet(new URL(discovery.jwks_uri));

	const jwt = await jwtVerify(result.id_token, jwks, {
		issuer: discovery.issuer,
		audience: OIDC.clientID
	});

	const id_token = jwt.payload as OIDC.IDToken;
	if (id_token.nonce != SHA256(nonce).toString(Base64url)) {
		error(400, 'OIDC ID token nonce does not match, possible replay attack');
	}

	try {
		OIDC.compareAccessTokenHash(jwt, result.access_token);
	} catch (err) {
		const e = err as Error;

		error(400, `oauth2 access token error: ${e.message}`);
	}

	const token = result as InternalToken;

	// Set the expiry time so we know when to perform a rotation.
	// Add a little wiggle room in there to account for any latency.
	const expiry = new Date(Date.now());
	expiry.setSeconds(expiry.getSeconds() + token.expires_in - 60);

	token.expiry = expiry.toJSON();

	window.sessionStorage.setItem('token', JSON.stringify(token));
	window.sessionStorage.setItem('profile', JSON.stringify(id_token));

	redirect(307, window.sessionStorage.getItem('oauth2_location') || '/');
};
