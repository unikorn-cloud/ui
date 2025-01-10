<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex flex-col gap-4 lg:grid lg:grid-cols-[repeat(6,max-content),auto,max-content]">
	{@render children?.()}
</div>
