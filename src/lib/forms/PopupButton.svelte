<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		icon: string;
		label: string;
		disabled?: boolean;
		contents: Snippet;
		[key: string]: any;
	}

	let { id, icon, label, disabled = $bindable(), contents, ...props }: Props = $props();

	import { Popover } from '@skeletonlabs/skeleton-svelte';

	let open = $state(false);
</script>

<Popover
	{open}
	onOpenChange={(e) => (open = e.open)}
	contentBase="card bg-surface-50-950 p-4 shadow-lg"
>
	{#snippet trigger()}
		<div class="flex gap-2 items-center {props.class || ''}">
			<iconify-icon {icon}> </iconify-icon>
			{label}
		</div>
	{/snippet}

	{#snippet content()}
		{@render contents()}
	{/snippet}
</Popover>
