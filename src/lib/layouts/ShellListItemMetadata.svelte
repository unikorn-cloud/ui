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

<div class="grid grid-cols-[repeat(3,max-content)] gap-2 text-sm items-center">
	<ShellMetadataItem
		icon="mdi:clock-time-five-outline"
		label="Age"
		value={Formatters.ageFormatter(metadata.creationTime)}
	/>

	{#if metadata.createdBy}
		<ShellMetadataItem icon="mdi:user-outline" label="Owner" value={metadata.createdBy} />
	{/if}

	{@render extra?.()}
</div>
