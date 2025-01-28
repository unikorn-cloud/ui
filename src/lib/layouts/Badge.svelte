<script lang="ts">
	interface Props {
		icon?: string;
		iconcolor?: string;
		children?: import('svelte').Snippet;
	}

	let { icon = '', iconcolor = '', children }: Props = $props();
</script>

<div class="badge variant-outline-soft bg-surface-50-900-token shadow flex gap-2 items-center">
	{#if icon !== ''}
		<iconify-icon class="text-base {iconcolor}" {icon}></iconify-icon>
	{/if}

	{@render children?.()}
</div>
