<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Kubernetes Cluster Managers',
		description: 'Manage your Kubernetes cluster life-cycle managers.'
	};

	import { onDestroy } from 'svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Identity from '$lib/openapi/identity';
	import * as Stores from '$lib/stores';

	let at: InternalToken;

	let resources: Array<Kubernetes.ClusterManagerRead>;

	let projects: Array<Identity.ProjectRead>;

	let organizationInfo: Stores.OrganizationInfo;

	Stores.organizationStore.subscribe((value: Stores.OrganizationInfo) => {
		organizationInfo = value;
		update();
	});

	token.subscribe((token: InternalToken): void => {
		at = token;
		update();
	});

	const ticker = setInterval(update, 5000);
	onDestroy(() => clearInterval(ticker));

	function update(): void {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustermanagersGet(parameters)
			.then((v: Array<Kubernetes.ClusterManagerRead>) => (resources = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsGet(parameters)
			.then((v: Array<Identity.ProjectRead>) => (projects = v))
			.catch((e: Error) => Clients.error(e));
	}

	function remove(resource: Kubernetes.ClusterManagerRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing cluster manager "${resource.metadata.name}" will remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: organizationInfo.id,
					projectID: resource.metadata.projectId,
					clusterManagerID: resource.metadata.id
				};

				Clients.kubernetes(toastStore, at)
					.apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDelete(
						parameters
					)
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	<ShellList>
		{#each resources || [] as resource}
			<ShellListItem metadata={resource.metadata} {projects}>
				<svelte:fragment slot="tray">
					<BurgerMenu name="menu-{resource.metadata.id}">
						<BurgerMenuItem
							on:click={() => remove(resource)}
							on:keypress={() => remove(resource)}
							icon="mdi:trash-can-outline"
						>
							Delete
						</BurgerMenuItem>
					</BurgerMenu>
				</svelte:fragment>
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
