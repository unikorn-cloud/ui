<script lang="ts">
	import * as Region from '$lib/openapi/region';

	interface Props {
		flavor: Region.Flavor | undefined;
	}

	let { flavor }: Props = $props();
</script>

{#if flavor}
	<div class="flex items-center gap-6">
		<div class="flex items-center gap-2">
			<iconify-icon icon="mdi:server-outline" class="text-2xl"></iconify-icon>
			<div class="flex flex-col items-start">
				{flavor.spec.cpus} core, {flavor.spec.memory} GiB RAM
				<div class="text-xs">
					{flavor.spec.disk} GiB Storage
				</div>
			</div>
		</div>
		{#if flavor.spec.gpu}
			<div class="flex items-center gap-1">
				{flavor.spec.gpu.physicalCount}
				{#if flavor.spec.gpu.vendor == 'AMD'}
					<iconify-icon icon="logos:amd"></iconify-icon>
				{:else if flavor.spec.gpu.vendor == 'NVIDIA'}
					<iconify-icon icon="logos:nvidia"></iconify-icon>
				{/if}
				{flavor.spec.gpu.model}
				({flavor.spec.gpu.logicalCount} core {flavor.spec.gpu.memory} GiB)
			</div>
		{/if}
	</div>
{/if}
