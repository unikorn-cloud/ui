export const ssr = false;

import type { PageLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { token, organizationID } = await parent();

	const quotas = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDQuotasGet({
		organizationID: organizationID
	});

	return {
		quotas: await quotas
	};
};
