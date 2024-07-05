<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import type { NumberFormatter } from '$lib/formatters';

	// Unique element name.
	export let name: string;

	// Label to attach describing the input.
	export let label: string;

	// Formatting hint.
	export let hint: string = '';

	export let min: number;

	export let max: number;

	export let step: number;

	export let value: number | undefined;

	export let formatter: NumberFormatter | null = null;
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<div>{label}</div>

		{#if hint}
			<div class="text-xs italic text-surface-500">{hint}</div>
		{/if}
	</div>

	<div class="flex gap-6">
		<RangeSlider {name} class="grow" {min} {max} {step} bind:value />
		{#if formatter}
			<div>{formatter(value || 0)}</div>
		{:else}
			<div>{value}</div>
		{/if}
	</div>
</div>
