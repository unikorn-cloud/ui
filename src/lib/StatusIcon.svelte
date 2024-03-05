<script lang="ts">
	import * as Models from '$lib/openapi/server/models';

	export let metadata: Models.ResourceMetadata;

	function getColor(metadata: Models.ResourceMetadata): string {
		if (metadata.status == 'Provisioned') return 'text-success-500';
		if (metadata.status == 'Errored') return 'text-error-500';
		if (metadata.status == 'Unknown') return 'text-warning-500';
		return 'text-surface-500';
	}

	function getIcon(metadata: Models.ResourceMetadata): string {
		if (metadata.status == 'Provisioned') return 'mdi:tick-circle-outline';
		if (metadata.status == 'Errored') return 'mdi:error-outline';
		if (metadata.status == 'Unknown') return 'mdi:question-mark';
		return 'svg-spinners:ring-resize';
	}

	$: color = getColor(metadata);
	$: icon = getIcon(metadata);
</script>

<iconify-icon class="text-2xl {color}" {icon} />
