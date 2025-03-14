<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import { ProgressRing } from '@skeletonlabs/skeleton-svelte';

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
			{#each data.quotas.quotas as quota}
				<div class="flex flex-col gap-4 card border border-surface-200-800 shadow p-4">
					<div class="flex flex-col gap-2">
						<div class="h4">{quota.displayName}</div>
						<div class="italic text-sm text-surface-700">{quota.description}</div>
					</div>
					<div class="flex items-center gap-4">
						<ProgressRing
							value={quota.used}
							max={quota.quantity}
							showLabel
							trackStroke="stroke-primary-500/20"
							strokeWidth="0.75rem"
							labelFontSize={32}
						></ProgressRing>

						<div class="grid grid-cols-[auto_auto] gap-x-4">
							<div class="font-bold">Total</div>
							<div>{quota.quantity}</div>
							<div class="font-bold">Used</div>
							<div>{quota.used}</div>
							<div class="font-bold">Free</div>
							<div>{quota.free}</div>
							<div class="contents text-surface-700">
								<div class="font-bold">Committed</div>
								<div>{quota.committed}</div>
								<div class="font-bold">Reserved</div>
								<div>{quota.reserved}</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</ShellSection>
</ShellPage>
