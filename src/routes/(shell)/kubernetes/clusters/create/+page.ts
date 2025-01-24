export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, url }) => {
	const { token, organizationID } = await parent();

	const clustermanagers = Clients.kubernetes(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDClustermanagersGet({
		organizationID: organizationID
	});

	const regionID = url.searchParams.get('regionID');
	if (!regionID) {
		error(400, 'region ID not in query');
	}

	const images = Clients.kubernetes(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet({
		organizationID: organizationID,
		regionID: regionID
	});

	const flavors = Clients.kubernetes(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet({
		organizationID: organizationID,
		regionID: regionID
	});

	return {
		clustermanagers: await clustermanagers,
		images: await images,
		flavors: await flavors
	};
};
