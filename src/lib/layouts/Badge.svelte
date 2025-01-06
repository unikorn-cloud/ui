<script lang="ts">
	interface Props {
		icon?: string;
		iconcolor?: string;
		children?: import('svelte').Snippet;
	}

	let { icon = '', iconcolor = '', children }: Props = $props();
</script>

<div class="badge variant-soft flex gap-2 self-start">
	{#if icon !== ''}
		<iconify-icon class="text-lg {iconcolor}" {icon}></iconify-icon>
	{/if}

	{@render children?.()}
</div>
