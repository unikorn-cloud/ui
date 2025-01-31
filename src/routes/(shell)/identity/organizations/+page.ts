export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as RBAC from '$lib/rbac';
import * as Identity from '$lib/openapi/identity';
import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent }) => {
	const scopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:organizations',
			operation: Identity.AclOperation.Update
		},
		{
			endpoint: 'identity:oauth2providers',
			operation: Identity.AclOperation.Read
		}
	];

	const { token, organizationID, organizations, acl, allowed } = await parent();

	const organization = organizations.find((x) => x.metadata.id == organizationID);
	if (!organization) {
		error(404, 'organization not found');
	}

	if (!allowed || !RBAC.organizationScopesAllowed(acl, organizationID, scopes)) {
		return {
			organization: organization,
			oauth2providers: [] as Array<Identity.Oauth2ProviderRead>,
			orgOauth2providers: [] as Array<Identity.Oauth2ProviderRead>,
			allowed: false
		};
	}

	const oauth2providers = Clients.identity(token, fetch).apiV1Oauth2providersGet();

	const orgOauth2providers = Clients.identity(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDOauth2providersGet({ organizationID: organizationID });

	return {
		organization: organization,
		oauth2providers: await oauth2providers,
		orgOauth2providers: await orgOauth2providers,
		allowed: true
	};
};
