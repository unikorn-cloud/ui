export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:serviceaccounts');

	const { organizationID } = await parent();

	const serviceAccounts = Clients.identity(
		fetch
	).apiV1OrganizationsOrganizationIDServiceaccountsGet({
		organizationID: organizationID
	});

	return {
		serviceAccounts: await serviceAccounts
	};
};
