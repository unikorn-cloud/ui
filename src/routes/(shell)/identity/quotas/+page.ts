export const ssr = false;

import type { PageLoad } from './$types';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent }) => {
	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:quotas',
			operation: Identity.AclOperation.Update
		}
	];

	const { token, organizationID, acl, allowed } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			quotas: {} as Identity.QuotasRead,
			allowed: false
		};
	}

	const quotas = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDQuotasGet({
		organizationID: organizationID
	});

	return {
		quotas: await quotas,
		allowed: true
	};
};
