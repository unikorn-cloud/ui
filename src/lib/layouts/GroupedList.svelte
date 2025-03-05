<script lang="ts">
	import type { Snippet } from 'svelte';

	import ShellList from '$lib/layouts/ShellList.svelte';

	interface Props {
		groups: Record<string, Array<any>>;
		header: Snippet<[string]>;
		option: Snippet<[string]>;
		item: Snippet<[any]>;
	}

	let { groups, header, option, item }: Props = $props();

	let value = $state('');
</script>

<div class="flex flex-col gap-4">
	<div class="input-group grid-cols-[auto_1fr] shadow-lg max-w-max">
		<div class="ig-cell">
			<iconify-icon icon="mdi:filter-outline" class="text-primary-500 text-lg"></iconify-icon>
		</div>
		<select class="select" bind:value>
			<option value="">all</option>

			{#each Object.keys(groups) as key}
				<option value={key}>
					{@render option(key)}
				</option>
			{/each}
		</select>
	</div>

	{#each Object.keys(groups) as key}
		{#if !value || value == key}
			{@render header(key)}

			{#if groups[key].length}
				<ShellList>
					{#each groups[key] as group}
						{@render item(group)}
					{/each}
				</ShellList>
			{/if}
		{/if}
	{/each}
</div>
