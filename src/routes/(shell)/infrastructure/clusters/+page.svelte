<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';

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
	import * as Clients from '$lib/clients';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { browser } from '$app/environment';

	let at: InternalToken;

	let resources: Kubernetes.KubernetesClusters;

	let organizationID: string;

	organizationStore.subscribe((value: string) => {
		organizationID = value;
		update();
	});

	token.subscribe((token: InternalToken): void => {
		at = token;
		update();

		const ticker = setInterval(update, 5000);
		onDestroy(() => clearInterval(ticker));
	});

	function update(): void {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Kubernetes.KubernetesClusters) => (resources = v))
			.catch((e: Error) => Clients.error(e));
	}

	function remove(resource: Kubernetes.KubernetesClusterRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Remove cluster "${resource.metadata.name}".`,
			response: (ok: boolean) => {
				if (!ok) return;
				if (!resource.metadata) return;

				const parameters = {
					organizationID: organizationID,
					projectID: resource.metadata.projectId,
					clusterID: resource.metadata.id
				};

				Clients.kubernetes(toastStore, at)
					.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete(parameters)
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}

	function getKubeconfig(resource: Kubernetes.KubernetesClusterRead): void {
		const parameters = {
			organizationID: organizationID,
			projectID: resource.metadata.projectId,
			clusterID: resource.metadata.id
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGetRaw(
				parameters
			)
			.then((x) => x.raw.blob())
			.then((x) => {
				if (browser) {
					const url = window.URL.createObjectURL(x);

					const a = document.createElement('a');
					a.style.display = 'none';
					a.href = url;
					a.download = `kubeconfig-${resource.metadata.name}.yaml`;

					document.body.appendChild(a);
					a.click();

					window.URL.revokeObjectURL(url);
				}
			})
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<a
		href="/infrastructure/clusters/create"
		class="btn variant-ghost-primary flex gap-2 items-center"
	>
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</a>

	<ShellList>
		{#each resources || [] as resource}
			<ShellListItem metadata={resource.metadata} href="#">
				<div class="flex items-center gap-4">
					<button
						on:click={() => getKubeconfig(resource)}
						on:keypress={() => getKubeconfig(resource)}
					>
						<iconify-icon icon="mdi:file-document-outline" />
					</button>
					<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
						<iconify-icon icon="mdi:close" />
					</button>
				</div>
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
