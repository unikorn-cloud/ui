<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';

	const settings: ShellPageSettings = {
		feature: 'Regions',
		name: 'Physical Networks',
		description: 'Manage your physical networks'
	};

	import { onDestroy } from 'svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';
	import * as RegionUtil from '$lib/regionutil';

	let at: InternalToken;

	let projects: Array<Identity.ProjectRead>;
	let regions: Array<Region.RegionRead>;
	let physicalNetworks: Array<Region.PhysicalNetworkRead>;

	let organizationID: string;

	organizationStore.subscribe((value: string) => {
		organizationID = value;
		update();
	});

	token.subscribe((token: InternalToken): void => {
		at = token;
		update();
	});

	const ticker = setInterval(update, 5000);
	onDestroy(() => clearInterval(ticker));

	function update(): void {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDPhysicalnetworksGet(parameters)
			.then((v: Array<Region.PhysicalNetworkRead>) => (physicalNetworks = v))
			.catch((e: Error) => Clients.error(e));

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsGet(parameters)
			.then((v: Array<Region.RegionRead>) => (regions = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsGet(parameters)
			.then((v: Array<Identity.ProjectRead>) => (projects = v))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<ShellList>
		{#each physicalNetworks || [] as resource}
			<ShellListItem metadata={resource.metadata} {projects}>
				<svelte:fragment slot="badges">
					<Badge icon={RegionUtil.icon(regions, resource.spec.regionId)}>
						{RegionUtil.name(regions, resource.spec.regionId)}
					</Badge>
				</svelte:fragment>

				<svelte:fragment slot="metadata">
					<ShellMetadataItem icon="mdi:network-outline">
						{resource.spec.prefix}
					</ShellMetadataItem>
					<ShellMetadataItem icon="mdi:dns-outline">
						{resource.spec.dnsNameservers.join(', ')}
					</ShellMetadataItem>
					<ShellMetadataItem icon="mdi:nic">
						{resource.spec.openstack?.vlanId}
					</ShellMetadataItem>
					{#if resource.spec.tags}
						<ShellMetadataItem icon="mdi:tag-outline">
							{#each resource.spec.tags as tag}
								<div class="badge variant-soft">{tag.name}: {tag.value}</div>
							{/each}
						</ShellMetadataItem>
					{/if}
				</svelte:fragment>
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
