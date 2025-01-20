export const ssr = false;

import type { PageLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { token, organizationID } = await parent();

	const clustermanagers = Clients.kubernetes(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDClustermanagersGet({
		organizationID: organizationID
	});

	return {
		clustermanagers: await clustermanagers
	};
};
