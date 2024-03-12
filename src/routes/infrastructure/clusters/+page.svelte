<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Kubernetes Clusters',
		description: 'Manage your Kubernetes clusters.'
	};

	import { onDestroy } from 'svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	/* Client setup */
	import { client, error } from '$lib/client.ts';
	import { token } from '$lib/credentials.js';
	import * as Models from '$lib/openapi/server/models';
	import * as Api from '$lib/openapi/server/apis';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	let at: string;

	let resources: Models.KubernetesClusters;

	function update(): void {
		client(toastStore, at)
			.apiV1ClustersGet()
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

	function remove(resource: Models.KubernetesCluster): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Remove cluster "${resource.name}".`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters: Api.ApiV1ProjectsProjectNameControlplanesControlPlaneNameClustersClusterNameDeleteRequest =
					{
						projectName: resource.metadata.project,
						controlPlaneName: resource.metadata.controlplane,
						clusterName: resource.name
					};

				client(toastStore, at)
					.apiV1ProjectsProjectNameControlplanesControlPlaneNameClustersClusterNameDelete(
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
	<a
		href="/infrastructure/clusters/create"
		class="btn variant-ghost-primary flex gap-2 items-center"
	>
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</a>

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
