<script lang="ts">
	export let status: string;

	function getColor(status: string): string {
		if (status == 'Provisioned') return 'text-success-500';
		if (status == 'Errored') return 'text-error-500';
		if (status == 'Unknown') return 'text-warning-500';
		return 'text-surface-500';
	}

	function getIcon(status: string): string {
		if (status == 'Provisioned') return 'mdi:tick-circle-outline';
		if (status == 'Errored') return 'mdi:error-outline';
		if (status == 'Unknown') return 'mdi:question-mark';
		return 'svg-spinners:ring-resize';
	}

	$: color = getColor(status);
	$: icon = getIcon(status);
</script>

<iconify-icon class="text-2xl {color}" {icon} />
