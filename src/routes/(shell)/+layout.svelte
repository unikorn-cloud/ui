<script lang="ts">
	import type { LayoutData } from './$types';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';

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

	import { initializeStores, Modal, Toast } from '@skeletonlabs/skeleton';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow, size } from '@floating-ui/dom';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow, size });

	import Shell from '$lib/shell/Shell.svelte';
	import AppBar from '$lib/shell/AppBar.svelte';
	import SideBar from '$lib/shell/SideBar.svelte';
	import Drawer from '$lib/shell/Drawer.svelte';

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	let loading = $state(false);

	beforeNavigate(() => (loading = true));
	afterNavigate(() => (loading = false));
</script>

{#if loading}
	<div
		class="bg-transparent absolute h-screen w-screen z-10 backdrop-blur flex items-center justify-center"
		in:fade={{ duration: 1000 }}
		out:fade={{ duration: 200 }}
	>
		<iconify-icon icon="svg-spinners:bars-scale-fade" class="text-primary-500 text-5xl">
		</iconify-icon>
	</div>
{/if}

<Modal />
<Toast />
<Drawer
	token={data.token}
	organizations={data.organizations}
	organizationID={data.organizationID}
	acl={data.acl}
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
			acl={data.acl}
		/>
	{/snippet}

	{#snippet main()}
		{@render children?.()}
	{/snippet}
</Shell>
