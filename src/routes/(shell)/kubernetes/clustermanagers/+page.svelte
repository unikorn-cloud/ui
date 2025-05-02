<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';
	import * as Kubernetes from '$lib/openapi/kubernetes';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import ModalIcon from '$lib/layouts/ModalIcon.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Kubernetes Cluster Managers',
		description: 'Manage your Kubernetes cluster life-cycle managers.'
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:clustermanagers'), 5000);

		return () => clearInterval(interval);
	});

	function confirm(resource: Kubernetes.ClusterManagerRead): void {
		const parameters = {
			organizationID: data.organizationID,
			projectID: resource.metadata.projectId,
			clusterManagerID: resource.metadata.id
		};

		Clients.kubernetes()
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDelete(
				parameters
			)
			.then(() => invalidate('layout:clustermanagers'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<ShellList>
		{#each data.clustermanagers as resource}
			<ShellListItem icon="mdi:kubernetes">
				{#snippet main()}
					<ShellListItemHeader metadata={resource.metadata} projects={data.projects} />
				{/snippet}

				<ShellListItemBadges metadata={resource.metadata} />

				<ShellListItemMetadata metadata={resource.metadata} />

				{#snippet trail()}
					<ModalIcon
						icon="mdi:trash-can-outline"
						title="Are you sure?"
						confirm={() => confirm(resource)}
					>
						Removing cluster manager "{resource.metadata.name}" will remove any clusters managed by
						it.
					</ModalIcon>
				{/snippet}
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
