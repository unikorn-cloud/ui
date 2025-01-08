<script lang="ts">
	/* Authentication */
	import { login } from '$lib/login';

	login();

	/* Required for OpenTelemetry */
	import { Resource } from '@opentelemetry/resources';
	import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
	import { BasicTracerProvider } from '@opentelemetry/sdk-trace-base';

	const provider = new BasicTracerProvider({
		resource: new Resource({
			[SemanticResourceAttributes.SERVICE_NAME]: 'unikorn-ui'
		})
	});
	provider.register();

	/* Required for drawers and modals */
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';
	initializeStores();

	/* Required for toasts */
	import { Toast } from '@skeletonlabs/skeleton';

	/* Required for popups */
	import { storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow, size } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow, size });

	/* Shell components */
	import Shell from '$lib/shell/Shell.svelte';
	import AppBar from '$lib/shell/AppBar.svelte';
	import SideBar from '$lib/shell/SideBar.svelte';
	import Drawer from '$lib/shell/Drawer.svelte';
</script>

<Modal />
<Toast />
<Drawer />

<Shell>
	{#snippet header()}
		<AppBar />
	{/snippet}

	{#snippet sidebarLeft()}
		<SideBar class="hidden lg:block" />
	{/snippet}

	{#snippet main()}
		Empty
	{/snippet}
</Shell>
