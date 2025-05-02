export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { organizationID, projects } = await parent();

	const project = projects.find((x) => x.metadata.id == params['id']);
	if (!project) {
		error(404, 'project not found');
	}

	const groups = Clients.identity(fetch).apiV1OrganizationsOrganizationIDGroupsGet({
		organizationID: organizationID
	});

	return {
		project: project,
		groups: await groups
	};
};
