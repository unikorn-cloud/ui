<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
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

	// Define required RBAC rules.
	let allowed: boolean = $state(false);

	let organizationScopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'region:networks',
			operation: Identity.AclOperation.Read
		}
	];

	// Grab the organization scope.
	let organizationInfo = $state() as Stores.OrganizationInfo;

	Stores.organizationStore.subscribe((value: Stores.OrganizationInfo) => {
		organizationInfo = value;
	});

	// Grab the acces token.
	let at = $state() as InternalToken;

	token.subscribe((token: InternalToken): void => {
		at = token;
	});

	// Grab the main resources from the API.
	let projects: Array<Identity.ProjectRead> | undefined = $state();
	let regions: Array<Region.RegionRead> | undefined = $state();
	let networks: Array<Region.NetworkRead> | undefined = $state();

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

	run(() => {
		update(at, organizationInfo, allowed);
	});

	const ticker = setInterval(() => update(at, organizationInfo, allowed), 5000);
	onDestroy(() => clearInterval(ticker));
</script>

<ShellPage {settings}>
	<Protected {organizationScopes} bind:allowed>
		<ShellList>
			{#if networks && regions && projects}
				{#each networks as resource}
					<ShellListItem icon="mdi:network-outline">
						<ShellListItemHeader metadata={resource.metadata} {projects} />

						<ShellListItemBadges metadata={resource.metadata}>
							{#snippet extra()}
								<Badge icon={RegionUtil.icon(regions, resource.spec.regionId)}>
									{RegionUtil.name(regions, resource.spec.regionId)}
								</Badge>
							{/snippet}
						</ShellListItemBadges>

						<ShellListItemMetadata metadata={resource.metadata}>
							{#snippet extra()}
								<ShellMetadataItem
									icon="mdi:network-outline"
									label="Prefix"
									value={resource.spec.prefix}
								/>
								<ShellMetadataItem
									icon="mdi:dns-outline"
									label="DNS Nameservers"
									value={resource.spec.dnsNameservers.join(', ')}
								/>
								{#if resource.spec.openstack?.vlanId}
									<ShellMetadataItem
										icon="mdi:nic"
										label="VLAN ID"
										value={resource.spec.openstack.vlanId.toString()}
									/>
								{/if}
								{#if resource.metadata.tags}
									<ShellMetadataItem icon="mdi:tag-outline" label="Tags">
										{#each resource.metadata.tags as tag}
											<div class="badge variant-soft">{tag.name}: {tag.value}</div>
										{/each}
									</ShellMetadataItem>
								{/if}
							{/snippet}
						</ShellListItemMetadata>
					</ShellListItem>
				{/each}
			{/if}
		</ShellList>
	</Protected>
</ShellPage>
