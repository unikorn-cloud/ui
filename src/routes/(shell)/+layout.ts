export const ssr = false;

import Base64url from 'crypto-js/enc-base64url';
import SHA256 from 'crypto-js/sha256';

import type { LayoutLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

import * as Clients from '$lib/clients';
import type { InternalToken } from '$lib/oauth2';
import * as OIDC from '$lib/oidc';

function getSessionData<Type>(key: string): Type | undefined {
	const data = window.sessionStorage.getItem(key);
	if (!data) return;

	return JSON.parse(data) as Type;
}

export const load: LayoutLoad = async ({ fetch, depends }) => {
	depends('app:organization_id');

	const token = getSessionData<InternalToken>('token');
	const profile = getSessionData<OIDC.IDToken>('profile');

	if (!token) {
		const oidc = await OIDC.discovery();

		const nonceBytes = new Uint8Array(16);
		crypto.getRandomValues(nonceBytes);

		const nonce = btoa(nonceBytes.toString());
		const nonceHash = SHA256(nonce).toString(Base64url);

		window.sessionStorage.setItem('oidc_nonce', nonce);

		/* Kck off the oauth2/oidc authentication code flow */
		const codeChallengeVerifierBytes = new Uint8Array(32);
		crypto.getRandomValues(codeChallengeVerifierBytes);

		const codeChallengeVerifier = btoa(codeChallengeVerifierBytes.toString());
		const codeChallenge = SHA256(codeChallengeVerifier).toString(Base64url);

		window.sessionStorage.setItem('oauth2_code_challenge_verifier', codeChallengeVerifier);
		window.sessionStorage.setItem('oauth2_location', window.location.pathname);

		const query = new URLSearchParams({
			response_type: 'code',
			client_id: OIDC.clientID,
			redirect_uri: `${window.location.protocol}//${window.location.host}/oauth2/callback`,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge,
			scope: 'openid email profile',
			nonce: nonceHash
		});

		if (profile?.email) {
			query.set('login_hint', profile.email);
		}

		const url = new URL(oidc.authorization_endpoint);
		url.search = query.toString();

		redirect(307, url.toString());
	}

	if (!profile) {
		error(500, 'OIDC ID token not set');
	}

	// Every view will need to know the organization the user is currently viewing,
	// we persist this across sessions.
	const organizations = await Clients.identity(token, fetch).apiV1OrganizationsGet();
	if (organizations.length == 0) {
		error(500, 'User is not a member of any organizations');
	}

	let organizationID = window.localStorage.getItem('organization_id');

	if (!organizationID || !organizations.find((o) => o.metadata.id == organizationID)) {
		organizationID = organizations[0].metadata.id;
	}

	// Some views will alter based on ACL data for that organization.
	const acl = await Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDAclGet({
		organizationID: organizationID
	});

	return {
		profile: profile,
		token: token,
		organizations: organizations,
		organizationID: organizationID,
		acl: acl,
		allowed: true
	};
};
