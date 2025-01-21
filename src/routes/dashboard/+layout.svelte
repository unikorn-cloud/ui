<script lang="ts">
	import type { LayoutData } from './$types';

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

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
</script>

<Modal />
<Toast />
<Drawer
	token={data.token}
	organizations={data.organizations}
	organizationID={data.organizationID}
/>

<Shell>
	{#snippet header()}
		<AppBar profile={data.profile} />
	{/snippet}

	{#snippet sidebarLeft()}
		<SideBar
			class="hidden lg:block"
			token={data.token}
			organizations={data.organizations}
			organizationID={data.organizationID}
		/>
	{/snippet}

	{#snippet main()}
		{@render children?.()}
	{/snippet}
</Shell>
