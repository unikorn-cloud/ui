import * as Identity from '$lib/openapi/identity';

export function statusColor(s: string): string {
	switch (s) {
		case 'provisioned':
			return 'text-success-500';
		case 'error':
			return 'text-error-500';
		case 'unknown':
			return 'text-warning-500';
	}
	return 'dark:text-surface-500';
}

export function statusIcon(s: string): string {
	switch (s) {
		case 'provisioned':
			return 'mdi:tick-circle-outline';
		case 'error':
			return 'mdi:error-outline';
		case 'unknown':
			return 'mdi:question-mark';
	}
	return 'svg-spinners:ring-resize';
}

export function color(metadata: Identity.ResourceReadMetadata): string {
	return statusColor(metadata.provisioningStatus);
}

export function icon(metadata: Identity.ResourceReadMetadata): string {
	return statusIcon(metadata.provisioningStatus);
}
