<script lang="ts">
	import { InputChip } from '@skeletonlabs/skeleton';

	// Unique element name.
	export let name: string;

	// Value to bind to.
	export let value: Array<string>;

	// Label to attach describing the input.
	export let label: string;

	// Formatting hint.
	export let hint: string = '';
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<div>{label}</div>

		{#if hint}
			<div class="text-xs italic text-surface-500">{hint}</div>
		{/if}
	</div>

	<InputChip {name} bind:value />
</div>
