<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate, beforeNavigate } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	import * as Clients from '$lib/clients';
	import * as Kubernetes from '$lib/openapi/kubernetes';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Kubernetes Cluster Managers',
		description: 'Manage your Kubernetes cluster life-cycle managers.'
	};

	const ticker = setInterval(() => invalidate('layout:clustermanagers'), 5000);
	beforeNavigate(() => clearInterval(ticker));

	function remove(resource: Kubernetes.ClusterManagerRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing cluster manager "${resource.metadata.name}" will remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: data.organizationID,
					projectID: resource.metadata.projectId,
					clusterManagerID: resource.metadata.id
				};

				Clients.kubernetes(data.token)
					.apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDelete(
						parameters
					)
					.then(() => invalidate('layout:clustermanagers'))
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings} allowed={data.allowed}>
	<ShellList>
		{#each data.clustermanagers as resource}
			<ShellListItem icon="mdi:kubernetes">
				<ShellListItemHeader metadata={resource.metadata} projects={data.projects} />

				<ShellListItemBadges metadata={resource.metadata} />

				<ShellListItemMetadata metadata={resource.metadata} />

				{#snippet trail()}
					<BurgerMenu name="menu-{resource.metadata.id}">
						<BurgerMenuItem clicked={() => remove(resource)} icon="mdi:trash-can-outline">
							Delete
						</BurgerMenuItem>
					</BurgerMenu>
				{/snippet}
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
