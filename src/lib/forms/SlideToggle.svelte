<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';

	// Unique element name.
	export let name: string;

	// Whether the toggle is checked.
	export let checked: boolean;

	// Label to attach describing the input.
	export let label: string;

	// Formatting hint.
	export let hint: string = '';
</script>

<div class="flex gap-4 items-center justify-between">
	<div class="flex flex-col gap-1">
		<div>{label}</div>

		{#if hint}
			<div class="text-xs italic text-surface-500">{hint}</div>
		{/if}
	</div>

	<SlideToggle {name} bind:checked />
</div>
