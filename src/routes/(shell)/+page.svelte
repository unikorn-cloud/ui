<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import { ProgressRadial } from '@skeletonlabs/skeleton';
	//import { Chart, Svg, Axis, Bars, Group, LinearGradient, Arc, Text } from 'layerchart';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

	const settings: ShellPageSettings = {
		feature: 'None',
		name: 'Dashboard',
		description: 'Summary of your resources.'
	};
</script>

<ShellPage {settings}>
	<ShellSection title="Resource Utilization">
		<div class="flex flex-col lg:flex-row lg:flex-wrap gap-4">
			{#each data.quotas.capacity as quota, i}
				{@const metadata = data.quotaMetadata.find((x) => x.name == quota.kind)}
				{@const used = data.quotas.allocated[i].committed + data.quotas.allocated[i].reserved}
				{@const utilization = (used * 100) / quota.quantity}

				{#if metadata}
					<div class="flex flex-col gap-4 card bg-surface-50-900-token shadow p-4">
						<div class="flex flex-col gap-2">
							<div class="h4">{metadata.displayName}</div>
							<div class="italic text-sm text-surface-500">{metadata.description}</div>
						</div>
						<div class="flex items-center gap-4">
							<ProgressRadial
								value={utilization}
								meter="stroke-primary-500 dark:stroke-primary-50"
								track="stroke-primary-500/20"
								stroke={48}
								font={112}
							>
								{Math.round(utilization)}%
							</ProgressRadial>

							<div class="grid grid-cols-[auto_auto] gap-x-4">
								<div class="font-bold">Total</div>
								<div>{quota.quantity}</div>
								<div class="font-bold">Used</div>
								<div>{quota.quantity - data.quotas.free[i].quantity}</div>
								<div class="font-bold">Free</div>
								<div>{data.quotas.free[i].quantity}</div>
								<div class="contents text-surface-400-500-token">
									<div class="font-bold">Committed</div>
									<div>{data.quotas.allocated[i].committed}</div>
									<div class="font-bold">Reserved</div>
									<div>{data.quotas.allocated[i].reserved}</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</ShellSection>
</ShellPage>
