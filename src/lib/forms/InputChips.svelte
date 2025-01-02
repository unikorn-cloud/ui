<script lang="ts">
	import { InputChip } from '@skeletonlabs/skeleton';

	interface Props {
		// Unique element name.
		name: string;
		// Value to bind to.
		value: Array<string>;
		// Label to attach describing the input.
		label: string;
		// Formatting hint.
		hint?: string;
	}

	let { name, value = $bindable(), label, hint = '' }: Props = $props();
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
