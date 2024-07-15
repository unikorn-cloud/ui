<script lang="ts">
	import * as Identity from '$lib/openapi/identity';

	export let metadata: Identity.ResourceReadMetadata;

	function getColor(metadata: Identity.ResourceReadMetadata): string {
		if (metadata.provisioningStatus == 'provisioned') return 'text-success-500';
		if (metadata.provisioningStatus == 'error') return 'text-error-500';
		if (metadata.provisioningStatus == 'unknown') return 'text-warning-500';
		return 'dark:text-surface-500';
	}

	function getIcon(metadata: Identity.ResourceReadMetadata): string {
		if (metadata.provisioningStatus == 'provisioned') return 'mdi:tick-circle-outline';
		if (metadata.provisioningStatus == 'error') return 'mdi:error-outline';
		if (metadata.provisioningStatus == 'unknown') return 'mdi:question-mark';
		return 'svg-spinners:ring-resize';
	}

	$: color = getColor(metadata);
	$: icon = getIcon(metadata);
</script>

<iconify-icon class="text-lg {color}" {icon} />
