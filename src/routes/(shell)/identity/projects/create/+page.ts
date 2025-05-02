export const ssr = false;

import type { PageLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { organizationID } = await parent();

	const groups = Clients.identity(fetch).apiV1OrganizationsOrganizationIDGroupsGet({
		organizationID: organizationID
	});

	return {
		groups: await groups
	};
};
