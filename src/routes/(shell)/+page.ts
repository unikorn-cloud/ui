export const ssr = false;

import type { PageLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { token, organizationID } = await parent();

	const quotaMetadata = Clients.identity(token, fetch).apiV1QuotasGet();

	const quotas = Clients.identity(token, fetch).apiV1OrganizationsOrganizationIDQuotasGet({
		organizationID: organizationID
	});

	return {
		quotaMetadata: await quotaMetadata,
		quotas: await quotas
	};
};
