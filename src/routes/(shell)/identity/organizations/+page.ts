export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { token, organizationID, organizations } = await parent();

	const organization = organizations.find((x) => x.metadata.id == organizationID);
	if (!organization) {
		error(404, 'organization not found');
	}

	const oauth2providers = Clients.identity(token, fetch).apiV1Oauth2providersGet();

	const orgOauth2providers = Clients.identity(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDOauth2providersGet({ organizationID: organizationID });

	return {
		organization: organization,
		oauth2providers: await oauth2providers,
		orgOauth2providers: await orgOauth2providers
	};
};
