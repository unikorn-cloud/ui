<script lang="ts">
	/* Required for styling */
	import '../app.css';
	import { env } from '$env/dynamic/public';
	import { base } from '$app/paths';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>{env.PUBLIC_TITLE}</title>
	<link rel="icon" href="{base}/favicon.{env.PUBLIC_THEME}.png" />
	<script src="/js/iconify-icon-1.0.5.min.js"></script>
	<script src="/js/svg-inject.min.js"></script>
</svelte:head>

{@render children?.()}
