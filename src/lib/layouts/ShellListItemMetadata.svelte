<script lang="ts">
	import type { Snippet } from 'svelte';

	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Formatters from '$lib/formatters';

	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';

	interface Props {
		metadata: Kubernetes.ResourceReadMetadata;
		extra?: Snippet;
	}

	let { metadata, extra }: Props = $props();
</script>

<div class="col-start-4 flex flex-col gap-1 text-sm">
	<ShellMetadataItem icon="mdi:clock-time-five-outline">
		{Formatters.ageFormatter(metadata.creationTime)}
	</ShellMetadataItem>

	{#if metadata.createdBy}
		<ShellMetadataItem icon="mdi:user-outline">
			{metadata.createdBy}
		</ShellMetadataItem>
	{/if}

	{@render extra?.()}
</div>
