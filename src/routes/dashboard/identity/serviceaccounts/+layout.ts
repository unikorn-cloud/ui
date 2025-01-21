export const ssr = false;

import type { LayoutLoad } from './$types';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:serviceaccounts');

	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:serviceaccounts',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, acl, allowed } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			serviceAccounts: [] as Array<Identity.ServiceAccountRead>,
			allowed: false
		};
	}

	const serviceAccounts = Clients.identity(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDServiceaccountsGet({
		organizationID: organizationID
	});

	return {
		serviceAccounts: await serviceAccounts,
		allowed: allowed
	};
};
