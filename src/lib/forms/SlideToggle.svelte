<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';

	interface Props {
		// Unique element name.
		name: string;
		// Whether the toggle is checked.
		checked: boolean;
		// Label to attach describing the input.
		label: string;
		// Formatting hint.
		hint?: string;
	}

	let { name, checked = $bindable(), label, hint = '' }: Props = $props();
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
