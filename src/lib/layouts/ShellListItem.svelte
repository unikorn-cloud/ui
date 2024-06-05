<script lang="ts">
	import * as Identity from '$lib/openapi/identity';
	import StatusIcon from '$lib/StatusIcon.svelte';

	export let metadata: Identity.ResourceReadMetadata;
	export let href: string;
</script>

<div class="flex gap-4 items-center justify-between variant-glass rounded-lg p-4">
	<header class="flex items-center gap-4">
		<StatusIcon {metadata} />
		<a class="font-bold" {href}>{metadata.name}</a>
		{#if metadata.description}
			<em>{metadata.description}</em>
		{/if}
	</header>

	<slot />
</div>
