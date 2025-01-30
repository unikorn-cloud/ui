export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:projects',
			operation: Identity.AclOperation.Update
		},
		{
			endpoint: 'identity:groups',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, acl, allowed, projects } = await parent();

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			project: {} as Identity.ProjectRead,
			groups: [] as Array<Identity.GroupRead>,
			allowed: false
		};
	}

	const project = projects.find((x) => x.metadata.id == params['id']);
	if (!project) {
		error(404, 'project not found');
	}

	const groups = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDGroupsGet({
		organizationID: organizationID
	});

	return {
		project: project,
		groups: await groups,
		allowed: true
	};
};
