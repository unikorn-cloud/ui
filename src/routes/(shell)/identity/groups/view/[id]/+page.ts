export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { token, organizationID, groups } = await parent();

	const group = groups.find((x) => x.metadata.id == params['id']);
	if (!group) {
		error(404, 'group not found');
	}

	const roles = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDRolesGet({
		organizationID: organizationID
	});

	const users = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDUsersGet({
		organizationID: organizationID
	});

	const serviceAccounts = Clients.identity(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDServiceaccountsGet({
		organizationID: organizationID
	});

	return {
		group: group,
		roles: await roles,
		users: await users,
		serviceAccounts: await serviceAccounts
	};
};
