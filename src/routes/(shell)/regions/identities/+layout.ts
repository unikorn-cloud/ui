export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ depends, fetch, parent }) => {
	depends('layout:identities');

	const { token, organizationID } = await parent();

	const identities = Clients.region(token, fetch).apiV1OrganizationsOrganizationIDIdentitiesGet({
		organizationID: organizationID
	});

	return {
		identities: await identities
	};
};
