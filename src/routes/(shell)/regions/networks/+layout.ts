export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:networks');

	const { token, organizationID } = await parent();

	const networks = Clients.region(token, fetch).apiV1OrganizationsOrganizationIDNetworksGet({
		organizationID: organizationID
	});

	return {
		networks: await networks
	};
};
