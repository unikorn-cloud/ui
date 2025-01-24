export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:clustermanagers');

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
