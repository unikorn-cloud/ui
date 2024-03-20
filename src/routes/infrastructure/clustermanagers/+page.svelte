<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Cluster Managers',
		description: 'Manage your cluster life-cycle managers.'
	};

	import { onDestroy } from 'svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	/* Client setup */
	import { client, error } from '$lib/clients';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/server/models';

	let at: string;

	let resources: Models.ClusterManagers;

	function update(): void {
		const parameters = {
			organizationName: 'UNDEFINED'
		};

		client(toastStore, at)
			.apiV1OrganizationsOrganizationNameClustermanagersGet(parameters)
			.then((v: Models.ClusterManagers) => (resources = v))
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

	function remove(resource: Models.ClusterManager): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing control plane "${resource.spec.name}" will remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationName: 'UNDEFINED',
					projectName: resource.metadata.project,
					clusterManagerName: resource.spec.name
				};

				client(toastStore, at)
					.apiV1OrganizationsOrganizationNameProjectsProjectNameClustermanagersClusterManagerNameDelete(
						parameters
					)
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
				<h6 class="h6">{resource.spec.name}</h6>
			</header>

			<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
				<iconify-icon icon="mdi:close" />
			</button>
		</article>
	{/each}
</ShellPage>
