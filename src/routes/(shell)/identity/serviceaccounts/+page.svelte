<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import Button from '$lib/forms/Button.svelte';
	import Protected from '$lib/rbac/Protected.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Service Accounts',
		description: "Manage your organization's service accounts."
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
			endpoint: 'identity:serviceaccounts',
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

	let serviceAccounts: Array<Identity.ServiceAccountRead> | undefined = $state();

	function update(at: InternalToken, organizationInfo: Stores.OrganizationInfo, allowed: boolean) {
		if (!at || !organizationInfo || !allowed) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDServiceaccountsGet(parameters)
			.then((v: Array<Identity.ServiceAccountRead>) => (serviceAccounts = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		update(at, organizationInfo, allowed);
	});

	const ticker = setInterval(() => update(at, organizationInfo, allowed), 5000);
	onDestroy(() => clearInterval(ticker));

	function remove(resource: Identity.ServiceAccountRead) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing service account "${resource.metadata.name}" and revoke access token.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: organizationInfo.id,
					serviceAccountID: resource.metadata.id
				};

				Clients.identity(toastStore, at)
					.apiV1OrganizationsOrganizationIDServiceaccountsServiceAccountIDDelete(parameters)
					.then(() => update(at, organizationInfo, allowed))
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/identity/serviceaccounts/create" />
	{/snippet}

	<Protected {organizationScopes} bind:allowed>
		<ShellList>
			{#each serviceAccounts || [] as resource}
				<ShellListItem
					icon="mdi:account-service-outline"
					metadata={resource.metadata}
					href="/identity/serviceaccounts/view/{resource.metadata.id}"
				>
					{#snippet extraMetadata()}
						<ShellMetadataItem icon="mdi:key-outline">
							{resource.spec.expiry}
						</ShellMetadataItem>
					{/snippet}

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
