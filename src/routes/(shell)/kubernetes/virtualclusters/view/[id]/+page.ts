export const ssr = false;

import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as Clients from '$lib/clients';

export const load: PageLoad = async ({ fetch, parent, params }) => {
	const { token, organizationID, clusters } = await parent();

	const cluster = clusters.find((x) => params['id'] == x.metadata.id);
	if (!cluster) {
		error(404, 'kubernetes cluster not found');
	}

	const flavors = Clients.kubernetes(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet({
		organizationID: organizationID,
		regionID: cluster.spec.regionId
	});

	return {
		cluster: cluster,
		flavors: await flavors
	};
};
