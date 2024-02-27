<script lang="ts">
	import { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Organization',
		description: 'Manage your organization.'
	};
</script>

<ShellPage {settings} />
