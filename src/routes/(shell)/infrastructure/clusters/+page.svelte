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

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import { client, error } from '$lib/clients';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/server/models';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	let at: string;

	let resources: Models.KubernetesClusters;

	let organization: string;

	organizationStore.subscribe((value: string) => {
		organization = value;
		update();
	});

	token.subscribe((token: string): void => {
		at = token;
		update();

		const ticker = setInterval(update, 5000);
		onDestroy(() => clearInterval(ticker));
	});

	function update(): void {
		if (!at || !organization) return;

		const parameters = {
			organizationName: organization
		};

		client(toastStore, at)
			.apiV1OrganizationsOrganizationNameClustersGet(parameters)
			.then((v: Models.KubernetesClusters) => (resources = v))
			.catch((e: Error) => error(e));
	}

	function remove(resource: Models.KubernetesCluster): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Remove cluster "${resource.spec.name}".`,
			response: (ok: boolean) => {
				if (!ok) return;
				if (!resource.metadata) return;

				const parameters = {
					organizationName: organization,
					projectName: resource.metadata.project,
					clusterName: resource.spec.name
				};

				client(toastStore, at)
					.apiV1OrganizationsOrganizationNameProjectsProjectNameClustersClusterNameDelete(
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
				<h6 class="h6">{resource.spec.name}</h6>
			</header>

			<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
				<iconify-icon icon="mdi:close" />
			</button>
		</article>
	{/each}
</ShellPage>
