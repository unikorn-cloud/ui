<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	interface Props {
		settings: ShellPageSettings;
		allowed: boolean;
		tools?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { settings, allowed = true, tools, children }: Props = $props();
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
		{#if allowed}
			{@render children?.()}
		{:else}
			<aside class="alert variant-filled-error shadow-lg">
				<iconify-icon class="text-7xl" icon="mdi:shield-alert-outline"></iconify-icon>

				<div class="alert-message">
					<h3 class="h3">Access Denied</h3>
					<p>
						You are not permitted to view this content. Contact an administrator from your
						organization to be granted access.
					</p>
				</div>
			</aside>
		{/if}
	</main>
</div>
