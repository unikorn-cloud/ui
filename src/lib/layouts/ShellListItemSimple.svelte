<script lang="ts">
	import { run } from 'svelte/legacy';

	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Identity from '$lib/openapi/identity';
	import * as Formatters from '$lib/formatters';
	import * as Status from '$lib/status';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';

	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		name: string;
		badges?: Snippet;
		tray?: Snippet;
		extraMetadata?: Snippet;
		href?: string;
	}

	let { icon, name, badges, tray, extraMetadata, href }: Props = $props();
</script>

{#snippet meta()}
	<div class="flex flex-col gap-1">
		<div class="flex gap-2 items-center">
			<div class="h5 font-bold">
				{name}
			</div>
		</div>
	</div>
{/snippet}

<article
	class="flex flex-col gap-2 lg:gap-x-8 lg:gap-y-4 lg:col-span-full lg:grid lg:grid-cols-subgrid lg:items-center card bg-surface-50-900-token shadow-lg p-4"
>
	<iconify-icon {icon} class="col-start-1 text-5xl text-primary-600-300-token"></iconify-icon>

	<div>
		{#if href}
			<a class="grow" {href}>
				{@render meta()}
			</a>
		{:else}
			{@render meta()}
		{/if}
	</div>

	<div class="flex gap-2 items-center">
		{@render badges?.()}
	</div>

	<div class="flex flex-col gap-1 text-sm">
		{@render extraMetadata?.()}
	</div>

	<div>
		{@render tray?.()}
	</div>
</article>
