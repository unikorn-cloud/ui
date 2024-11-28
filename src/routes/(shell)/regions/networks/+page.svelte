<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import Protected from '$lib/rbac/Protected.svelte';

	const settings: ShellPageSettings = {
		feature: 'Regions',
		name: 'Networks',
		description: 'Manage your networks'
	};

	import { onDestroy } from 'svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';
	import * as RegionUtil from '$lib/regionutil';
	import * as RBAC from '$lib/rbac';
	import * as Stores from '$lib/stores';

	let at: InternalToken;

	let projects: Array<Identity.ProjectRead>;
	let regions: Array<Region.RegionRead>;
	let networks: Array<Region.NetworkRead>;

	let organizationInfo: Stores.OrganizationInfo;

	// Define required RBAC rules.
	let allowed: boolean;

	let organizationScopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'region:networks',
			operation: Identity.AclOperation.Read
		}
	];

	Stores.organizationStore.subscribe((value: Stores.OrganizationInfo) => {
		organizationInfo = value;
	});

	token.subscribe((token: InternalToken): void => {
		at = token;
	});

	function update(
		at: InternalToken,
		organizationInfo: Stores.OrganizationInfo,
		allowed: boolean
	): void {
		if (!at || !organizationInfo || !allowed) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDNetworksGet(parameters)
			.then((v: Array<Region.NetworkRead>) => (networks = v))
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

	$: update(at, organizationInfo, allowed);

	const ticker = setInterval(() => update(at, organizationInfo, allowed), 5000);
	onDestroy(() => clearInterval(ticker));
</script>

<ShellPage {settings}>
	<Protected {organizationScopes} bind:allowed>
		<ShellList>
			{#each networks || [] as resource}
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
						{#if resource.metadata.tags}
							<ShellMetadataItem icon="mdi:tag-outline">
								{#each resource.metadata.tags as tag}
									<div class="badge variant-soft">{tag.name}: {tag.value}</div>
								{/each}
							</ShellMetadataItem>
						{/if}
					</svelte:fragment>
				</ShellListItem>
			{/each}
		</ShellList>
	</Protected>
</ShellPage>
