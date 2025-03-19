<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex flex-col items-center gap-4">
	<iconify-icon icon="mdi:information-outline" class="text-6xl text-primary-500"></iconify-icon>
	<div class="font-bold">
		{@render children()}
	</div>
</div>
