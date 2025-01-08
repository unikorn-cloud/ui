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

	<div class="flex h-full">
		<div>
			{@render sidebarLeft()}
		</div>
		<div class="flex-auto">
			{@render main()}
		</div>
	</div>
</div>
