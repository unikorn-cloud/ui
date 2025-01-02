<script lang="ts">
	import * as Region from '$lib/openapi/region';

	interface Props {
		flavor: Region.Flavor;
	}

	let { flavor }: Props = $props();
</script>

{#if flavor}
	<div class="flex gap-4 items-center">
		<iconify-icon icon="mdi:server-outline" class="text-2xl"></iconify-icon>
		<div class="flex flex-col">
			<div class="flex items-center gap-1">
				<!--<iconify-icon icon="mdi:chip"></iconify-icon>-->
				{flavor.spec.cpus} core {flavor.spec.memory} GiB RAM
			</div>
			<div class="flex items-center gap-1 text-xs">
				<!--<iconify-icon icon="mdi:harddisk" class="pl-1"></iconify-icon>-->
				{flavor.spec.disk} GiB Storage
			</div>
			{#if flavor.spec.gpu}
				<div class="flex items-center gap-1">
					<!--<iconify-icon icon="mdi:gpu" class="pl-1"></iconify-icon> -->
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
	</div>
{/if}
