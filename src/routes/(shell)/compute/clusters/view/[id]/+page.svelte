<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	import * as RegionUtil from '$lib/regionutil';
	import * as ProvisioningStatus from '$lib/provisioningStatus';
	import * as Clients from '$lib/clients';
	import * as Compute from '$lib/openapi/compute';
	import * as Identity from '$lib/openapi/identity';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPageHeader from '$lib/layouts/ShellPageHeader.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import ModalIcon from '$lib/layouts/ModalIcon.svelte';
	import SubtleButton from '$lib/forms/SubtleButton.svelte';
	import Flavor from '$lib/Flavor.svelte';
	import Image from '$lib/Image.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'View/update Compute Cluster',
		description: 'Update an existing compute cluster.',
		icon: 'mdi:server-network-outline'
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:clusters'), 5000);

		return () => clearInterval(interval);
	});

	function getImage(id: string): Compute.Image {
		return data.images.find((x) => x.metadata.id == id) as Compute.Image;
	}

	function getFlavor(id: string): Compute.Flavor {
		return data.flavors.find((x) => x.metadata.id == id) as Compute.Flavor;
	}

	function confirm(resource: Compute.ComputeClusterRead): void {
		const parameters = {
			organizationID: resource.metadata.organizationId,
			projectID: resource.metadata.projectId,
			clusterID: resource.metadata.id
		};

		Clients.compute()
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete(parameters)
			.then(() => window.location.assign('/compute/clusters'))
			.catch((e: Error) => Clients.error(e));
	}

	function getSSHKey(resource: Compute.ComputeClusterRead): void {
		if (browser && resource.status?.sshPrivateKey) {
			const url = window.URL.createObjectURL(new Blob([resource.status.sshPrivateKey]));

			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = `id_${resource.metadata.name}`;

			document.body.appendChild(a);
			a.click();

			window.URL.revokeObjectURL(url);
		}
	}
</script>

<ShellPageHeader {settings}>
	{#snippet tools()}
		<SubtleButton
			icon="mdi:edit-outline"
			label="Edit"
			href="/compute/clusters/edit/{data.cluster.metadata.id}"
		/>
		<SubtleButton icon="mdi:connection" label="SSH Key" clicked={() => getSSHKey(data.cluster)} />
		<ModalIcon
			icon="mdi:trash-can-outline"
			label="Delete"
			title="Are you sure?"
			confirm={() => confirm(data.cluster)}
		></ModalIcon>
	{/snippet}
</ShellPageHeader>

<ShellViewHeader metadata={data.cluster.metadata}>
	{#snippet badges()}
		<Badge icon={RegionUtil.icon(data.regions, data.cluster.spec.regionId)}>
			{RegionUtil.name(data.regions, data.cluster.spec.regionId)}
		</Badge>
	{/snippet}
</ShellViewHeader>

<ShellSection title="Machine Status">
	{#if data.cluster.status?.workloadPools}
		<ShellList>
			{#each data.cluster.status.workloadPools || [] as pool}
				{#each pool.machines || [] as machine}
					<ShellListItem>
						{#snippet main()}
							<div class="flex gap-4 items-center">
								<ShellListItemHeader title={machine.hostname} />
								<Flavor flavor={getFlavor(machine.flavorID)} />
								<Image image={getImage(machine.imageID)} />
							</div>
						{/snippet}

						{#snippet badges()}
							<ShellListItemBadges>
								{#snippet extra()}
									<Badge
										icon={ProvisioningStatus.statusIcon(
											machine.status as Identity.ResourceProvisioningStatus
										)}
										iconcolor={ProvisioningStatus.statusColor(machine.status)}
										>{machine.status as Identity.ResourceProvisioningStatus}</Badge
									>
								{/snippet}
							</ShellListItemBadges>
						{/snippet}

						{#if machine.privateIP}
							<ShellMetadataItem
								icon="mdi:local-area-network"
								label="Private IP"
								value={machine.privateIP}
							/>
						{/if}

						{#if machine.publicIP}
							<ShellMetadataItem
								icon="mdi:local-area-network"
								label="Public IP"
								value={machine.publicIP}
							/>
						{/if}
					</ShellListItem>
				{/each}
			{/each}
		</ShellList>
	{/if}
</ShellSection>
