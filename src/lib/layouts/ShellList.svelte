<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<!-- In mobile mode show vertical cards, in desktop mode show horizontal table rows -->
<div class="flex flex-col lg:grid lg:grid-cols-[repeat(6,max-content)_auto] lg:auto-rows-fr gap-2">
	{@render children?.()}
</div>
