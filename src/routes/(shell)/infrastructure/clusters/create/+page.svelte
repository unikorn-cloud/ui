<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Create Kubernetes Cluster',
		description: 'Create and deploy a new Kubernetes cluster.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { Stepper, Step } from '@skeletonlabs/skeleton';

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';

	/* Input vaildation */
	import * as Validation from '$lib/validation';

	let at: InternalToken;

	/* Variables that trigger reactive actions */
	let regionID: string;
	let regions: Region.Regions;

	let projectID: string;
	let projects: Identity.Projects;

	let clustermanagerID: string;
	let clustermanagers: Kubernetes.ClusterManagers;

	let cluster: string;
	let clusters: Kubernetes.KubernetesClusters;

	let images: Region.Images;
	let flavors: Region.Flavors;

	let version: string;
	let versions: Array<string>;

	let organizationID: string;

	organizationStore.subscribe((value: string) => {
		organizationID = value;
		updateRegions();
	});

	token.subscribe((value: InternalToken) => {
		at = value;
		updateRegions();
	});

	function updateRegions() {
		if (!at || !organizationID) return;

		/* Get top-level resources required for the first step */
		/* TODO: parallelize with Promise.all */
		Clients.region(toastStore, at)
			.apiV1RegionsGet()
			.then((v: Region.Regions) => {
				if (v.length == 0) return;

				regions = v;
				regionID = regions[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));

		const parameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsGet(parameters)
			.then((v: Identity.Projects) => {
				if (v.length == 0) return;

				projects = v;
				projectID = projects[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));
	}

	function updateClusterManagers(at: InternalToken, projectID: string) {
		if (!at || !projectID) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustermanagersGet(parameters)
			.then((v: Kubernetes.ClusterManagers) => {
				if (v.length == 0) return;

				// TODO: a possible excuse for request query parameters?
				clustermanagers = v.filter((x) => x.metadata.projectId == projectID);
				clustermanagerID = clustermanagers[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));
	}

	$: updateClusterManagers(at, projectID);

	/* Clusters are scoped to control planes, so update this when the CP does */
	function updateClusters(at: InternalToken, clustermanager: string): void {
		if (!at || !clustermanager) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Kubernetes.KubernetesClusters) => {
				if (v.length == 0) return;

				clusters = v;
			})
			.catch((e: Error) => Clients.error(e));
	}

	$: updateClusters(at, clustermanagerID);

	/* Project must be set */
	$: step1Valid = projectID;

	/* Cluster name must be valid, and it must be unique */
	$: step2Valid =
		cluster &&
		Validation.kubernetesNameValid(cluster) &&
		Validation.unique(cluster, Validation.namedResourceNames(clusters));

	/* Once the region has been selected we can poll the images and other resources */
	function updateImages(at: InternalToken, regionID: string): void {
		if (!at || !regionID) return;

		const parameters = {
			regionID: regionID
		};

		Clients.region(toastStore, at)
			.apiV1RegionsRegionIDImagesGet(parameters)
			.then((v: Region.Images) => (images = v))
			.catch((e: Error) => Clients.error(e));
	}

	function updateFlavors(at: InternalToken, regionID: string): void {
		if (!at || !regionID) return;

		const parameters = {
			regionID: regionID
		};

		Clients.region(toastStore, at)
			.apiV1RegionsRegionIDFlavorsGet(parameters)
			.then((v: Region.Flavors) => (flavors = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: updateImages(at, regionID);
	$: updateFlavors(at, regionID);

	/* From the images, we can get a list of Kubernetes versions */
	function updateVersions(at: InternalToken, images: Region.Images): void {
		if (!at || !images) return;

		versions = [
			...new Set(
				(images || []).map((x) => {
					if (!x.spec.softwareVersions || !x.spec.softwareVersions.kubernetes) return '';
					return x.spec.softwareVersions.kubernetes;
				})
			)
		].reverse();

		version = versions[0];
	}

	$: updateVersions(at, images);

	/* Define a types we can manage, but also bind the configuration dialog to */
	type WorkloadPool = { model: Kubernetes.KubernetesClusterWorkloadPool; valid: boolean };
	type WorkloadPools = Array<WorkloadPool>;

	/* Workload pools you need at lea<st one */
	let workloadPools: WorkloadPools = [];
	addPool();

	function addPool(): void {
		let model: Kubernetes.KubernetesClusterWorkloadPool = {
			name: '',
			machine: {}
		};
		let valid: boolean = false;

		let pool: WorkloadPool = {
			model: model,
			valid: valid
		};

		workloadPools.push(pool);
		workloadPools = workloadPools;
	}

	function removePool(index: number): void {
		workloadPools.splice(index, 1);
		workloadPools = workloadPools;
	}

	import WorkloadPoolCreate from '$lib/WorkloadPoolCreate.svelte';

	/* There must be at least one workload pool, all of them must be valid and every pool must have a unique name */
	$: step3Valid =
		workloadPools.length > 0 &&
		workloadPools.every((x) => x.valid) &&
		[...new Set(workloadPools.map((x) => x.model.name))].length == workloadPools.length;

	function complete() {
		const spec: Kubernetes.KubernetesClusterSpec = {
			regionId: regionID,
			version: version,
			workloadPools: workloadPools.map((x) => x.model)
		};

		if (clustermanagerID) {
			spec.clusterManager = clustermanagerID;
		}

		const parameters = {
			organizationID: organizationID,
			projectID: projectID,
			kubernetesClusterWrite: {
				metadata: {
					name: cluster
				},
				spec: spec
			}
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersPost(parameters)
			.then(() => window.location.assign('/infrastructure/clusters'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<Stepper on:complete={complete}>
		<Step locked={!step1Valid}>
			<svelte:fragment slot="header">Let's Get Started!</svelte:fragment>

			<h4 class="h4">Region Selection</h4>
			<label for="region-name"> Select a region to provision in the cluster in. </label>
			<select id="region-name" class="select" bind:value={regionID}>
				{#each regions || [] as region}
					<option value={region.metadata.id}>{region.metadata.name}</option>
				{/each}
			</select>

			<h4 class="h4">Project Selection</h4>
			<label for="project-name"> Select a project to provision in the cluster in. </label>
			<select id="project-name" class="select" bind:value={projectID}>
				{#each projects || [] as project}
					<option value={project.metadata.id}>{project.metadata.name}</option>
				{/each}
			</select>

			<h4 class="h4">Life-Cycle Manager Selection</h4>
			<label for="clustermanager-name">
				Select a life cycle manager to manage the cluster life-cycle. If none is selected, a default
				will be created for you.
			</label>
			<select id="clustermanager-name" class="select" bind:value={clustermanagerID}>
				{#each clustermanagers || [] as clustermanager}
					<option value={clustermanager.metadata.id}>{clustermanager.metadata.name}</option>
				{/each}
			</select>
		</Step>

		<Step locked={!step2Valid}>
			<svelte:fragment slot="header">Basic Cluster Setup</svelte:fragment>

			<h4 class="h4">Cluster Name</h4>
			<label for="cluster-name">
				Choose a name for the cluster. The name must be unique within the project, contain no more
				than 63 characters, and contain only letters, numbers and hyphens.
			</label>
			<input type="text" class="input" required bind:value={cluster} />

			<h4 class="h4">Kubernetes Version</h4>
			<label for="kubernetes-version">
				Select a Kubernetes version to provision. Kubernetes provides guarantees backward
				compatibility so choosing the newest is usually the right choice as that provides a rich
				feature set and enhanced security. Certain applications &mdash; e.g. Kubeflow &mdash; may
				require a specific version.
			</label>
			<select id="kubernetes-version" class="select" value={version}>
				{#each versions || [] as version}
					<option value={version}>{version}</option>
				{/each}
			</select>
		</Step>
		<Step locked={!step3Valid}>
			<svelte:fragment slot="header">Worker Setup</svelte:fragment>

			<h4 class="h4">Workload Pools</h4>
			<p>
				Workload pools provide compute resouce for your cluster. You may have as many as required
				for your workload. Each pool has a set of CPU, GPU and memory that can be selected from a
				defined set of flavours. Workload pools support automatic scaling, thus reducing overall
				operational cost when not in use.
			</p>

			{#each workloadPools as pool, i}
				<article class="bg-surface-50-900-token rounded-lg p-8 flex flex-col gap-8">
					<WorkloadPoolCreate {flavors} bind:pool={pool.model} bind:valid={pool.valid} />

					<button
						class="btn flex variant-ghost-primary gap-2 items-center self-start"
						on:click={() => removePool(i)}
						on:keypress={() => removePool(i)}
					>
						<iconify-icon icon="mdi:minus" />
						<span>Remove Pool</span>
					</button>
				</article>
			{/each}

			<button
				class="btn variant-ghost-primary flex gap-2 items-center"
				on:click={addPool}
				on:keypress={addPool}
			>
				<iconify-icon icon="mdi:add" />
				<span>Add New Pool</span>
			</button>
		</Step>
		<Step>
			<svelte:fragment slot="header">Confirmation</svelte:fragment>

			<p>Insert a summary of what's about to be created...</p>
		</Step>
	</Stepper>
</ShellPage>
