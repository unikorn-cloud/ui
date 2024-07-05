<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Select from '$lib/forms/Select.svelte';

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

	let at: InternalToken;
	let organizationID: string;
	let projectID: string;
	let regionID: string;
	let regions: Array<Region.RegionRead>;
	let projects: Array<Identity.ProjectRead>;
	let clustermanagers: Array<Kubernetes.ClusterManagerRead>;
	let clusters: Array<Kubernetes.KubernetesClusterRead>;
	let images: Array<Region.Image>;
	let flavors: Array<Region.Flavor>;
	let versions: Array<string>;

	let resource: Kubernetes.KubernetesClusterWrite = {
		metadata: {
			name: ''
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
	};

	// Things to keep the API schema happy.
	$: if (!clustermanagers || clustermanagers.length == 0) delete resource.spec.clusterManagerId;

	let poolValid: Array<boolean> = [false];

	organizationStore.subscribe((value: string) => {
		organizationID = value;
		updateProjects();
	});

	token.subscribe((value: InternalToken) => {
		at = value;
		updateProjects();
	});

	function updateProjects() {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
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

	function updateRegions(at: InternalToken, organizationID: string, projectID: string) {
		if (!at || !organizationID || !projectID) return;

		const parameters = {
			organizationID: organizationID,
			projectID: projectID
		};

		/* Get top-level resources required for the first step */
		/* TODO: parallelize with Promise.all */
		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsGet(parameters)
			.then((v: Array<Region.RegionRead>) => {
				if (v.length == 0) return;

				regions = v;
				regionID = regions[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));
	}

	$: updateRegions(at, organizationID, projectID);

	function updateClusterManagers(at: InternalToken, projectID: string) {
		if (!at || !projectID) return;

		const parameters = {
			organizationID: organizationID
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

	$: updateClusterManagers(at, projectID);

	/* Clusters are scoped to control planes, so update this when the CP does */
	function updateClusters(at: InternalToken, projectID: string): void {
		if (!at || !projectID) return;

		const parameters = {
			organizationID: organizationID
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

	$: updateClusters(at, projectID);

	/* Project must be set */
	$: step1Valid = projectID;

	$: names = (clusters || []).map((x) => x.metadata.name);

	let metadataValid = false;

	/* Cluster name must be valid, and it must be unique */
	$: step2Valid = metadataValid;

	/* Once the region has been selected we can poll the images and other resources */
	function updateImages(
		at: InternalToken,
		organizationID: string,
		projectID: string,
		regionID: string
	): void {
		if (!at || !organizationID || !projectID || !regionID) return;

		const parameters = {
			organizationID: organizationID,
			projectID: projectID,
			regionID: regionID
		};

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGet(parameters)
			.then((v: Array<Region.Image>) => (images = v))
			.catch((e: Error) => Clients.error(e));
	}

	function updateFlavors(
		at: InternalToken,
		organizationID: string,
		projectID: string,
		regionID: string
	): void {
		if (!at || !organizationID || !projectID || !regionID) return;

		const parameters = {
			organizationID: organizationID,
			projectID: projectID,
			regionID: regionID
		};

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGet(parameters)
			.then((v: Array<Region.Flavor>) => (flavors = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: updateImages(at, organizationID, projectID, regionID);
	$: updateFlavors(at, organizationID, projectID, regionID);

	$: resource.spec.regionId = regionID;

	/* From the images, we can get a list of Kubernetes versions */
	function updateVersions(at: InternalToken, images: Array<Region.Image>): void {
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

	$: updateVersions(at, images);

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

	import WorkloadPoolCreate from '$lib/WorkloadPoolCreate.svelte';

	/* There must be at least one workload pool, all of them must be valid and every pool must have a unique name */
	$: step3Valid =
		resource.spec.workloadPools.length > 0 &&
		poolValid.every((x) => x) &&
		[...new Set(resource.spec.workloadPools.map((x) => x.name))].length ==
			resource.spec.workloadPools.length;

	function complete() {
		const parameters = {
			organizationID: organizationID,
			projectID: projectID,
			kubernetesClusterWrite: resource
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

			<ShellSection title="Environment Configuration">
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
					bind:value={resource.spec.regionId}
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
		</Step>

		<Step locked={!step2Valid}>
			<svelte:fragment slot="header">Basic Cluster Setup</svelte:fragment>

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
		</Step>
		<Step locked={!step3Valid}>
			<svelte:fragment slot="header">Worker Setup</svelte:fragment>

			<p>
				Workload pools provide compute resouce for your cluster. You may have as many as required
				for your workload. Each pool has a set of CPU, GPU and memory that can be selected from a
				defined set of flavours. Workload pools support automatic scaling, thus reducing overall
				operational cost when not in use.
			</p>

			{#each resource.spec.workloadPools as pool, i}
				<ShellSection title="Workload Pool {i + 1}">
					<button
						class="text-2xl"
						on:click={() => removePool(i)}
						on:keypress={() => removePool(i)}
						slot="tools"
					>
						<iconify-icon icon="mdi:trash-can-outline" />
					</button>

					<WorkloadPoolCreate {flavors} bind:pool bind:valid={poolValid[i]} />
				</ShellSection>
			{/each}

			<button
				class="btn variant-filled-tertiary flex gap-2 items-center w-full"
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
