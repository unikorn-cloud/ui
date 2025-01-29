<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import * as RegionUtil from '$lib/regionutil';
	import * as Status from '$lib/status';
	import * as Compute from '$lib/openapi/compute';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import Flavor from '$lib/Flavor.svelte';
	import Image from '$lib/Image.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'View/update Compute Cluster',
		description: 'Update an existing compute cluster.'
	};

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

<ShellPage {settings} allowed={data.allowed}>
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
						<ShellListItem icon="mdi:server">
							{#snippet main()}
								<ShellListItemHeader title={machine.hostname} />
							{/snippet}

							<ShellListItemBadges>
								{#snippet extra()}
									<Badge
										icon={Status.statusIcon(machine.status)}
										iconcolor={Status.statusColor(machine.status)}>{machine.status}</Badge
									>
								{/snippet}
							</ShellListItemBadges>

							<Flavor flavor={getFlavor(pool)} />
							<Image selector={getPoolSpec(pool).machine.image?.selector} />

							<div class="flex flex-col gap-2">
								{#if machine.privateIP}
									<div class="text-sm">
										<span class="font-bold">Private IP</span>
										{machine.privateIP}
									</div>
								{/if}

								{#if machine.publicIP}
									<div class="text-sm">
										<span class="font-bold">Public IP</span>
										{machine.publicIP}
									</div>
								{/if}
							</div>
						</ShellListItem>
					{/each}
				{/each}
			</ShellList>
		{/if}
	</ShellSection>
</ShellPage>
