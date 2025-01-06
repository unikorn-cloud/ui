<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import type { NumberFormatter } from '$lib/formatters';

	interface Props {
		// Unique element name.
		name: string;
		// Label to attach describing the input.
		label: string;
		// Formatting hint.
		hint?: string;
		min: number;
		max: number;
		step: number;
		value: number | undefined;
		formatter?: NumberFormatter | null;
	}

	let {
		name,
		label,
		hint = '',
		min,
		max,
		step,
		value = $bindable(),
		formatter = null
	}: Props = $props();
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
