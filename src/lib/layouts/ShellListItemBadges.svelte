<script lang="ts">
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Status from '$lib/status';

	import Badge from '$lib/layouts/Badge.svelte';

	interface Props {
		metadata?: Kubernetes.ResourceReadMetadata;
		extra?: import('svelte').Snippet;
	}

	let { metadata, extra }: Props = $props();
</script>

<div class="flex items-center lg:flex-col lg:items-start gap-2">
	{#if metadata}
		<Badge icon={Status.icon(metadata)} iconcolor={Status.color(metadata)}>
			{metadata.provisioningStatus}
		</Badge>
	{/if}

	{@render extra?.()}
</div>
