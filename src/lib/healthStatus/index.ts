import * as Identity from '$lib/openapi/identity';

export function color(meta: Identity.ResourceReadMetadata): string {
	switch (meta.healthStatus) {
		case Identity.ResourceHealthStatus.Healthy:
			return 'text-success-500';
		case Identity.ResourceHealthStatus.Degraded:
			return 'text-error-500';
	}
	return 'dark:text-surface-500';
}

export function icon(meta: Identity.ResourceReadMetadata): string {
	switch (meta.healthStatus) {
		case Identity.ResourceHealthStatus.Healthy:
			return 'mdi:heart-outline';
		case Identity.ResourceHealthStatus.Degraded:
			return 'mdi:heart-broken-outline';
	}
	return 'mdi:heart-broken-outline';
}
