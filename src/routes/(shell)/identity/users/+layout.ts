export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:users');

	const { token, organizationID } = await parent();

	const users = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDUsersGet({
		organizationID: organizationID
	});

	return {
		users: await users
	};
};
