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

	// TODO: move into the API.
	type QuotaMetadata = {
		title: string;
		description: string;
	};

	const metadata: Record<string, QuotaMetadata> = {
		clusters: {
			title: 'Clusters',
			description: 'All cluster types e.g. Kubernetes, compute, etc.'
		},
		servers: {
			title: 'Servers',
			description: 'All servers and virtual machines.'
		},
		gpus: {
			title: 'GPUs',
			description: 'General purpose GPUs for AI workloads.'
		}
	};
</script>

<ShellPage {settings} allowed={data.allowed}>
	<ShellSection title="Resource Utilization">
		<div class="flex flex-col lg:flex-row lg:flex-wrap gap-4">
			{#each data.quotas.capacity as quota, i}
				{@const used = data.quotas.allocated[i].committed + data.quotas.allocated[i].reserved}
				{@const utilization = (used * 100) / quota.quantity}

				<div class="flex flex-col gap-4 card bg-surface-50-900-token shadow p-4">
					<div class="flex flex-col gap-2">
						<div class="h4">{metadata[quota.kind].title}</div>
						<div class="italic text-sm text-surface-500">{metadata[quota.kind].description}</div>
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
			{/each}
		</div>
	</ShellSection>
</ShellPage>
