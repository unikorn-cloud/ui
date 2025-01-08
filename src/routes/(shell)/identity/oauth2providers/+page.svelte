<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import Button from '$lib/forms/Button.svelte';
	import Protected from '$lib/rbac/Protected.svelte';

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

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as RBAC from '$lib/rbac';
	import * as Stores from '$lib/stores';

	// Define required RBAC rules.
	let allowed: boolean = $state(false);

	let organizationScopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:oauth2providers',
			operation: Identity.AclOperation.Create
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

	let resources: Array<Identity.Oauth2ProviderRead> | undefined = $state();

	function update(
		at: InternalToken,
		organizationInfo: Stores.OrganizationInfo,
		allowed: boolean
	): void {
		if (!at || !organizationInfo || !allowed) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDOauth2providersGet(parameters)
			.then((v: Array<Identity.Oauth2ProviderRead>) => (resources = v))
			.catch((e: Error) => Clients.error(e));
	}

	const ticker = setInterval(() => update(at, organizationInfo, allowed), 5000);
	onDestroy(() => clearInterval(ticker));

	function remove(resource: Identity.Oauth2ProviderRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: organizationInfo.id,
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
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/identity/oauth2providers/create" />
	{/snippet}

	<Protected {organizationScopes} bind:allowed>
		<ShellList>
			{#each resources || [] as resource}
				<ShellListItem icon="mdi:key-outline" metadata={resource.metadata}>
					{#snippet tray()}
						<BurgerMenu name="menu-{resource.metadata.id}">
							<BurgerMenuItem clicked={() => remove(resource)} icon="mdi:trash-can-outline">
								Delete
							</BurgerMenuItem>
						</BurgerMenu>
					{/snippet}
				</ShellListItem>
			{/each}
		</ShellList>
	</Protected>
</ShellPage>
