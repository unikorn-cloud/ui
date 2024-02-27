<script lang="ts">
	import { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Groups',
		description: 'Manage your organizations groups and roles.'
	};
</script>

<ShellPage {settings} />
