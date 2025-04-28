export const ssr = false;

import type { LayoutLoad } from './$types';

import * as Clients from '$lib/clients';
import * as Kubernetes from '$lib/openapi/kubernetes';

export const load: LayoutLoad = async ({ fetch, depends, parent }) => {
	depends('layout:virtualclusters');

	const { token, organizationID } = await parent();

	const clusters = Clients.kubernetes(
		token,
		fetch
	).apiV1OrganizationsOrganizationIDVirtualclustersGet({
		organizationID: organizationID
	});

	const regions = Clients.kubernetes(token, fetch).apiV1OrganizationsOrganizationIDRegionsGet({
		organizationID: organizationID,
		regionType: Kubernetes.RegionTypeParameter.Virtual
	});

	return {
		clusters: await clusters,
		regions: await regions
	};
};
