<script lang="ts">
	export let icon: string = '';
</script>

<div class="badge variant-soft flex gap-2 self-start">
	{#if icon !== ''}
		<iconify-icon class="text-lg" {icon} />
	{/if}

	<slot />
</div>
