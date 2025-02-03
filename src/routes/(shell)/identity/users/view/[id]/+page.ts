export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { token, organizationID, users } = await parent();

	const user = users.find((x) => x.metadata.id == params['id']);
	if (!user) {
		error(404, 'user not found');
	}

	const groups = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDGroupsGet({
		organizationID: organizationID
	});

	return {
		user: user,
		groups: await groups
	};
};
