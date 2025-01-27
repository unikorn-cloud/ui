<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate, beforeNavigate } from '$app/navigation';

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
		name: 'Projects',
		description: 'Manage your resources.'
	};

	const ticker = setInterval(() => invalidate('layout:projects'), 5000);
	beforeNavigate(() => clearInterval(ticker));

	function remove(resource: Identity.ProjectRead): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing project "${resource.metadata.name}" will also remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: data.organizationID,
					projectID: resource.metadata.id
				};

				Clients.identity(data.token)
					.apiV1OrganizationsOrganizationIDProjectsProjectIDDelete(parameters)
					.then(() => invalidate('layout:projects'))
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings} allowed={data.allowed}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/identity/projects/create" />
	{/snippet}

	<ShellList>
		{#each data.projects || [] as resource}
			<ShellListItem icon="mdi:account-group-outline">
				<ShellListItemHeader
					metadata={resource.metadata}
					href="/identity/projects/view/{resource.metadata.id}"
				/>

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
