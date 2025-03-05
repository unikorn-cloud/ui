<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	import { Popover } from '@skeletonlabs/skeleton-svelte';

	let open = $state(false);
</script>

<Popover
	{open}
	onOpenChange={(e) => (open = e.open)}
	contentBase="card bg-surface-50-950 shadow-lg p-4"
>
	{#snippet trigger()}
		<iconify-icon icon="mdi:dots-vertical" class="text-xl"></iconify-icon>
	{/snippet}

	{#snippet content()}
		<ul>
			{@render children?.()}
		</ul>
	{/snippet}
</Popover>
