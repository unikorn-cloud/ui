<script lang="ts">
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Formatters from '$lib/formatters';
	import StatusIcon from '$lib/StatusIcon.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

	export let metadata: Kubernetes.ResourceReadMetadata;
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-4 items-center">
		<StatusIcon {metadata} />
		<div class="badge variant-soft">
			{metadata.provisioningStatus}
		</div>
	</div>

	<h2 class="h2">{metadata.name}</h2>

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

<ShellSection title="Resource Metadata">
	<label for="name">Display name.</label>
	<input id="name" class="input" type="text" bind:value={metadata.name} />

	<label for="name">Optional description.</label>
	<input id="description" class="input" type="text" bind:value={metadata.description} />
</ShellSection>
