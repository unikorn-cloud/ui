<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Stepper from '$lib/layouts/Stepper.svelte';
	import ResourceList from '$lib/layouts/ResourceList.svelte';
	import KubernetesWorkloadPool from '$lib/KubernetesWorkloadPool.svelte';
	import Flavor from '$lib/Flavor.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Create Kubernetes Cluster',
		description: 'Create and deploy a new Kubernetes cluster.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

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
	let regions: Array<Region.RegionRead> | undefined = $state();

	let projectID: string | undefined = $state();
	let regionID: string | undefined = $state();

	$effect.pre(() => {
		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsGet(parameters)
			.then((v: Array<Identity.ProjectRead>) => {
				projects = v;
				if (projects.length) projectID = projects[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsGet(parameters)
			.then((v: Array<Region.RegionRead>) => {
				regions = v;
				if (regions.length) regionID = regions[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));
	});

	// Once we know the project ID, we can lookup clusters and cluster managers.
	let clustermanagers: Array<Kubernetes.ClusterManagerRead> | undefined = $state();
	let clusters: Array<Kubernetes.KubernetesClusterRead> | undefined = $state();

	$effect.pre(() => {
		if (!projectID) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustermanagersGet(parameters)
			.then((v: Array<Kubernetes.ClusterManagerRead>) => {
				clustermanagers = v.filter((x) => x.metadata.projectId == projectID);
			})
			.catch((e: Error) => Clients.error(e));

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Array<Kubernetes.KubernetesClusterRead>) => {
				clusters = v.filter((x) => x.metadata.projectId == projectID);
			})
			.catch((e: Error) => Clients.error(e));
	});

	let names: Array<string> = $derived.by(() => {
		if (!clusters || projectID) return [];

		return clusters.filter((x) => x.metadata.projectId == projectID).map((x) => x.metadata.name);
	});

	// Once we know the region, we can load up the images and flavors.
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
						replicas: 3
					},
					autoscaling: {
						minimumReplicas: 0
					}
				}
			]
		}
	});

	// Update the region ID when modified.
	$effect.pre(() => {
		if (regionID) resource.spec.regionId = regionID;
	});

	// When cluster managers are available, select a default.
	$effect.pre(() => {
		if (clustermanagers?.length) resource.spec.clusterManagerId = clustermanagers[0].metadata.id;
	});

	// Select a default Kubernetes version.
	$effect.pre(() => {
		if (versions?.length) resource.spec.version = versions[0];
	});

	let workloadPoolValid: boolean = $state(false);

	let workloadPoolActive: boolean = $state(false);

	function workloadPoolAdd(): number {
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
		resource.spec.workloadPools.splice(index, 1);
	}

	// A workload pool is valid if all the fields in the pool are valid and
	// the name is unique among all other pools.
	let workloadPoolValidFull: boolean = $derived.by(() => {
		if (!workloadPoolValid) return false;

		const names = resource.spec.workloadPools.map((x) => x.name);
		const uniqueNames = new Set(names);

		if (names.length != uniqueNames.size) return false;

		return true;
	});

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

	// Step 3 requires a workload pool to be defined.
	let step3valid: boolean = $derived.by(() => {
		if (step != 2) return true;

		// If there is a workload pool active, it is potentially invalid.
		if (workloadPoolActive) return false;

		if (resource.spec.workloadPools.length == 0) return false;

		return true;
	});

	// Roll up the overall validity for the stepper to allow progress.
	let valid = $derived(step1valid && step2valid && step3valid);

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
				<ResourceList
					title="Workload Pool Configuration"
					columns={3}
					items={resource.spec.workloadPools}
					initialItem={0}
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
						{#if flavors}
							<KubernetesWorkloadPool
								{flavors}
								bind:pool={resource.spec.workloadPools[index]}
								bind:valid={workloadPoolValid}
							/>
						{/if}
					{/snippet}
				</ResourceList>
			{/if}
		{/snippet}
	</Stepper>
</ShellPage>
