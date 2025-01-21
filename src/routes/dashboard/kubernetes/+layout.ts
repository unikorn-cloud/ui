export const ssr = false;

import type { LayoutLoad } from './$types';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Region from '$lib/openapi/region';
import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:kubernetes');

	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'region:regions',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, acl, allowed } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			projects: [] as Array<Identity.ProjectRead>,
			regions: [] as Array<Region.RegionRead>,
			allowed: false
		};
	}

	const projects = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDProjectsGet({
		organizationID: organizationID
	});

	const regions = Clients.region(token, fetch).apiV1OrganizationsOrganizationIDRegionsGet({
		organizationID: organizationID
	});

	return {
		projects: await projects,
		regions: await regions,
		allowed: true
	};
};
