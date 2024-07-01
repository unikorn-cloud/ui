<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListTray from '$lib/layouts/ShellListTray.svelte';

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

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Identity from '$lib/openapi/identity';

	let at: InternalToken;

	let resources: Array<Kubernetes.ClusterManagerRead>;

	let projects: Array<Identity.ProjectRead>;

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
			body: `Removing control plane "${resource.metadata.name}" will remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: organizationID,
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
			<ShellListItem metadata={resource.metadata} {projects} href="#">
				<ShellListTray>
					<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
						<iconify-icon icon="mdi:close" />
					</button>
				</ShellListTray>
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
