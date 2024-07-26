<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';

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

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';

	let at: InternalToken;

	token.subscribe((token: InternalToken) => (at = token));

	let organizationID: string;

	organizationStore.subscribe((value: string) => (organizationID = value));

	let groups: Array<Identity.GroupRead>;

	function update(at: InternalToken, organizationID: string) {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(parameters)
			.then((v: Array<Identity.GroupRead>) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organizationID);

	function remove(resource: Identity.GroupRead) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing group "${resource.metadata.name}" disassociate any projects referencing it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: organizationID,
					groupid: resource.metadata.id
				};

				Clients.identity(toastStore, at)
					.apiV1OrganizationsOrganizationIDGroupsGroupidDelete(parameters)
					.then(() => update(at, organizationID))
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	<a
		href="/identity/groups/create"
		class="btn variant-filled-primary flex gap-2 items-center"
		slot="tools"
	>
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</a>

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
</ShellPage>
