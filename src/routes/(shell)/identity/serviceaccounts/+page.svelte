<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';

	let { data }: { data: PageData } = $props();

	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Service Accounts',
		description: "Manage your organization's service accounts."
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:serviceaccounts'), 5000);

		return () => clearInterval(interval);
	});

	function remove(resource: Identity.ServiceAccountRead) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing service account "${resource.metadata.name}" and revoke access token.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: data.organizationID,
					serviceAccountID: resource.metadata.id
				};

				Clients.identity(data.token)
					.apiV1OrganizationsOrganizationIDServiceaccountsServiceAccountIDDelete(parameters)
					.then(() => invalidate('layout:serviceaccounts'))
					.catch((e: Error) => Clients.error(toastStore, e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/identity/serviceaccounts/create" />
	{/snippet}

	<ShellList>
		{#each data.serviceAccounts || [] as resource}
			<ShellListItem icon="mdi:account-service-outline">
				{#snippet main()}
					<ShellListItemHeader
						metadata={resource.metadata}
						href="/identity/serviceaccounts/view/{resource.metadata.id}"
					/>
				{/snippet}

				<ShellListItemBadges metadata={resource.metadata} />

				<ShellListItemMetadata metadata={resource.metadata} />

				<ShellListItemMetadata>
					<ShellMetadataItem
						icon="mdi:key-outline"
						label="Expiry"
						value={resource.status.expiry.toUTCString()}
					/>
				</ShellListItemMetadata>

				{#snippet trail()}
					<BurgerMenu name="menu-{resource.metadata.id}">
						<BurgerMenuItem clicked={() => remove(resource)} icon="mdi:trash-can-outline">
							Delete
						</BurgerMenuItem>
					</BurgerMenu>
				{/snippet}
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
