<script lang="ts">
	import { Slider } from '@skeletonlabs/skeleton-svelte';
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
		value: Array<number>;
		onValueChange: (e: { value: Array<number> }) => void;
		formatter?: NumberFormatter | null;
	}

	let {
		name,
		label,
		hint = '',
		min,
		max,
		step,
		value,
		onValueChange,
		formatter = null
	}: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<div>{label}</div>

		{#if hint}
			<div class="text-xs italic text-surface-700">{hint}</div>
		{/if}
	</div>

	<div class="flex gap-6 items-center">
		<Slider {value} {min} {max} {step} {onValueChange} />
		{#if formatter}
			<div>{formatter(value[0])}</div>
		{:else}
			<div>{value.map((x) => `${x}`).join('-')}</div>
		{/if}
	</div>
</div>
