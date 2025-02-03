<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	interface Props {
		settings: ShellPageSettings;
		tools?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { settings, tools, children }: Props = $props();
</script>

<div class="p-4 lg:px-16 lg:py-8 w-full mx-auto flex flex-col gap-8">
	<div class="flex flex-col gap-4">
		<div class="flex items-center justify-between">
			<h1 class="h2 font-bold">{settings.name}</h1>

			{@render tools?.()}
		</div>
		<p>{settings.description}</p>
	</div>

	<main class="flex flex-col gap-8">
		{@render children?.()}
	</main>
</div>
