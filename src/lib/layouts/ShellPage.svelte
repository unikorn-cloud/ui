<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	interface Props {
		settings: ShellPageSettings;
		tools?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { settings, tools, children }: Props = $props();
</script>

<div class="p-8 w-full lg:max-w-[80em] mx-auto flex flex-col gap-16">
	<header class="flex gap-4 justify-between">
		<div class="flex flex-col gap-4">
			<div class="badge variant-soft self-start">{settings.feature}</div>
			<h1 class="h1">{settings.name}</h1>
			<p>{settings.description}</p>
		</div>

		<div class="self-end">
			{@render tools?.()}
		</div>
	</header>

	<main class="flex flex-col gap-8">
		{@render children?.()}
	</main>
</div>
