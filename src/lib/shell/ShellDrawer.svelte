<script>
	import { getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
	import ShellSideBar from '$lib/shell/ShellSideBar.svelte';

	const drawerStore = getDrawerStore();
</script>

<Drawer>
	{#if $drawerStore.id === 'sidebar'}
		<ShellSideBar />
	{:else}
		Invalid $drawerstore.id.
	{/if}
</Drawer>
