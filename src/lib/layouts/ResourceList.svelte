<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		columns: number;
		items: Array<any>;
		normal: Snippet<[any, number]>;
		expanded: Snippet<[any, number]>;
		active: number;
	}

	let { columns, items, normal, expanded, active = $bindable(-1) }: Props = $props();

	let style = $derived('grid-template-columns:' + ' max-content'.repeat(columns - 1) + ' 1fr;');
</script>

<div class="grid gap-x-6 gap-y-2" {style}>
	{#each items as item, index}
		{#if active == index}
			<div class="col-span-full grid card bg-surface-50-900-token shadow-sm p-4">
				{@render expanded(item, index)}
			</div>
		{:else}
			<div
				class="col-span-full grid grid-cols-subgrid items-center card bg-surface-50-900-token shadow-sm p-4"
			>
				{@render normal(item, index)}
			</div>
		{/if}
	{/each}
</div>
