<script lang="ts">
	import * as Region from '$lib/openapi/region';

	interface Props {
		flavor: Region.Flavor | undefined;
	}

	let { flavor }: Props = $props();
</script>

{#if flavor}
	<div class="flex flex-col lg:flex-row lg:items-center gap-6">
		<div class="flex items-center gap-2">
			<iconify-icon icon="mdi:server-outline" class="text-2xl"></iconify-icon>
			<div class="flex flex-col lg:flex-row gap-2 lg:gap-4">
				<div class="flex flex-col items-start">
					{flavor.spec.cpus} core, {flavor.spec.memory} GiB RAM
					<div class="text-xs">
						{flavor.spec.disk} GiB Storage
					</div>
				</div>
				{#if flavor.spec.gpu}
					<div class="flex flex-col items-start">
						<div class="flex gap-2 items-center">
							{flavor.spec.gpu.physicalCount}
							{#if flavor.spec.gpu.vendor == 'AMD'}
								<iconify-icon icon="logos:amd"></iconify-icon>
							{:else if flavor.spec.gpu.vendor == 'NVIDIA'}
								<iconify-icon icon="logos:nvidia"></iconify-icon>
							{/if}
							{flavor.spec.gpu.model}
						</div>
						<div class="text-xs">
							{flavor.spec.gpu.logicalCount} core {flavor.spec.gpu.memory} GiB
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
