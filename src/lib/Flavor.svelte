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
		{#if flavor.spec.gpu}
			<iconify-icon icon="mdi:gpu" class="pl-1" />
			{flavor.spec.gpu.count} x
			{#if flavor.spec.gpu.vendor == 'AMD'}
				<iconify-icon icon="logos:amd" />
			{:else if flavor.spec.gpu.vendor == 'NVIDIA'}
				<iconify-icon icon="logos:nvidia" />
			{/if}
			{flavor.spec.gpu.model}
			{flavor.spec.gpu.memory} GiB
		{/if}
	</div>
{/if}
