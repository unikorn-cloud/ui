export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';
import * as Kubernetes from '$lib/openapi/kubernetes';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:clusters');

	const { organizationID } = await parent();

	const clusters = Clients.kubernetes(fetch).apiV1OrganizationsOrganizationIDClustersGet({
		organizationID: organizationID
	});

	const regions = Clients.kubernetes(fetch).apiV1OrganizationsOrganizationIDRegionsGet({
		organizationID: organizationID,
		regionType: Kubernetes.RegionTypeParameter.Physical
	});

	return {
		clusters: await clusters,
		regions: await regions
	};
};
