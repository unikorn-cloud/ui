<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		header: Snippet;
		sidebarLeft: Snippet;
		main: Snippet;
	}

	let { header, sidebarLeft, main } = $props();
</script>

<div class="w-full h-screen flex flex-col">
	<header>
		{@render header()}
	</header>

	<div class="w-full h-full flex overflow-hidden">
		<div class="flex-none overflow-x-hidden overflow-y-auto">
			{@render sidebarLeft()}
		</div>
		<div class="flex-1 overflow-x-hidden flex flex-col">
			{@render main()}
		</div>
	</div>
</div>
