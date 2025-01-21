export const ssr = false;

import type { PageLoad } from './$types';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';

export const load: PageLoad = async ({ parent }) => {
	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:oauth2providers',
			operation: Identity.AclOperation.Create
		}
	];

	const { organizationID, acl, allowed } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			allowed: false
		};
	}

	return {
		allowed: true
	};
};
