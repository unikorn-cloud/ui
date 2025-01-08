<script>
	import { getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
	import SideBar from '$lib/shell/SideBar.svelte';

	const drawerStore = getDrawerStore();
</script>

<Drawer>
	{#if $drawerStore.id === 'sidebar'}
		<SideBar />
	{:else}
		Invalid $drawerstore.id.
	{/if}
</Drawer>
