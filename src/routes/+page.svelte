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
	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();

	/* Shell components */
	import { AppShell } from '@skeletonlabs/skeleton';
	import ShellAppBar from '$lib/shell/ShellAppBar.svelte';
	import ShellSideBar from '$lib/shell/ShellSideBar.svelte';
	import ShellDrawer from '$lib/shell/ShellDrawer.svelte';
</script>

<ShellDrawer />

<AppShell class="h-screen">
	<svelte:fragment slot="header">
		<ShellAppBar />
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<ShellSideBar class="hidden lg:grid" />
	</svelte:fragment>
</AppShell>
