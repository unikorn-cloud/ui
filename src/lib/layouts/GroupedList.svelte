<script lang="ts">
	import type { Snippet } from 'svelte';

	import ShellList from '$lib/layouts/ShellList.svelte';

	interface Props {
		groups: Record<string, Array<any>>;
		header: Snippet<[string]>;
		item: Snippet<[any]>;
	}

	let { groups, header, item }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	{#each Object.keys(groups) as key}
		{@render header(key)}

		{#if groups[key].length}
			<ShellList>
				{#each groups[key] as group}
					{@render item(group)}
				{/each}
			</ShellList>
		{:else}
			There are no resources in this group, create one to get started.
		{/if}
	{/each}
</div>
