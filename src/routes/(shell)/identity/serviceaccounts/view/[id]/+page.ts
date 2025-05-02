export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { organizationID, serviceAccounts } = await parent();

	const serviceAccount = serviceAccounts.find((x) => x.metadata.id == params['id']);
	if (!serviceAccount) {
		error(404, 'service account not found');
	}

	const groups = Clients.identity(fetch).apiV1OrganizationsOrganizationIDGroupsGet({
		organizationID: organizationID
	});

	return {
		serviceAccount: serviceAccount,
		groups: await groups
	};
};
