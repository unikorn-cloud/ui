export const ssr = false;

import type { PageLoad } from './$types';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent }) => {
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

	const { token, organizationID, acl, allowed } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			roles: [] as Array<Identity.RoleRead>,
			users: [] as Array<Identity.UserRead>,
			allowed: false
		};
	}

	const roles = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDRolesGet({
		organizationID: organizationID
	});

	const users = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDUsersGet({
		organizationID: organizationID
	});

	return {
		roles: await roles,
		users: await users,
		allowed: true
	};
};
