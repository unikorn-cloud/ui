<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import Protected from '$lib/rbac/Protected.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Groups',
		description: 'Manage your organizations groups and roles.'
	};

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
	import * as RBAC from '$lib/rbac';
	import * as Stores from '$lib/stores';

	let at: InternalToken;
	let organizationInfo: Stores.OrganizationInfo;

	// Define required RBAC rules.
	let allowed: boolean;

	let organizationScopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:groups',
			operation: Identity.AclOperation.Create
		}
	];

	token.subscribe((token: InternalToken) => (at = token));

	Stores.organizationStore.subscribe(
		(value: Stores.OrganizationInfo) => (organizationInfo = value)
	);

	let groups: Array<Identity.GroupRead>;

	function update(at: InternalToken, organizationInfo: Stores.OrganizationInfo, allowed: boolean) {
		if (!at || !organizationInfo || !allowed) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(parameters)
			.then((v: Array<Identity.GroupRead>) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organizationInfo, allowed);

	function remove(resource: Identity.GroupRead) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing group "${resource.metadata.name}" disassociate any projects referencing it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: organizationInfo.id,
					groupid: resource.metadata.id
				};

				Clients.identity(toastStore, at)
					.apiV1OrganizationsOrganizationIDGroupsGroupidDelete(parameters)
					.then(() => update(at, organizationInfo, allowed))
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	<form action="/identity/groups/create" slot="tools">
		<button class="btn variant-filled-primary flex gap-2 items-center" disabled={!allowed}>
			<iconify-icon icon="material-symbols:add" />
			<span>Create</span>
		</button>
	</form>

	<Protected {organizationScopes} bind:allowed>
		<ShellList>
			{#each groups || [] as resource}
				<ShellListItem metadata={resource.metadata}>
					<svelte:fragment slot="tray">
						<BurgerMenu name="menu-{resource.metadata.id}">
							<BurgerMenuItem
								href="/identity/groups/view/{resource.metadata.id}"
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
						</BurgerMenu>
					</svelte:fragment>
				</ShellListItem>
			{/each}
		</ShellList>
	</Protected>
</ShellPage>
