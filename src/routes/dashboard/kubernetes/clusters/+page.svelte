<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

	let { data }: { data: PageData } = $props();

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	import * as Clients from '$lib/clients';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as RegionUtil from '$lib/regionutil';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Kubernetes Clusters',
		description: 'Manage your Kubernetes clusters.'
	};

	const ticker = setInterval(() => invalidate('layout:clusters'), 5000);
	onDestroy(() => clearInterval(ticker));

	function remove(resource: Kubernetes.KubernetesClusterRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Remove cluster "${resource.metadata.name}".`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: data.organizationID,
					projectID: resource.metadata.projectId,
					clusterID: resource.metadata.id
				};

				Clients.kubernetes(data.token)
					.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete(parameters)
					.then(() => invalidate('layout:clusters'))
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}

	function getKubeconfig(resource: Kubernetes.KubernetesClusterRead): void {
		const parameters = {
			organizationID: data.organizationID,
			projectID: resource.metadata.projectId,
			clusterID: resource.metadata.id
		};

		Clients.kubernetes(data.token)
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

<ShellPage {settings} allowed={data.allowed}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/dashboard/kubernetes/clusters/create" />
	{/snippet}

	<ShellList>
		{#each data.clusters || [] as resource}
			<ShellListItem icon="mdi:kubernetes">
				<ShellListItemHeader
					metadata={resource.metadata}
					href="/dashboard/kubernetes/clusters/view/{resource.metadata.id}"
					projects={data.projects}
				/>

				<ShellListItemBadges metadata={resource.metadata}>
					{#snippet extra()}
						<Badge icon={RegionUtil.icon(data.regions, resource.spec.regionId)}>
							{RegionUtil.name(data.regions, resource.spec.regionId)}
						</Badge>
					{/snippet}
				</ShellListItemBadges>

				<ShellListItemMetadata metadata={resource.metadata} />

				{#snippet trail()}
					<BurgerMenu name="menu-{resource.metadata.id}">
						<BurgerMenuItem clicked={() => remove(resource)} icon="mdi:trash-can-outline">
							Delete
						</BurgerMenuItem>
						<BurgerMenuItem clicked={() => getKubeconfig(resource)} icon="mdi:download">
							Kubeconfig
						</BurgerMenuItem>
					</BurgerMenu>
				{/snippet}
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
