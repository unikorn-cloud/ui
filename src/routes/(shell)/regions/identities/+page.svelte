<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import Protected from '$lib/rbac/Protected.svelte';

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

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';
	import * as RegionUtil from '$lib/regionutil';
	import * as RBAC from '$lib/rbac';
	import * as Stores from '$lib/stores';

	// Define required RBAC rules.
	let allowed: boolean = $state(false);

	let organizationScopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'region:identities',
			operation: Identity.AclOperation.Read
		}
	];

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

	// Grab the main resources from the API.
	let projects: Array<Identity.ProjectRead> | undefined = $state();
	let regions: Array<Region.RegionRead> | undefined = $state();
	let identities: Array<Region.IdentityRead> | undefined = $state();

	function update(
		at: InternalToken,
		organizationInfo: Stores.OrganizationInfo,
		allowed: boolean
	): void {
		if (!at || !organizationInfo || !allowed) return;

		const parameters = {
			organizationID: organizationInfo.id
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

	run(() => {
		update(at, organizationInfo, allowed);
	});

	const ticker = setInterval(() => update(at, organizationInfo, allowed), 5000);
	onDestroy(() => clearInterval(ticker));

	function remove(resource: Region.IdentityRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing identity "${resource.metadata.name}" will remove all cloud infrastructure provisioned by it`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: organizationInfo.id,
					projectID: resource.metadata.projectId,
					identityID: resource.metadata.id
				};

				Clients.region(toastStore, at)
					.apiV1OrganizationsOrganizationIDProjectsProjectIDIdentitiesIdentityIDDelete(parameters)
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	<Protected {organizationScopes} bind:allowed>
		<ShellList>
			{#if projects && regions && identities}
				{#each identities as resource}
					<ShellListItem icon="mdi:user-outline" metadata={resource.metadata} {projects}>
						{#snippet badges()}
							<Badge icon={RegionUtil.icon(regions, resource.spec.regionId)}>
								{RegionUtil.name(regions, resource.spec.regionId)}
							</Badge>
						{/snippet}

						{#snippet tray()}
							<BurgerMenu name="menu-{resource.metadata.id}">
								<BurgerMenuItem clicked={() => remove(resource)} icon="mdi:trash-can-outline">
									Delete
								</BurgerMenuItem>
							</BurgerMenu>
						{/snippet}

						{#snippet extraMetadata()}
							{#if resource.metadata.tags}
								<ShellMetadataItem icon="mdi:tag-outline">
									{#each resource.metadata.tags as tag}
										<div class="badge variant-soft">{tag.name}: {tag.value}</div>
									{/each}
								</ShellMetadataItem>
							{/if}
						{/snippet}
					</ShellListItem>
				{/each}
			{/if}
		</ShellList>
	</Protected>
</ShellPage>
