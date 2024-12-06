<script lang="ts">
	import * as Region from '$lib/openapi/region';

	export let flavor: Region.Flavor;
</script>

{#if flavor}
	<div class="flex gap-4 items-center">
		<iconify-icon icon="mdi:server-outline" class="text-2xl" />
		<div class="flex flex-col">
			<div class="flex items-center gap-1">
				<!--<iconify-icon icon="mdi:chip" />-->
				{flavor.spec.cpus} core {flavor.spec.memory} GiB RAM
			</div>
			<div class="flex items-center gap-1 text-xs">
				<!--<iconify-icon icon="mdi:harddisk" class="pl-1" />-->
				{flavor.spec.disk} GiB Storage
			</div>
			{#if flavor.spec.gpu}
				<div class="flex items-center gap-1">
					<!--<iconify-icon icon="mdi:gpu" class="pl-1" /> -->
					{flavor.spec.gpu.physicalCount}
					{#if flavor.spec.gpu.vendor == 'AMD'}
						<iconify-icon icon="logos:amd" />
					{:else if flavor.spec.gpu.vendor == 'NVIDIA'}
						<iconify-icon icon="logos:nvidia" />
					{/if}
					{flavor.spec.gpu.model}
					({flavor.spec.gpu.logicalCount} core {flavor.spec.gpu.memory} GiB)
				</div>
			{/if}
		</div>
	</div>
{/if}
