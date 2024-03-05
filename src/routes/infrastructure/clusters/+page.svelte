<script lang="ts">
	/* Page setup */
	import { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Kubernetes Clusters',
		description: 'Manage your Kubernetes clusters.'
	};
</script>

<ShellPage {settings}>
	<a
		href="/infrastructure/clusters/create"
		class="btn variant-ghost-primary flex gap-2 items-center"
	>
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</a>
</ShellPage>
