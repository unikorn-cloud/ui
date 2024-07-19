<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'OAuth2 Providers',
		description: 'Manage your OAuth2 providers.'
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

	let at: InternalToken;

	let organizationID: string;

	token.subscribe((token: InternalToken) => {
		at = token;
		update();

		const ticker = setInterval(update, 5000);
		onDestroy(() => clearInterval(ticker));
	});

	organizationStore.subscribe((value: string) => {
		organizationID = value;
		update();
	});

	let resources: Array<Identity.Oauth2ProviderRead>;

	function update(): void {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDOauth2providersGet(parameters)
			.then((v: Array<Identity.Oauth2ProviderRead>) => (resources = v))
			.catch((e: Error) => Clients.error(e));
	}

	function remove(resource: Identity.Oauth2ProviderRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: organizationID,
					providerID: resource.metadata.id
				};

				Clients.identity(toastStore, at)
					.apiV1OrganizationsOrganizationIDOauth2providersProviderIDDelete(parameters)
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	<a
		href="/identity/oauth2providers/create"
		class="btn variant-filled-primary flex gap-2 items-center"
		slot="tools"
	>
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</a>

	<ShellList>
		{#each resources || [] as resource}
			<ShellListItem metadata={resource.metadata}>
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
