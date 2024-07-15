import * as Identity from '$lib/openapi/identity';

export function color(metadata: Identity.ResourceReadMetadata): string {
	if (metadata.provisioningStatus == 'provisioned') return 'text-success-500';
	if (metadata.provisioningStatus == 'error') return 'text-error-500';
	if (metadata.provisioningStatus == 'unknown') return 'text-warning-500';
	return 'dark:text-surface-500';
}

export function icon(metadata: Identity.ResourceReadMetadata): string {
	if (metadata.provisioningStatus == 'provisioned') return 'mdi:tick-circle-outline';
	if (metadata.provisioningStatus == 'error') return 'mdi:error-outline';
	if (metadata.provisioningStatus == 'unknown') return 'mdi:question-mark';
	return 'svg-spinners:ring-resize';
}
