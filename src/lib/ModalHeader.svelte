<script>
	export let text;

	export let icon;
</script>

<h1>
	<iconify-icon {icon} />
	{text}
</h1>

<style>
	h1 {
		display: flex;
		gap: var(--padding);
		align-items: center;
		padding: var(--padding);
	}
	iconify-icon {
		font-size: inherit;
	}
</style>
