<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import Button from '$lib/forms/Button.svelte';
	import ModalIcon from '$lib/layouts/ModalIcon.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Projects',
		description: 'Manage your resources.'
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:projects'), 5000);

		return () => clearInterval(interval);
	});

	function confirm(id: string): void {
		const parameters = {
			organizationID: data.organizationID,
			projectID: id
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDDelete(parameters)
			.then(() => invalidate('layout:projects'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/identity/projects/create" />
	{/snippet}

	<ShellList>
		{#each data.projects || [] as resource}
			<ShellListItem icon="mdi:account-group-outline">
				{#snippet main()}
					<ShellListItemHeader
						metadata={resource.metadata}
						href="/identity/projects/view/{resource.metadata.id}"
					/>
				{/snippet}

				<ShellListItemBadges metadata={resource.metadata} />

				<ShellListItemMetadata metadata={resource.metadata} />

				{#snippet trail()}
					<ModalIcon
						icon="mdi:trash-can-outline"
						title="Are you sure?"
						confirm={() => confirm(resource.metadata.id)}
					>
						Removing project "{resource.metadata.name}" will remove all infrastructure owned by it.
					</ModalIcon>
				{/snippet}
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
