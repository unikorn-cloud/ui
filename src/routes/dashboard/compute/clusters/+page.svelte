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
	import * as Compute from '$lib/openapi/compute';
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
	import * as Status from '$lib/status';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Compute Clusters',
		description: 'Manage your Compute clusters.'
	};

	const ticker = setInterval(() => invalidate('layout:clusters'), 5000);
	onDestroy(() => clearInterval(ticker));

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
					.catch((e: Error) => Clients.error(e));
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

<ShellPage {settings} allowed={data.allowed}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/dashboard/compute/clusters/create" />
	{/snippet}

	<ShellList>
		{#each data.clusters as resource}
			<ShellListItem icon="mdi:server-network-outline">
				<ShellListItemHeader metadata={resource.metadata} projects={data.projects} />

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

				{#snippet footer()}
					<div class="flex flex-col gap-4 pt-4">
						{#if resource.status?.workloadPools}
							<div class="grid grid-cols-[repeat(4,max-content)_1fr] gap-4 items-center">
								<div class="col-span-full flex gap-2 items-center">
									<div class="h4">Machine Status</div>
								</div>

								{#each resource.status.workloadPools || [] as pool}
									{#each pool.machines || [] as machine}
										<div class="font-bold col-start-1">{machine.hostname}</div>
										<Badge
											icon={Status.statusIcon(machine.status)}
											iconcolor={Status.statusColor(machine.status)}>{machine.status}</Badge
										>

										{#if machine.privateIP}
											<div class="text-sm">
												<span class="font-bold">Private IP</span>
												{machine.privateIP}
											</div>
										{/if}

										{#if machine.publicIP}
											<div class="text-sm">
												<span class="font-bold">Public IP</span>
												{machine.publicIP}
											</div>
										{/if}
									{/each}
								{/each}
							</div>
						{/if}
					</div>
				{/snippet}
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
