<script lang="ts">
	interface Props {
		icon: string;
		children?: import('svelte').Snippet;
	}

	let { icon, children }: Props = $props();
</script>

<div class="flex gap-2 items-center">
	<iconify-icon class="text-lg" {icon}></iconify-icon>

	{@render children?.()}
</div>
