export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:clusters');

	const { token, organizationID } = await parent();

	const clusters = Clients.compute(token, fetch).apiV1OrganizationsOrganizationIDClustersGet({
		organizationID: organizationID
	});

	return {
		clusters: await clusters
	};
};
