<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'None',
		name: 'Dashboard',
		description: 'Summary of your resources.'
	};
</script>

<ShellPage {settings} allowed={data.allowed} />
