export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:groups');

	const { token, organizationID } = await parent();

	const groups = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDGroupsGet({
		organizationID: organizationID
	});

	return {
		groups: await groups
	};
};
