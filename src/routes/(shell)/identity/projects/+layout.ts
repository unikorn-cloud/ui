export const ssr = false;

import type { LayoutLoad } from './$types';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:projects');

	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:projects',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, acl, allowed } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			projects: [] as Array<Identity.ProjectRead>,
			allowed: false
		};
	}

	const projects = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDProjectsGet({
		organizationID: organizationID
	});

	return {
		projects: await projects,
		allowed: allowed
	};
};
