export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:users',
			operation: Identity.AclOperation.Update
		},
		{
			endpoint: 'identity:groups',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, acl, allowed, users } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			user: {} as Identity.UserRead,
			groups: [] as Array<Identity.GroupRead>,
			allowed: false
		};
	}

	const user = users.find((x) => x.metadata.id == params['id']);
	if (!user) {
		error(404, 'user not found');
	}

	const groups = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDGroupsGet({
		organizationID: organizationID
	});

	return {
		user: user,
		groups: await groups,
		allowed: true
	};
};
