export const ssr = false;

import type { LayoutLoad } from './$types';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Region from '$lib/openapi/region';
import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ depends, parent }) => {
	depends('layout:identities');

	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'region:identities',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, acl, allowed } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			identities: [] as Array<Region.IdentityRead>,
			allowed: false
		};
	}

	const identities = Clients.region(token, fetch).apiV1OrganizationsOrganizationIDIdentitiesGet({
		organizationID: organizationID
	});

	return {
		identities: await identities,
		allowed: true
	};
};
