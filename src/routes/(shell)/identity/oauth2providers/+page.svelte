<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';

	let { data }: { data: PageData } = $props();

	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';

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
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'OAuth2 Providers',
		description: 'Manage your OAuth2 providers.'
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:oauth2providers'), 5000);

		return () => clearInterval(interval);
	});

	function remove(resource: Identity.Oauth2ProviderRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: data.organizationID,
					providerID: resource.metadata.id
				};

				Clients.identity(data.token)
					.apiV1OrganizationsOrganizationIDOauth2providersProviderIDDelete(parameters)
					.then(() => invalidate('layout:oauth2providers'))
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings} allowed={data.allowed}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/identity/oauth2providers/create" />
	{/snippet}

	<ShellList>
		{#each data.oauth2providers || [] as resource}
			<ShellListItem icon="mdi:key-outline">
				{#snippet main()}
					<ShellListItemHeader
						metadata={resource.metadata}
						href="/identity/oauth2providers/view/{resource.metadata.id}"
					/>
				{/snippet}

				<ShellListItemBadges metadata={resource.metadata} />

				<ShellListItemMetadata metadata={resource.metadata} />

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
