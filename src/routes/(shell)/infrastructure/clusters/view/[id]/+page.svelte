<script lang="ts">
	import { page } from '$app/stores';

	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Stepper from '$lib/layouts/Stepper.svelte';
	import ResourceList from '$lib/layouts/ResourceList.svelte';
	import KubernetesWorkloadPool from '$lib/KubernetesWorkloadPool.svelte';
	import Flavor from '$lib/Flavor.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'View/update Kubernetes Cluster',
		description: 'Update an existing Kubernetes cluster.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Region from '$lib/openapi/region';
	import * as RegionUtil from '$lib/regionutil';
	import * as Stores from '$lib/stores';

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

	// Get all clusters and regions.
	let clusters: Array<Kubernetes.KubernetesClusterRead> | undefined = $state();
	let regions: Array<Region.RegionRead> | undefined = $state();

	$effect.pre(() => {
		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Array<Kubernetes.KubernetesClusterRead>) => {
				clusters = v;
			})
			.catch((e: Error) => Clients.error(e));

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsGet(parameters)
			.then((v: Array<Region.RegionRead>) => (regions = v))
			.catch((e: Error) => Clients.error(e));
	});

	// Once we know have the clusters, we can extract the one we care about
	// as identified by the ID, then derive the region and project ID.  From
	// the project ID we can extract all clusters in the same project to use
	// for name comparison.
	let resource: Kubernetes.KubernetesClusterRead | undefined = $state();

	$effect.pre(() => {
		if (!clusters) return;

		const cluster = clusters.find((x) => x.metadata.id == $page.params.id);
		if (!cluster) return;

		resource = cluster;
	});

	let projectID = $derived(resource?.metadata.projectId);
	let regionID = $derived(resource?.spec.regionId);

	let names: Array<string> = $derived.by(() => {
		if (!clusters || projectID) return [];

		return clusters.filter((x) => x.metadata.projectId == projectID).map((x) => x.metadata.name);
	});

	// Once we know the region ID, we can extract the images and flavors.
	let images: Array<Region.Image> | undefined = $state();
	let flavors: Array<Region.Flavor> | undefined = $state();

	$effect.pre(() => {
		if (!regionID) return;

		const parameters = {
			organizationID: organizationInfo.id,
			regionID: regionID
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet(parameters)
			.then((v: Array<Region.Image>) => (images = v))
			.catch((e: Error) => Clients.error(e));

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet(parameters)
			.then((v: Array<Region.Flavor>) => (flavors = v))
			.catch((e: Error) => Clients.error(e));
	});

	// Once we know the images, we can extract the Kubernetes versons available.
	let versions: Array<string> | undefined = $derived.by(() => {
		if (!images) return;

		return [...new Set(images.map((x) => x.spec.softwareVersions?.kubernetes || ''))].reverse();
	});

	let workloadPoolValid: boolean = $state(false);

	let workloadPoolActive: boolean = $state(false);

	function workloadPoolAdd(): number {
		if (!resource) return 0;

		let pool: Kubernetes.KubernetesClusterWorkloadPool = {
			name: '',
			machine: {
				replicas: 3
			},
			autoscaling: {
				minimumReplicas: 0
			}
		};

		resource.spec.workloadPools.push(pool);

		return resource.spec.workloadPools.length - 1;
	}

	function workloadPoolRemove(index: number) {
		if (!resource) return;

		resource.spec.workloadPools.splice(index, 1);
	}

	// A workload pool is valid if all the fields in the pool are valid and
	// the name is unique among all other pools.
	let workloadPoolValidFull: boolean = $derived.by(() => {
		if (!resource || !workloadPoolValid) return false;

		const names = resource.spec.workloadPools.map((x) => x.name);
		const uniqueNames = new Set(names);

		if (names.length != uniqueNames.size) return false;

		return true;
	});

	let step: number = $state(0);

	// Step 1 requires the metadata to be valid and a version to have been selected.
	let metadataValid = $state(false);

	let step1valid: boolean = $derived.by(() => {
		if (step != 0) return true;

		if (!metadataValid) return false;

		return true;
	});

	// Step 2 requires a workload pool to be defined, every workload pool to be valid
	// and all workload pool names to be unique.
	let step2valid: boolean = $derived.by(() => {
		if (step != 1) return true;

		if (!resource) return false;
		if (resource.spec.workloadPools.length == 0) return false;

		const names = resource.spec.workloadPools.map((x) => x.name);
		const uniqueNames = new Set(names);

		if (names.length != uniqueNames.size) return false;

		return true;
	});

	// Roll up the overall validity for the stepper to allow progress.
	let valid = $derived(step1valid && step2valid);

	function lookupFlavor(flavorID: string | undefined): Kubernetes.Flavor | undefined {
		if (!flavors || !flavorID) return;

		return flavors.find((x) => x.metadata.id == flavorID);
	}

	function replicasString(pool: Kubernetes.KubernetesClusterWorkloadPool): string {
		let out = '';

		// TODO: should always be set!!
		if (pool.autoscaling) out += pool.autoscaling.minimumReplicas.toString() + '-';
		if (pool.machine.replicas) out += pool.machine.replicas.toString();

		out += ' replica';

		if (pool.autoscaling || pool.machine.replicas) out += 's';

		return out;
	}

	function complete() {
		if (!projectID || !resource) return;

		const parameters = {
			organizationID: organizationInfo.id,
			projectID: projectID,
			clusterID: resource.metadata.id,
			kubernetesClusterWrite: resource
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPut(parameters)
			.then(() => window.location.assign('/infrastructure/clusters'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#if resource && regions && flavors}
		<ShellViewHeader metadata={resource.metadata}>
			{#snippet badges()}
				{#if resource}
					<Badge icon={RegionUtil.icon(regions, resource.spec.regionId)}>
						{RegionUtil.name(regions, resource.spec.regionId)}
					</Badge>
				{/if}
			{/snippet}
		</ShellViewHeader>

		<Stepper steps={2} bind:step {valid} {complete}>
			{#snippet content(index: number)}
				{#if index === 0}
					<h2 class="h2">Basic Cluster Setup</h2>

					{#if resource && names}
						<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

						<ShellSection title="Platform Configuration">
							<Select
								id="kubernetes-version"
								label="Choose a Kubernetes version."
								hint="Kubernetes provides guarantees backward
                                                compatibility so choosing the newest is usually the right choice as that provides a rich
                                                feature set and enhanced security. Certain applications &mdash; e.g. Kubeflow &mdash;
						may require a specific version."
								bind:value={resource.spec.version}
							>
								{#each versions || [] as version}
									<option value={version}>{version}</option>
								{/each}
							</Select>
						</ShellSection>
					{/if}
				{:else if step === 1}
					{#if resource}
						<ResourceList
							title="Workload Pool Configuration"
							columns={3}
							items={resource.spec.workloadPools}
							bind:active={workloadPoolActive}
							valid={workloadPoolValidFull}
							add={workloadPoolAdd}
							remove={workloadPoolRemove}
						>
							{#snippet description()}
								<p>
									Workload pools provide compute resouce for your cluster. You may have as many as
									required for your workload. Each pool has a set of CPU, GPU and memory that can be
									selected from a defined set of flavours. Workload pools support automatic scaling,
									thus reducing overall operational cost when not in use.
								</p>
							{/snippet}

							<!-- eslint-disable @typescript-eslint/no-unused-vars -->
							{#snippet normal(pool: Kubernetes.KubernetesClusterWorkloadPool, index: number)}
								<div class="h5 font-bold">{pool.name}</div>

								<div>{replicasString(pool)}</div>

								<Flavor flavor={lookupFlavor(pool.machine.flavorId)} />
							{/snippet}

							<!-- eslint-disable @typescript-eslint/no-unused-vars -->
							{#snippet expanded(pool: Kubernetes.KubernetesClusterWorkloadPool, index: number)}
								{#if resource && flavors}
									<KubernetesWorkloadPool
										{flavors}
										bind:pool={resource.spec.workloadPools[index]}
										bind:valid={workloadPoolValid}
									/>
								{/if}
							{/snippet}
						</ResourceList>
					{/if}
				{/if}
			{/snippet}
		</Stepper>
	{/if}
</ShellPage>
