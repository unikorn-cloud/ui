<script lang="ts">
	interface Props {
		icon: string;
		children?: import('svelte').Snippet;
	}

	let { icon, children }: Props = $props();
</script>

<li>
	<iconify-icon {icon}></iconify-icon>
	{@render children?.()}
</li>
