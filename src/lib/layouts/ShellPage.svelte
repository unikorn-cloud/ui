<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	export let settings: ShellPageSettings;
</script>

<div class="p-8 w-full lg:max-w-[80em] mx-auto flex flex-col gap-16">
	<header class="flex gap-4 justify-between">
		<div class="flex flex-col gap-4">
			<div class="badge variant-soft self-start">{settings.feature}</div>
			<h1 class="h1">{settings.name}</h1>
			<p>{settings.description}</p>
		</div>

		<div class="self-end">
			<slot name="tools" />
		</div>
	</header>

	<main class="flex flex-col gap-8">
		<slot />
	</main>
</div>
