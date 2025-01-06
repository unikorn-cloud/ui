<script lang="ts">
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Formatters from '$lib/formatters';
	import * as Status from '$lib/status';
	import Badge from '$lib/layouts/Badge.svelte';

	interface Props {
		metadata: Kubernetes.ResourceReadMetadata;
		badges?: import('svelte').Snippet;
	}

	let { metadata, badges }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-2 items-center">
		<Badge icon={Status.icon(metadata)} iconcolor={Status.color(metadata)}>
			{metadata.provisioningStatus}
		</Badge>

		{@render badges?.()}
	</div>

	<h2 class="h2">{metadata.name}</h2>

	{#if metadata.description}
		<div class="text-sm italic">{metadata.description}</div>
	{/if}

	<div class="flex flex-col gap-2 text-sm">
		<div class="flex gap-2 items-center text-sm">
			<iconify-icon icon="mdi:clock-time-five-outline"></iconify-icon>
			{Formatters.ageFormatter(metadata.creationTime)}
		</div>

		{#if metadata.createdBy}
			<div class="flex gap-2 items-center">
				<iconify-icon icon="mdi:user-outline"></iconify-icon>
				{metadata.createdBy}
			</div>
		{/if}
	</div>
</div>
