export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:groups',
			operation: Identity.AclOperation.Update
		},

		{
			endpoint: 'identity:roles',
			operation: Identity.AclOperation.Read
		},
		{
			endpoint: 'identity:users',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, acl, allowed, groups } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			group: {} as Identity.GroupRead,
			roles: [] as Array<Identity.RoleRead>,
			users: [] as Array<Identity.UserRead>,
			serviceAccounts: [] as Array<Identity.ServiceAccountRead>,
			allowed: false
		};
	}

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
		serviceAccounts: await serviceAccounts,
		allowed: true
	};
};
