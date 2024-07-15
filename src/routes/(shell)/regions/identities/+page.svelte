<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListTray from '$lib/layouts/ShellListTray.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';

	const settings: ShellPageSettings = {
		feature: 'Regions',
		name: 'Identities',
		description: 'Manage your cloud identities'
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
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';
	import * as RegionUtil from '$lib/regionutil';

	let at: InternalToken;

	let projects: Array<Identity.ProjectRead>;
	let regions: Array<Region.RegionRead>;
	let identities: Array<Region.IdentityRead>;

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

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDIdentitiesGet(parameters)
			.then((v: Array<Region.IdentityRead>) => (identities = v))
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

	function remove(resource: Region.IdentityRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing identity "${resource.metadata.name}" will remove all cloud infrastructure provisioned by it`,
			response: (ok: boolean) => {
				if (!ok) return;

				/*
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
			*/
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	<ShellList>
		{#each identities || [] as identity}
			<ShellListItem metadata={identity.metadata} {projects} href="#">
				<svelte:fragment slot="badges">
					<Badge icon={RegionUtil.icon(regions, identity.spec.regionId)}>
						{RegionUtil.name(regions, identity.spec.regionId)}
					</Badge>
				</svelte:fragment>

				<ShellListTray>
					<button on:click={() => remove(identity)} on:keypress={() => remove(identity)}>
						<iconify-icon icon="mdi:trash-can-outline" />
					</button>
				</ShellListTray>

				<svelte:fragment slot="metadata">
					{#if identity.spec.tags}
						<ShellMetadataItem icon="mdi:tag-outline">
							{#each identity.spec.tags as tag}
								<div class="badge variant-soft">{tag.name}: {tag.value}</div>
							{/each}
						</ShellMetadataItem>
					{/if}
				</svelte:fragment>
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
