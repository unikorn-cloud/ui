export const ssr = false;

import type { LayoutLoad } from './$types';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Region from '$lib/openapi/region';
import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:networks');

	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'region:networks',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, acl, allowed } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			networks: [] as Array<Region.NetworkRead>,
			allowed: false
		};
	}

	const networks = Clients.region(token, fetch).apiV1OrganizationsOrganizationIDNetworksGet({
		organizationID: organizationID
	});

	return {
		networks: await networks,
		allowed: true
	};
};
