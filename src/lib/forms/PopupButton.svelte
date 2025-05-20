<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		label: string;
		disabled?: boolean;
		contents: Snippet;
		[key: string]: any;
	}

	let { icon, label, disabled = $bindable(), contents, ...props }: Props = $props();

	import { Popover } from '@skeletonlabs/skeleton-svelte';

	let open = $state(false);
</script>

<Popover
	{open}
	onOpenChange={(e) => (open = e.open)}
	contentBase="card bg-surface-50-950 p-4 shadow-lg"
	triggerBase="btn flex items-center gap-2 p-0 {props.class || ''}"
>
	{#snippet trigger()}
		<iconify-icon {icon} class="text-2xl"> </iconify-icon>
		{label}
	{/snippet}

	{#snippet content()}
		{@render contents()}
	{/snippet}
</Popover>
