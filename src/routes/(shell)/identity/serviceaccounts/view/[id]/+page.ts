export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:serviceaccounts',
			operation: Identity.AclOperation.Update
		},
		{
			endpoint: 'identity:groups',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, acl, allowed, serviceAccounts } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			serviceAccount: {} as Identity.ServiceAccountRead,
			groups: [] as Array<Identity.GroupRead>,
			allowed: false
		};
	}

	const serviceAccount = serviceAccounts.find((x) => x.metadata.id == params['id']);
	if (!serviceAccount) {
		error(404, 'service account not found');
	}

	const groups = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDGroupsGet({
		organizationID: organizationID
	});

	return {
		serviceAccount: serviceAccount,
		groups: await groups,
		allowed: true
	};
};
