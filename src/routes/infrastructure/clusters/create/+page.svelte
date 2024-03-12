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

	/* Client setup */
	import { client, error } from '$lib/client.ts';
	import { token } from '$lib/credentials.js';
	import * as Models from '$lib/openapi/server/models';
	import * as Api from '$lib/openapi/server/apis';

	/* Input vaildation */
	import * as Validation from '$lib/validation.ts';

	let at: string;

	/* Variables that trigger reactive actions */
	let region: string;
	let regions: Models.Regions;

	let project: string;
	let projects: Models.Projects;

	let clustermanager: string = 'default';
	let clustermanagers: Models.ClusterManagers;

	let cluster: string;
	let clusters: Api.KubernetesClusters;

	let images: Models.OpenstackImages;
	let flavors: Models.OpenstackFlavors;

	let version: string;
	let versions: Array<string>;

	token.subscribe((token: string): void => {
		/* Setup the token on load */
		if (!token) return;
		at = token;

		/* Get top-level resources required for the first step */
		/* TODO: parallelize with Promise.all */
		client(toastStore, at)
			.apiV1RegionsGet()
			.then((v) => {
				if (v.length == 0) return;

				regions = v;
				region = regions[0].name;
			})
			.catch((e: Error) => error(e));

		client(toastStore, at)
			.apiV1ProjectsGet()
			.then((v) => {
				if (v.length == 0) return;

				projects = v;
				project = projects[0].name;
			})
			.catch((e: Error) => error(e));
	});

	function updateClusterManagers(at: string, project: string) {
		if (!at || !project) return;

		client(toastStore, at)
			.apiV1ClustermanagersGet()
			.then((v) => {
				if (v.length == 0) return;

				// TODO: a possible excuse for request query parameters?
				clustermanagers = v.filter((x) => x.metadata.project == project);
				clustermanager = clustermanagers[0].name;
			})
			.catch((e: Error) => error(e));
	}

	$: updateClusterManagers(at, project);

	/* Clusters are scoped to control planes, so update this when the CP does */
	function updateClusters(at: string, clustermanager: string): void {
		if (!at || !clustermanager) return;

		client(toastStore, at)
			.apiV1ClustersGet()
			.then((v) => {
				if (v.length == 0) return;

				clusters = v;
			})
			.catch((e: Error) => error(e));
	}

	$: updateClusters(at, clustermanager);

	/* Project must be set */
	$: step1Valid = project;

	/* Cluster name must be valid, and it must be unique */
	$: step2Valid =
		cluster &&
		Validation.kubernetesNameValid(cluster) &&
		Validation.unique(cluster, Validation.namedResourceNames(clusters));

	/* Once the region has been selected we can poll the images and other resources */
	function updateImages(at: string, region: string): void {
		if (!at || !region) return;

		const parameters: Api.ApiV1RegionsRegionNameImagesGetRequest = {
			regionName: region
		};

		client(toastStore, at)
			.apiV1RegionsRegionNameImagesGet(parameters)
			.then((v) => (images = v))
			.catch((e: Error) => error(e));
	}

	function updateFlavors(at: string, region: string): void {
		if (!at || !region) return;

		const parameters: Api.ApiV1RegionsRegionNameFlavorsGetRequest = {
			regionName: region
		};

		client(toastStore, at)
			.apiV1RegionsRegionNameFlavorsGet(parameters)
			.then((v) => (flavors = v))
			.catch((e: Error) => error(e));
	}

	$: updateImages(at, region);
	$: updateFlavors(at, region);

	/* From the images, we can get a list of Kubernetes versions */
	function updateVersions(at: string, images: Models.OpenstackImages): void {
		if (!at || !images) return;

		versions = [
			...new Set(
				(images || []).map((x) => {
					return x.versions.kubernetes;
				})
			)
		].reverse();

		version = versions[0];
	}

	$: updateVersions(at, images);

	/* Define a types we can manage, but also bind the configuration dialog to */
	type WorkloadPool = { model: Models.KubernetesClusterWorkloadPools; valid: boolean };
	type WorkloadPools = Array<WorkloadPool>;

	/* Workload pools you need at lea<st one */
	let workloadPools: WorkloadPools = [];
	addPool();

	function addPool(): void {
		let model: Models.KubernetesClusterWorkloadPools = {};
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
		const parameters: Api.ApiV1ProjectsProjectNameClustersPostRequest = {
			projectName: project,
			kubernetesCluster: {
				name: cluster,
				region: region,
				clusterManager: clustermanager,
				version: version,
				workloadPools: workloadPools.map((x) => x.model)
			}
		};

		client(toastStore, at)
			.apiV1ProjectsProjectNameClustersPost(parameters)
			.then(() => (window.location = '/infrastructure/clusters'))
			.catch((e: Error) => error(e));
	}
</script>

<ShellPage {settings}>
	<Stepper on:complete={complete}>
		<Step locked={!step1Valid}>
			<svelte:fragment slot="header">Let's Get Started!</svelte:fragment>

			<h4 class="h4">Region Selection</h4>
			<label for="region-name"> Select a region to provision in the cluster in. </label>
			<select id="region-name" class="select" bind:value={region}>
				{#each regions || [] as region}
					<option value={region.name}>{region.name}</option>
				{/each}
			</select>

			<h4 class="h4">Project Selection</h4>
			<label for="project-name"> Select a project to provision in the cluster in. </label>
			<select id="project-name" class="select" bind:value={project}>
				{#each projects || [] as project}
					<option value={project.name}>{project.name}</option>
				{/each}
			</select>

			<h4 class="h4">Life-Cycle Manager Selection</h4>
			<label for="clustermanager-name">
				Select a life cycle manager to manage the cluster life-cycle. If none is selected, a default
				will be created for you.
			</label>
			<select id="clustermanager-name" class="select" bind:value={clustermanager}>
				{#each clustermanagers || [] as clustermanager}
					<option value={clustermanager.name}>{clustermanager.name}</option>
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
