<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';

	let { data }: { data: PageData } = $props();

	import * as RegionUtil from '$lib/regionutil';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';

	const settings: ShellPageSettings = {
		feature: 'Regions',
		name: 'Networks',
		description: 'Manage your networks'
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:networks'), 5000);

		return () => clearInterval(interval);
	});
</script>

<ShellPage {settings}>
	<ShellList>
		{#each data.networks as resource}
			<ShellListItem icon="mdi:network-outline">
				{#snippet main()}
					<ShellListItemHeader metadata={resource.metadata} projects={data.projects} />
				{/snippet}

				<ShellListItemBadges metadata={resource.metadata}>
					{#snippet extra()}
						<Badge icon={RegionUtil.icon(data.regions, resource.spec.regionId)}>
							{RegionUtil.name(data.regions, resource.spec.regionId)}
						</Badge>
					{/snippet}
				</ShellListItemBadges>

				<ShellListItemMetadata metadata={resource.metadata} />

				<ShellListItemMetadata>
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
				</ShellListItemMetadata>
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
