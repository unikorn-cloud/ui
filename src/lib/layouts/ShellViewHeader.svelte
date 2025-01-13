<script lang="ts">
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Formatters from '$lib/formatters';
	import * as Status from '$lib/status';
	import Badge from '$lib/layouts/Badge.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';

	import type { Snippet } from 'svelte';

	interface Props {
		metadata: Kubernetes.ResourceReadMetadata;
		badges?: import('svelte').Snippet;
		extraMetadata?: Snippet;
	}

	let { metadata, badges, extraMetadata }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-2 items-center">
		<Badge icon={Status.icon(metadata)} iconcolor={Status.color(metadata)}>
			{metadata.provisioningStatus}
		</Badge>

		{@render badges?.()}
	</div>

	<div class="flex flex-col gap-1">
		<h2 class="h2">{metadata.name}</h2>

		{#if metadata.description}
			<div class="text-sm italic">{metadata.description}</div>
		{/if}
	</div>

	<div class="grid grid-cols-[repeat(3,max-content)] gap-2 text-sm">
		<ShellMetadataItem
			icon="mdi:clock-time-five-outline"
			label="Age"
			value={Formatters.ageFormatter(metadata.creationTime)}
		/>

		{#if metadata.createdBy}
			<ShellMetadataItem icon="mdi:user-outline" label="Owner" value={metadata.createdBy} />
		{/if}

		{@render extraMetadata?.()}
	</div>
</div>
