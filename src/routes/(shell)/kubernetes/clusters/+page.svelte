<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';
	import * as Kubernetes from '$lib/openapi/kubernetes';
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
	import Button from '$lib/forms/Button.svelte';
	import PopupButton from '$lib/forms/PopupButton.svelte';
	import ModalIcon from '$lib/layouts/ModalIcon.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Kubernetes Clusters',
		description: 'Manage your Kubernetes clusters.'
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:clusters'), 5000);

		return () => clearInterval(interval);
	});

	function confirm(resource: Kubernetes.KubernetesClusterRead): void {
		const parameters = {
			organizationID: data.organizationID,
			projectID: resource.metadata.projectId,
			clusterID: resource.metadata.id
		};

		Clients.kubernetes(data.token)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete(parameters)
			.then(() => invalidate('layout:clusters'))
			.catch((e: Error) => Clients.error(e));
	}

	function getKubeconfig(resource: Kubernetes.KubernetesClusterRead): void {
		const parameters = {
			organizationID: data.organizationID,
			projectID: resource.metadata.projectId,
			clusterID: resource.metadata.id
		};

		Clients.kubernetes(data.token)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGetRaw(
				parameters
			)
			.then((x) => x.raw.blob())
			.then((x) => {
				if (browser) {
					const url = window.URL.createObjectURL(x);

					const a = document.createElement('a');
					a.style.display = 'none';
					a.href = url;
					a.download = `kubeconfig-${resource.metadata.name}.yaml`;

					document.body.appendChild(a);
					a.click();

					window.URL.revokeObjectURL(url);
				}
			})
			.catch((e: Error) => Clients.error(e));
	}

	let createProjectID = $state(data.projects[0].metadata.id);
	let createRegionID = $state(data.regions[0].metadata.id);

	function lookupRegion(id: string): Region.RegionRead {
		return data.regions.find((x) => x.metadata.id == id) as Region.RegionRead;
	}
</script>

<ShellPage {settings}>
	{#snippet tools()}
		<PopupButton icon="mdi:add" class="self-end" label="Create">
			{#snippet contents()}
				<div class="flex flex-col gap-4">
					<div class="font-bold">Project</div>

					<div class="input-group grid grid-cols-[auto_1fr]">
						<iconify-icon icon="mdi:account-group-outline" class="ig-cell"></iconify-icon>

						<select class="ig-select" bind:value={createProjectID}>
							{#each data.projects as p}
								<option value={p.metadata.id}>{p.metadata.name}</option>
							{/each}
						</select>
					</div>

					<div class="font-bold">Region</div>

					<div class="input-group grid grid-cols-[auto_1fr]">
						<iconify-icon icon={RegionUtil.iconIcon(lookupRegion(createRegionID))} class="ig-cell"
						></iconify-icon>

						<select class="ig-select" bind:value={createRegionID}>
							{#each data.regions as r}
								<option value={r.metadata.id}>{r.metadata.name}</option>
							{/each}
						</select>
					</div>

					<a
						href="/kubernetes/clusters/create?projectID={createProjectID}&regionID={createRegionID}"
						class="btn preset-filled-primary-500">Create</a
					>
				</div>
			{/snippet}
		</PopupButton>
	{/snippet}

	{#if data.projects.length == 0}
		<i>You are not yet a member of any projects, ask an administrator to create one.</i>
	{:else if data.clusters.length == 0}
		<i>No clusters to display, create one to get started.</i>
	{:else}
		<ShellList>
			{#each data.clusters as resource}
				<ShellListItem icon="mdi:kubernetes">
					{#snippet main()}
						<ShellListItemHeader
							metadata={resource.metadata}
							href="/kubernetes/clusters/view/{resource.metadata.id}"
							projects={data.projects}
						/>
					{/snippet}

					<ShellListItemBadges metadata={resource.metadata}>
						{#snippet extra()}
							<Badge icon={RegionUtil.icon(data.regions, resource.spec.regionId)}>
								{RegionUtil.name(data.regions, resource.spec.regionId)}
							</Badge>
						{/snippet}
					</ShellListItemBadges>

					<ShellListItemMetadata metadata={resource.metadata} />

					{#snippet trail()}
						<Button icon="mdi:download" clicked={() => getKubeconfig(resource)} />
						<ModalIcon
							icon="mdi:trash-can-outline"
							title="Are you sure?"
							confirm={() => confirm(resource)}
						></ModalIcon>
					{/snippet}
				</ShellListItem>
			{/each}
		</ShellList>
	{/if}
</ShellPage>
