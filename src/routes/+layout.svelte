<script lang="ts">
	/* Required for styling */
	import '../app.postcss';
</script>

<svelte:head>
	<title>Unikorn Dashboard</title>
	<script src="/js/iconify-icon-1.0.5.min.js"></script>
	<script src="/js/svg-inject.min.js"></script>
</svelte:head>

<slot />

<style>
	:global(body) {
		background-image: radial-gradient(
				at 0% 0%,
				rgba(var(--color-secondary-500) / 0.33) 0px,
				transparent 50%
			),
			radial-gradient(at 98% 1%, rgba(var(--color-error-500) / 0.33) 0px, transparent 50%);
	}
</style>
