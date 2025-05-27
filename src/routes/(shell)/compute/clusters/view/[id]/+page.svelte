<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating, page } from '$app/state';

	let { data }: { data: PageData } = $props();

	import * as RegionUtil from '$lib/regionutil';
	import * as ProvisioningStatus from '$lib/provisioningStatus';
	import * as Compute from '$lib/openapi/compute';
	import * as Identity from '$lib/openapi/identity';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import SubtleButton from '$lib/forms/SubtleButton.svelte';
	import Flavor from '$lib/Flavor.svelte';
	import Image from '$lib/Image.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'View/update Compute Cluster',
		description: 'Update an existing compute cluster.',
		icon: 'mdi:server-network-outline'
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:clusters'), 5000);

		return () => clearInterval(interval);
	});

	function getPoolSpec(
		pool: Compute.ComputeClusterWorkloadPoolStatus
	): Compute.ComputeClusterWorkloadPool {
		return data.cluster.spec.workloadPools.find(
			(x) => x.name == pool.name
		) as Compute.ComputeClusterWorkloadPool;
	}

	function getFlavor(pool: Compute.ComputeClusterWorkloadPoolStatus): Compute.Flavor {
		const poolSpec = getPoolSpec(pool);
		return data.flavors.find((x) => x.metadata.id == poolSpec.machine.flavorId) as Compute.Flavor;
	}
</script>

<ShellPage {settings}>
	{#snippet tools()}
		<SubtleButton
			icon="mdi:edit-outline"
			label="Edit"
			href="/compute/clusters/edit/{page.params.id}"
		/>
	{/snippet}

	<ShellViewHeader metadata={data.cluster.metadata}>
		{#snippet badges()}
			<Badge icon={RegionUtil.icon(data.regions, data.cluster.spec.regionId)}>
				{RegionUtil.name(data.regions, data.cluster.spec.regionId)}
			</Badge>
		{/snippet}
	</ShellViewHeader>

	<ShellSection title="Machine Status">
		{#if data.cluster.status?.workloadPools}
			<ShellList>
				{#each data.cluster.status.workloadPools || [] as pool}
					{#each pool.machines || [] as machine}
						<ShellListItem>
							{#snippet main()}
								<div class="flex gap-4 items-center">
									<ShellListItemHeader title={machine.hostname} />
									<Flavor flavor={getFlavor(pool)} />
									<Image selector={getPoolSpec(pool).machine.image?.selector} />
								</div>
							{/snippet}

							{#snippet badges()}
								<ShellListItemBadges>
									{#snippet extra()}
										<Badge
											icon={ProvisioningStatus.statusIcon(
												machine.status as Identity.ResourceProvisioningStatus
											)}
											iconcolor={ProvisioningStatus.statusColor(machine.status)}
											>{machine.status as Identity.ResourceProvisioningStatus}</Badge
										>
									{/snippet}
								</ShellListItemBadges>
							{/snippet}

							{#if machine.privateIP}
								<ShellMetadataItem
									icon="mdi:local-area-network"
									label="Private IP"
									value={machine.privateIP}
								/>
							{/if}

							{#if machine.publicIP}
								<ShellMetadataItem
									icon="mdi:local-area-network"
									label="Public IP"
									value={machine.publicIP}
								/>
							{/if}
						</ShellListItem>
					{/each}
				{/each}
			</ShellList>
		{/if}
	</ShellSection>
</ShellPage>
