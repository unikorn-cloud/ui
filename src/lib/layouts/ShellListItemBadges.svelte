<script lang="ts">
	import * as Identity from '$lib/openapi/identity';
	import * as ProvisioningStatus from '$lib/provisioningStatus';
	import * as HealthStatus from '$lib/healthStatus';

	import Badge from '$lib/layouts/Badge.svelte';

	interface Props {
		metadata?: Identity.ResourceReadMetadata;
		extra?: import('svelte').Snippet;
	}

	let { metadata, extra }: Props = $props();
</script>

<div class="flex flex-wrap items-center gap-2">
	{#if metadata}
		<Badge icon={ProvisioningStatus.icon(metadata)} iconcolor={ProvisioningStatus.color(metadata)}>
			{metadata.provisioningStatus}
		</Badge>
		<Badge icon={HealthStatus.icon(metadata)} iconcolor={HealthStatus.color(metadata)}>
			{metadata.healthStatus}
		</Badge>
	{/if}

	{@render extra?.()}
</div>
