<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import * as Status from '$lib/status';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Compute Clusters',
		description: 'Manage your Compute clusters.'
	};

	import { onDestroy } from 'svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import * as Compute from '$lib/openapi/compute';
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';
	import * as RegionUtil from '$lib/regionutil';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Stores from '$lib/stores';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { browser } from '$app/environment';

	let at: InternalToken;

	let resources: Array<Compute.ComputeClusterRead>;
	let projects: Array<Identity.ProjectRead>;
	let regions: Array<Region.RegionRead>;

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

		Clients.compute(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Array<Compute.ComputeClusterRead>) => (resources = v))
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

	function remove(resource: Compute.ComputeClusterRead): void {
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

				Clients.compute(toastStore, at)
					.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete(parameters)
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

<ShellPage {settings}>
	<a
		href="/infrastructure/computeclusters/create"
		class="btn variant-filled-primary flex gap-2 items-center"
		slot="tools"
	>
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</a>

	<ShellList>
		{#each resources || [] as resource}
			<ShellListItem metadata={resource.metadata} {projects}>
				<svelte:fragment slot="badges">
					<Badge icon={RegionUtil.icon(regions, resource.spec.regionId)}>
						{RegionUtil.name(regions, resource.spec.regionId)}
					</Badge>
				</svelte:fragment>

				<svelte:fragment slot="tray">
					<BurgerMenu name="menu-{resource.metadata.id}">
						<BurgerMenuItem
							href="/infrastructure/computeclusters/view/{resource.metadata.id}"
							icon="mdi:edit-outline"
						>
							Edit
						</BurgerMenuItem>
						<BurgerMenuItem
							on:click={() => remove(resource)}
							on:keypress={() => remove(resource)}
							icon="mdi:trash-can-outline"
						>
							Delete
						</BurgerMenuItem>
						<BurgerMenuItem
							on:click={() => getSSHKey(resource)}
							on:keypress={() => getSSHKey(resource)}
							icon="mdi:download"
						>
							SSH Key
						</BurgerMenuItem>
					</BurgerMenu>
				</svelte:fragment>

				<Accordion class="pt-4">
					<AccordionItem padding="py-2" hover="">
						<svelte:fragment slot="summary">
							<span>Cluster Overview</span>
						</svelte:fragment>

						<svelte:fragment slot="content">
							{#each resource.status?.workloadPools || [] as pool}
								<div class="flex gap-2 items-center">
									<iconify-icon icon="mdi:server-outline" class="text-2xl" />
									<div class="h4">Pool {pool.name}</div>
								</div>

								{#each pool.machines || [] as machine}
									<div class="flex gap-2">
										<Badge
											icon={Status.statusIcon(machine.status)}
											iconcolor={Status.statusColor(machine.status)}
										/>
										<div class="flex flex-col gap-2">
											<div class="flex gap-2">
												<div class="font-bold">{machine.hostname}</div>
											</div>

											<div class="flex gap-2 text-xs">
												{#if machine.privateIP}
													<div>
														<span class="font-bold">Private IP:</span>
														{machine.privateIP}
													</div>
												{/if}

												{#if machine.publicIP}
													<div>
														<span class="font-bold">Public IP:</span>
														{machine.publicIP}
													</div>
												{/if}
											</div>
										</div>
									</div>
								{/each}
							{/each}
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
