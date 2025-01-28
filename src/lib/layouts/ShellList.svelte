<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(320px,480px))] gap-4">
	{@render children?.()}
</div>
