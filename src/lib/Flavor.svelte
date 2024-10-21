<script lang="ts">
	import * as Region from '$lib/openapi/region';

	export let flavor: Region.Flavor;
</script>

{#if flavor}
	<div class="flex items-center gap-1">
		<iconify-icon icon="mdi:chip" />
		{flavor.spec.cpus} core
		<iconify-icon icon="mdi:memory" class="pl-1" />
		{flavor.spec.memory} GiB
		<iconify-icon icon="mdi:harddisk" class="pl-1" />
		{flavor.spec.disk} GiB
		{#if flavor.spec.gpu}
			<iconify-icon icon="mdi:gpu" class="pl-1" />
			{flavor.spec.gpu.physicalCount} x
			{#if flavor.spec.gpu.vendor == 'AMD'}
				<iconify-icon icon="logos:amd" />
			{:else if flavor.spec.gpu.vendor == 'NVIDIA'}
				<iconify-icon icon="logos:nvidia" />
			{/if}
			{flavor.spec.gpu.model}
			({flavor.spec.gpu.logicalCount} core {flavor.spec.gpu.memory} GiB)
		{/if}
	</div>
{/if}
