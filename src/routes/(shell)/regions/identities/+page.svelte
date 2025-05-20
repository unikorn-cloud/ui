<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';
	import * as Region from '$lib/openapi/region';
	import * as RegionUtil from '$lib/regionutil';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import ModalIcon from '$lib/layouts/ModalIcon.svelte';

	const settings: ShellPageSettings = {
		feature: 'Regions',
		name: 'Identities',
		description: 'Manage your cloud identities',
		icon: 'mdi:user-outline'
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:identities'), 5000);

		return () => clearInterval(interval);
	});

	function confirm(resource: Region.IdentityRead): void {
		const parameters = {
			organizationID: data.organizationID,
			projectID: resource.metadata.projectId,
			identityID: resource.metadata.id
		};

		Clients.region()
			.apiV1OrganizationsOrganizationIDProjectsProjectIDIdentitiesIdentityIDDelete(parameters)
			.then(() => invalidate('layout:identities'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<ShellList>
		{#each data.identities as resource}
			<ShellListItem>
				{#snippet main()}
					<ShellListItemHeader metadata={resource.metadata} projects={data.projects} />
				{/snippet}

				{#snippet badges()}
					<ShellListItemBadges metadata={resource.metadata}>
						{#snippet extra()}
							<Badge icon={RegionUtil.icon(data.regions, resource.spec.regionId)}>
								{RegionUtil.name(data.regions, resource.spec.regionId)}
							</Badge>
						{/snippet}
					</ShellListItemBadges>
				{/snippet}

				<ShellListItemMetadata metadata={resource.metadata} />

				{#snippet trail()}
					<ModalIcon
						icon="mdi:trash-can-outline"
						label="Delete"
						title="Are you sure?"
						confirm={() => confirm(resource)}
					>
						Removing identity "{resource.metadata.name}" will delete any clusters owned by it.
					</ModalIcon>
				{/snippet}
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
