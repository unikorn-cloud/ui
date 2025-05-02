export const ssr = false;

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

	// Not logged in, redirect to the start of the login flow, remembering where
	// we were.
	if (!token) {
		window.sessionStorage.setItem('oidc_location', window.location.pathname);

		redirect(307, '/oauth2/login');
	}

	if (!profile) {
		error(500, 'OIDC ID token not set');
	}

	// Every view will need to know the organization the user is currently viewing,
	// we persist this across sessions.
	const organizations = await Clients.identity(fetch).apiV1OrganizationsGet();
	if (organizations.length == 0) {
		error(500, 'User is not a member of any organizations');
	}

	let organizationID = window.localStorage.getItem('organization_id');

	if (!organizationID || !organizations.find((o) => o.metadata.id == organizationID)) {
		organizationID = organizations[0].metadata.id;
	}

	// Some views will alter based on ACL data for that organization.
	const acl = await Clients.identity(fetch).apiV1OrganizationsOrganizationIDAclGet({
		organizationID: organizationID
	});

	return {
		profile: profile,
		organizations: organizations,
		organizationID: organizationID,
		acl: acl
	};
};
