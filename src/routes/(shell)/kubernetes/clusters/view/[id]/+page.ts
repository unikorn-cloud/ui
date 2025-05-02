export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { organizationID, clusters } = await parent();

	const cluster = clusters.find((x) => params['id'] == x.metadata.id);
	if (!cluster) {
		error(404, 'kubernetes cluster not found');
	}

	const clustermanagers = Clients.kubernetes(
		fetch
	).apiV1OrganizationsOrganizationIDClustermanagersGet({
		organizationID: organizationID
	});

	const images = Clients.kubernetes(fetch).apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet(
		{
			organizationID: organizationID,
			regionID: cluster.spec.regionId
		}
	);

	const flavors = Clients.kubernetes(
		fetch
	).apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet({
		organizationID: organizationID,
		regionID: cluster.spec.regionId
	});

	return {
		cluster: cluster,
		clustermanagers: await clustermanagers,
		images: await images,
		flavors: await flavors
	};
};
