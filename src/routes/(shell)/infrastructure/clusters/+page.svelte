<script lang="ts">
	import { run } from 'svelte/legacy';

	/* Page setup */
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

	import { onDestroy } from 'svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';
	import * as RegionUtil from '$lib/regionutil';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Stores from '$lib/stores';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { browser } from '$app/environment';

	// Grab the organization scope.
	let organizationInfo = $state() as Stores.OrganizationInfo;

	Stores.organizationStore.subscribe((value: Stores.OrganizationInfo) => {
		organizationInfo = value;
	});

	// Grab the acces token.
	let at = $state() as InternalToken;

	token.subscribe((token: InternalToken): void => {
		at = token;
	});

	// Get all root resources from the API.
	let resources: Array<Kubernetes.KubernetesClusterRead> | undefined = $state();
	let projects: Array<Identity.ProjectRead> | undefined = $state();
	let regions: Array<Region.RegionRead> | undefined = $state();

	function update(): void {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Array<Kubernetes.KubernetesClusterRead>) => (resources = v))
			.catch((e: Error) => Clients.error(e));

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsGet(parameters)
			.then((v: Array<Region.RegionRead>) => (regions = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsGet(parameters)
			.then((v: Array<Identity.ProjectRead>) => (projects = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		update();
	});

	const ticker = setInterval(update, 5000);
	onDestroy(() => clearInterval(ticker));

	function remove(resource: Kubernetes.KubernetesClusterRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Remove cluster "${resource.metadata.name}".`,
			response: (ok: boolean) => {
				if (!ok) return;
				if (!resource.metadata) return;

				const parameters = {
					organizationID: organizationInfo.id,
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
			organizationID: organizationInfo.id,
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
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/infrastructure/clusters/create" />
	{/snippet}

	<ShellList>
		{#if projects}
			{#each resources || [] as resource}
				<ShellListItem icon="mdi:kubernetes">
					<ShellListItemHeader
						metadata={resource.metadata}
						href="/infrastructure/clusters/view/{resource.metadata.id}"
						{projects}
					/>

					<ShellListItemBadges metadata={resource.metadata}>
						{#snippet extra()}
							<Badge icon={RegionUtil.icon(regions, resource.spec.regionId)}>
								{RegionUtil.name(regions, resource.spec.regionId)}
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
		{/if}
	</ShellList>
</ShellPage>
