<script lang="ts">
	/* Required for styling */
	import '../app.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Unikorn Dashboard</title>
	<script src="/js/iconify-icon-1.0.5.min.js"></script>
	<script src="/js/svg-inject.min.js"></script>
</svelte:head>

{@render children?.()}
