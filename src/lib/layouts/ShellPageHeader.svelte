<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	interface Props {
		settings: ShellPageSettings;
		tools?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { settings, tools, children }: Props = $props();
</script>

<div class="flex flex-col gap-4 lg:flex-row lg:jusify-between">
	<div class="flex gap-4 grow">
		<div class="flex flex-col gap-4">
			<div class="flex gap-4 items-center">
				{#if settings.icon}
					<iconify-icon icon={settings.icon} class="text-6xl text-primary-600-400"></iconify-icon>
				{/if}
				<h1 class="text-3xl lg:text-5xl">{settings.name}</h1>
			</div>
			<p class="text-surface-700-300">{settings.description}</p>
		</div>
	</div>

	<div class="self-start lg:self-end flex gap-4">
		{@render tools?.()}
	</div>
</div>
