export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:oauth2providers');

	const { token, organizationID } = await parent();

	const oauth2providers = Clients.identity(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDOauth2providersGet({
		organizationID: organizationID
	});

	return {
		oauth2providers: await oauth2providers
	};
};
