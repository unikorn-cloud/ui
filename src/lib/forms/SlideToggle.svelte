<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';

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
			<div class="text-xs italic text-surface-700-300">{hint}</div>
		{/if}
	</div>

	<Switch {name} checked onCheckedChange={(e) => (checked = e.checked)} />
</div>
