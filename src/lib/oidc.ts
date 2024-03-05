import Base64url from 'crypto-js/enc-base64url';
import SHA512 from 'crypto-js/sha512';
import CryptoJS from 'crypto-js/core';

import { env } from '$env/dynamic/public';

// These are required variables from the environment.
export const oidcIssuer = env.PUBLIC_OAUTH2_ISSUER;
export const oidcClientID = env.PUBLIC_OAUTH2_CLIENT_ID;

// This is some of what's offered by the API, just enough
// to function for now.
export type OIDCDiscovery = {
	issuer: string;
	authorization_endpoint: string;
	token_endpoint: string;
	jwks_uri: string;
};

// Return something that promises to return discovery data.
export function oidcDiscovery(): Promise<OIDCDiscovery> {
	const discoveryURL = `${oidcIssuer}/.well-known/openid-configuration`;
	const discoveryOptions = {
		method: 'GET'
	};

	return fetch(discoveryURL, discoveryOptions)
		.then((response) => response.json())
		.catch((error) => console.log(error));
}

// See OIDC Core 1.0 sections 3.1.3.6, 3.1.3.8.
export function compareAccessTokenHash(jwt, at) {
	let atHash;

	switch (jwt.protectedHeader.alg) {
		case 'ES512':
			{
				const sum = SHA512(at);

				atHash = Base64url.stringify(
					CryptoJS.lib.WordArray.create(
						sum.words.slice(0, sum.words.length >> 1),
						sum.sigBytes >> 1
					)
				);
			}

			break;
		default:
			throw `unhandled hash algorithm ${jwt.protectedHeader.alg}`;
	}

	if (atHash != jwt.payload.at_hash) {
		throw `access token hash mismatch`;
	}
}
