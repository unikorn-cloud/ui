export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, url }) => {
	const { organizationID } = await parent();

	const regionID = url.searchParams.get('regionID');
	if (!regionID) {
		error(400, 'region ID not in query');
	}

	const images = Clients.kubernetes(fetch).apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet(
		{
			organizationID: organizationID,
			regionID: regionID
		}
	);

	const flavors = Clients.kubernetes(
		fetch
	).apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet({
		organizationID: organizationID,
		regionID: regionID
	});

	return {
		images: await images,
		flavors: await flavors
	};
};
