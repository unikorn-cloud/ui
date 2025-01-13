<script lang="ts">
	import { run } from 'svelte/legacy';

	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Stepper from '$lib/layouts/Stepper.svelte';
	import KubernetesWorkloadPool from '$lib/KubernetesWorkloadPool.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Create Kubernetes Cluster',
		description: 'Create and deploy a new Kubernetes cluster.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	//	import { Stepper, Step } from '@skeletonlabs/skeleton';

	import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';
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

	// Get the root resources.
	let projects: Array<Identity.ProjectRead> | undefined = $state();
	let projectID: string | undefined = $state();

	function updateProjects(at: InternalToken, organizationInfo: Stores.OrganizationInfo) {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsGet(parameters)
			.then((v: Array<Identity.ProjectRead>) => {
				if (v.length == 0) return;

				projects = v;
				projectID = projects[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateProjects(at, organizationInfo);
	});

	let regionID: string | undefined = $state();
	let regions: Array<Region.RegionRead> | undefined = $state();

	function updateRegions(at: InternalToken, organizationInfo: Stores.OrganizationInfo) {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		/* Get top-level resources required for the first step */
		/* TODO: parallelize with Promise.all */
		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsGet(parameters)
			.then((v: Array<Region.RegionRead>) => {
				if (v.length == 0) return;

				regions = v;
				regionID = regions[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateRegions(at, organizationInfo);
	});

	// Once we know the project ID, we can lookup clusters and cluster managers.
	let clustermanagers: Array<Kubernetes.ClusterManagerRead> | undefined = $state();
	let clusters: Array<Kubernetes.KubernetesClusterRead> | undefined = $state();

	function updateClusterManagers(at: InternalToken, projectID: string | undefined) {
		if (!at || !projectID) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustermanagersGet(parameters)
			.then((v: Array<Kubernetes.ClusterManagerRead>) => {
				if (v.length == 0) return;

				// TODO: a possible excuse for request query parameters?
				clustermanagers = v.filter((x) => x.metadata.projectId == projectID);
				resource.spec.clusterManagerId = clustermanagers[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateClusterManagers(at, projectID);
	});

	function updateClusters(at: InternalToken, projectID: string | undefined): void {
		if (!at || !projectID) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Array<Kubernetes.KubernetesClusterRead>) => {
				// As we are only chekcing names, then scope to the project.
				const temp = v.filter((x) => x.metadata.projectId == projectID);
				if (!temp) return;

				clusters = temp;
			})
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateClusters(at, projectID);
	});

	let names = $derived((clusters || []).map((x) => x.metadata.name));

	// Once we know the region, we can load up the images and flavors.
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

	// Once we know the images, we can extract the Kubernetes versons available
	// and select the most recent by default.
	let versions: Array<string> | undefined = $state();

	function updateVersions(at: InternalToken, images: Array<Region.Image> | undefined): void {
		if (!at || !images) return;

		versions = [
			...new Set(
				(images || []).map((x) => {
					if (!x.spec.softwareVersions || !x.spec.softwareVersions.kubernetes) return '';
					return x.spec.softwareVersions.kubernetes;
				})
			)
		].reverse();

		resource.spec.version = versions[0];
	}

	run(() => {
		updateVersions(at, images);
	});

	let resource: Kubernetes.KubernetesClusterWrite = $state({
		metadata: {
			name: uniqueNamesGenerator({
				dictionaries: [adjectives, animals],
				separator: '-',
				length: 2
			})
		},
		spec: {
			regionId: '',
			version: '',
			workloadPools: [
				{
					name: 'default',
					machine: {
						replicas: 3,
						disk: {
							size: 50
						}
					},
					autoscaling: {
						minimumReplicas: 0
					}
				}
			]
		}
	});

	run(() => {
		if (resource && regionID) resource.spec.regionId = regionID;
	});

	let poolValid: Array<boolean> = $state([false]);

	function addPool(): void {
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
		resource.spec.workloadPools.splice(index, 1);
		poolValid.splice(index, 1);

		// Array so trigger an update.
		resource.spec.workloadPools = resource.spec.workloadPools;
		poolValid = poolValid;
	}

	function complete() {
		if (!projectID || !resource) return;

		const parameters = {
			organizationID: organizationInfo.id,
			projectID: projectID,
			kubernetesClusterWrite: resource
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersPost(parameters)
			.then(() => window.location.assign('/infrastructure/clusters'))
			.catch((e: Error) => Clients.error(e));
	}

	let step: number = $state(0);

	// Step 1 requires a project ID and a region to have been selected.
	let step1valid: boolean = $derived.by(() => {
		if (step != 0) return true;

		if (!projectID || !regionID) return false;

		return true;
	});

	// Step 2 requires the metadata to be valid and a version to have been selected.
	let metadataValid = $state(false);

	let step2valid: boolean = $derived.by(() => {
		if (step != 1) return true;

		if (!metadataValid) return false;

		return true;
	});

	// Step 3 requires a workload pool to be defined, every workload pool to be valid
	// and all workload pool names to be unique.
	let step3valid: boolean = $derived.by(() => {
		if (step != 2) return true;

		if (resource.spec.workloadPools.length == 0) return false;
		if (!poolValid.every((x) => x)) return false;

		const names = resource.spec.workloadPools.map((x) => x.name);
		const uniqueNames = new Set(names);

		if (names.length != uniqueNames.size) return false;

		return true;
	});

	// Roll up the overall validity for the stepper to allow progress.
	let valid = $derived(step1valid && step2valid && step3valid);
</script>

<ShellPage {settings}>
	<Stepper steps={3} bind:step {valid} {complete}>
		{#snippet content(index: number)}
			{#if index === 0}
				<h2 class="h2">Basic Configuration</h2>

				<ShellSection title="Environment">
					<Select
						id="project-name"
						label="Choose a project."
						hint="The cluster will be available to users linked to the project's groups."
						bind:value={projectID}
					>
						{#each projects || [] as project}
							<option value={project.metadata.id}>{project.metadata.name}</option>
						{/each}
					</Select>

					<Select
						id="region"
						label="Choose a region."
						hint="Defines the geographical region where the cluster will run."
						bind:value={regionID}
					>
						{#each regions || [] as region}
							<option value={region.metadata.id}>{region.metadata.name}</option>
						{/each}
					</Select>

					{#if clustermanagers}
						<Select
							id="clustermanager"
							label="Choose the cluster manager."
							hint="Allows the selection of the cluster manager, this allows horizonal scaling and isolation of clusters from one another."
							bind:value={resource.spec.clusterManagerId}
						>
							{#each clustermanagers || [] as clustermanager}
								<option value={clustermanager.metadata.id}>{clustermanager.metadata.name}</option>
							{/each}
						</Select>
					{/if}
				</ShellSection>
			{:else if index === 1}
				<h2 class="h2">Platform Configuration</h2>

				<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

				<ShellSection title="Kubernetes Configuration">
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
			{:else if index === 2}
				<h2 class="h2">Workload Pool Configuration</h2>

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

						{#if flavors}
							<KubernetesWorkloadPool
								{index}
								{flavors}
								bind:pool={resource.spec.workloadPools[index]}
								bind:valid={poolValid[index]}
							/>
						{/if}
					</ShellSection>
				{/each}

				<button class="btn flex gap-2 items-center w-full" onclick={addPool} onkeypress={addPool}>
					<iconify-icon icon="mdi:add"></iconify-icon>
					<span>Add New Pool</span>
				</button>
			{/if}
		{/snippet}
	</Stepper>
</ShellPage>
