<script lang="ts">
	import { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Control Planes',
		description: 'Manage your control planes.'
	};

	import { onDestroy } from 'svelte';

	import { getModalStore, ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	/* Client setup */
	import { client, error } from '$lib/client.ts';
	import { token } from '$lib/credentials.js';
	import * as Models from '$lib/openapi/server/models';
	import * as Api from '$lib/openapi/server/apis';

	let at: string;

	let resources: Models.ControlPlanes;

	function update(): void {
		client(at)
			.apiV1ControlplanesGet()
			.then((v) => (resources = v))
			.catch((e: Error) => error(e));
	}

	token.subscribe((token: string): void => {
		/* Setup the token on load */
		if (!token) return;
		at = token;

		update();

		const ticker = setInterval(update, 5000);
		onDestroy(() => clearInterval(ticker));
	});

	function remove(resource: Models.ControlPlane): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing control plane "${resource.name}" will remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters: Api.ApiV1ProjectsProjectNameControlplanesControlPlaneNameDeleteRequest = {
					projectName: resource.metadata.project,
					controlPlaneName: resource.name
				};

				client(at)
					.apiV1ProjectsProjectNameControlplanesControlPlaneNameDelete(parameters)
					.catch((e: Error) => error(e));
			}
		};

		modalStore.trigger(modal);
	}

	import StatusIcon from '$lib/StatusIcon.svelte';
</script>

<ShellPage {settings}>
	{#each resources || [] as resource}
		<article class="bg-surface-50-900-token rounded-lg p-4 flex items-center justify-between gap-8">
			<header class="flex items-center gap-4">
				<StatusIcon metadata={resource.metadata} />
				<h6 class="h6">{resource.name}</h6>
			</header>

			<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
				<iconify-icon icon="mdi:close" />
			</button>
		</article>
	{/each}
</ShellPage>
