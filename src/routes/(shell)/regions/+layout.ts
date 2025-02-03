export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:region');

	const { token, organizationID } = await parent();

	const projects = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDProjectsGet({
		organizationID: organizationID
	});

	const regions = Clients.region(token, fetch).apiV1OrganizationsOrganizationIDRegionsGet({
		organizationID: organizationID
	});

	return {
		projects: await projects,
		regions: await regions
	};
};
