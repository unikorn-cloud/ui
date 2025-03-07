<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';
	import * as Compute from '$lib/openapi/compute';
	import * as RegionUtil from '$lib/regionutil';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import GroupedList from '$lib/layouts/GroupedList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import PopupButton from '$lib/forms/PopupButton.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Compute Clusters',
		description: 'Manage your Compute clusters.'
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:clusters'), 5000);

		return () => clearInterval(interval);
	});

	let groups = $derived.by(() => {
		let temp: Record<string, Array<Compute.ComputeClusterRead>> = {};

		// Sort by name.
		const names = data.projects.map((x) => ({ id: x.metadata.id, name: x.metadata.name }));
		names.sort((x, y) => x.name.localeCompare(y.name));

		names.forEach((x) => (temp[x.id] = []));
		data.clusters.forEach((x) => temp[x.metadata.projectId].push(x));

		return temp;
	});

	function project(id: string): Identity.ProjectRead {
		return data.projects.find((x) => x.metadata.id == id) as Identity.ProjectRead;
	}

	function remove(resource: Compute.ComputeClusterRead): void {
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

				Clients.compute(data.token)
					.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete(parameters)
					.then(() => invalidate('layout:clusters'))
					.catch((e: Error) => Clients.error(toastStore, e));
			}
		};

		modalStore.trigger(modal);
	}

	function getSSHKey(resource: Compute.ComputeClusterRead): void {
		if (browser && resource.status?.sshPrivateKey) {
			const url = window.URL.createObjectURL(new Blob([resource.status.sshPrivateKey]));

			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = `id_${resource.metadata.name}`;

			document.body.appendChild(a);
			a.click();

			window.URL.revokeObjectURL(url);
		}
	}
</script>

<ShellPage {settings}>
	<GroupedList {groups}>
		{#snippet option(projectID: string)}
			{project(projectID).metadata.name}
		{/snippet}

		{#snippet header(projectID: string)}
			<header class="flex justify-between">
				<div class="flex gap-4 items-center">
					<iconify-icon icon="mdi:account-group-outline" class="text-3xl text-primary-500"
					></iconify-icon>

					<div class="h4">{project(projectID).metadata.name}</div>
				</div>

				<PopupButton id="create-{projectID}" icon="mdi:add" class="self-end" label="Create">
					{#snippet content()}
						<div class="pb-4">Select region</div>

						<div class="flex flex-col gap-2">
							{#each data.regions as region}
								<a
									href="/compute/clusters/create?projectID={projectID}&regionID={region.metadata
										.id}"
									class="flex gap-4 items-center"
								>
									<iconify-icon icon={RegionUtil.iconIcon(region)}></iconify-icon>
									{region.metadata.name}
								</a>
							{/each}
						</div>
					{/snippet}
				</PopupButton>
			</header>
		{/snippet}

		{#snippet item(resource: Compute.ComputeClusterRead)}
			<ShellListItem icon="mdi:server-network-outline">
				{#snippet main()}
					<ShellListItemHeader
						metadata={resource.metadata}
						projects={data.projects}
						href="/compute/clusters/view/{resource.metadata.id}"
					/>
				{/snippet}

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
						<BurgerMenuItem clicked={() => getSSHKey(resource)} icon="mdi:download">
							SSH Key
						</BurgerMenuItem>
					</BurgerMenu>
				{/snippet}
			</ShellListItem>
		{/snippet}
	</GroupedList>
</ShellPage>
