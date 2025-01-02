<script lang="ts">
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';

	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import Select from '$lib/forms/Select.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'View/update Kubernetes Cluster',
		description: 'Update an existing Kubernetes cluster.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { Stepper, Step } from '@skeletonlabs/skeleton';

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
	let allClusters: Array<Kubernetes.KubernetesClusterRead> | undefined = $state();
	let regions: Array<Region.RegionRead> | undefined = $state();

	function updateAllClusters(at: InternalToken, organizationInfo: Stores.OrganizationInfo): void {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Array<Kubernetes.KubernetesClusterRead>) => {
				allClusters = v;
			})
			.catch((e: Error) => Clients.error(e));

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsGet(parameters)
			.then((v: Array<Region.RegionRead>) => (regions = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateAllClusters(at, organizationInfo);
	});

	// Once we know have the clusters, we can extract the one we care about
	// as identified by the ID, then derive the region and project ID.  From
	// the project ID we can extract all clusters in the same project to use
	// for name comparison.
	let resource: Kubernetes.KubernetesClusterRead | undefined = $state();
	let projectID: string;
	let regionID: string | undefined = $state();
	let poolValid: Array<boolean> = $state([]);

	function updateCuster(
		at: InternalToken,
		organizationInfo: Stores.OrganizationInfo,
		allClusters: Array<Kubernetes.KubernetesClusterRead> | undefined
	) {
		if (!at || !organizationInfo || !allClusters) return;

		const temp = allClusters.find((x) => x.metadata.id == $page.params.id);
		if (!temp) return;

		resource = temp;

		// Extract immutable data, or stuff that triggers API calls, we don't
		// want them being invoked for every object update!
		projectID = temp.metadata.projectId;
		regionID = temp.spec.regionId;

		for (let i = 0; i < resource.spec.workloadPools.length; i++) {
			poolValid.push(false);
		}

		poolValid = poolValid;
	}

	run(() => {
		updateCuster(at, organizationInfo, allClusters);
	});

	let names: Array<string> | undefined = $state();

	function updateNames(
		allClusters: Array<Kubernetes.KubernetesClusterRead> | undefined,
		projectID: string | undefined
	) {
		if (!allClusters || !resource) return;

		names = allClusters
			.filter((x) => x.metadata.id != $page.params.id && x.metadata.projectId == projectID)
			.map((x) => x.metadata.name);
	}

	run(() => {
		updateNames(allClusters, projectID);
	});

	// Once we know the region ID, we can extract the images and flavors.
	let images: Array<Region.Image> | undefined = $state();

	function updateImages(
		at: InternalToken,
		organizationInfo: Stores.OrganizationInfo,
		regionID: string | undefined
	): void {
		if (!at || !organizationInfo || !regionID) return;

		const parameters = {
			organizationID: organizationInfo.id,
			regionID: regionID
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet(parameters)
			.then((v: Array<Region.Image>) => (images = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateImages(at, organizationInfo, regionID);
	});

	let flavors: Array<Region.Flavor> | undefined = $state();

	function updateFlavors(
		at: InternalToken,
		organizationInfo: Stores.OrganizationInfo,
		regionID: string | undefined
	): void {
		if (!at || !organizationInfo || !regionID) return;

		const parameters = {
			organizationID: organizationInfo.id,
			regionID: regionID
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet(parameters)
			.then((v: Array<Region.Flavor>) => (flavors = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateFlavors(at, organizationInfo, regionID);
	});

	// Once we know the images, we can extract the Kubernetes versons available.
	let versions: Array<string> | undefined = $state();

	function updateVersions(
		at: InternalToken,
		resource: Kubernetes.KubernetesClusterRead | undefined,
		images: Array<Region.Image> | undefined
	): void {
		if (!at || !resource || !images) return;

		versions = [
			...new Set(
				(images || []).map((x) => {
					if (!x.spec.softwareVersions || !x.spec.softwareVersions.kubernetes) return '';
					return x.spec.softwareVersions.kubernetes;
				})
			)
		].reverse();
	}

	run(() => {
		updateVersions(at, resource, images);
	});

	let metadataValid = $state(false);

	// Cluster name must be valid, and it must be unique.
	let step2Valid = $derived(metadataValid);

	function addPool(): void {
		if (!resource) return;

		let pool: Kubernetes.KubernetesClusterWorkloadPool = {
			name: '',
			machine: {
				replicas: 3,
				disk: {
					size: 50
				}
			},
			autoscaling: {
				minimumReplicas: 0
			}
		};

		resource.spec.workloadPools.push(pool);
		poolValid.push(false);

		// Array so trigger an update.
		resource.spec.workloadPools = resource.spec.workloadPools;
		poolValid = poolValid;
	}

	function removePool(index: number): void {
		if (!resource) return;

		resource.spec.workloadPools.splice(index, 1);
		poolValid.splice(index, 1);

		// Array so trigger an update.
		resource.spec.workloadPools = resource.spec.workloadPools;
		poolValid = poolValid;
	}

	import KubernetesWorkloadPool from '$lib/KubernetesWorkloadPool.svelte';

	/* There must be at least one workload pool, all of them must be valid and every pool must have a unique name */
	let step3Valid = $derived(
		resource &&
			resource.spec.workloadPools.length > 0 &&
			poolValid.every((x) => x) &&
			[...new Set(resource.spec.workloadPools.map((x) => x.name))].length ==
				resource.spec.workloadPools.length
	);

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

		<Stepper on:complete={complete} buttonNext="variant-filled-primary">
			<Step locked={!step2Valid}>
				{#snippet header()}
					Basic Cluster Setup
				{/snippet}

				{#if names}
					<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />
				{/if}

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
			</Step>
			<Step locked={!step3Valid}>
				{#snippet header()}
					Worker Setup
				{/snippet}

				<p>
					Workload pools provide compute resouce for your cluster. You may have as many as required
					for your workload. Each pool has a set of CPU, GPU and memory that can be selected from a
					defined set of flavours. Workload pools support automatic scaling, thus reducing overall
					operational cost when not in use.
				</p>

				<!-- eslint-disable @typescript-eslint/no-unused-vars -->
				{#each resource.spec.workloadPools as pool, index}
					<ShellSection title="Workload Pool {index + 1}">
						{#snippet tools()}
							<button
								class="text-2xl"
								onclick={() => removePool(index)}
								onkeypress={() => removePool(index)}
								aria-label="delete workload pool"
							>
								<iconify-icon icon="mdi:trash-can-outline"></iconify-icon>
							</button>
						{/snippet}

						<KubernetesWorkloadPool
							{index}
							{flavors}
							bind:pool={resource.spec.workloadPools[index]}
							bind:valid={poolValid[index]}
						/>
					</ShellSection>
				{/each}

				<button class="btn flex gap-2 items-center" onclick={addPool} onkeypress={addPool}>
					<iconify-icon icon="mdi:add"></iconify-icon>
					<span>Add New Pool</span>
				</button>
			</Step>
			<Step>
				{#snippet header()}
					Confirmation
				{/snippet}

				<p>Insert a summary of what's about to be created...</p>
			</Step>
		</Stepper>
	{/if}
</ShellPage>
