<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Select from '$lib/forms/Select.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Create Compute Cluster',
		description: 'Create and deploy a new compute cluster.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { Stepper, Step } from '@skeletonlabs/skeleton';

	import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Compute from '$lib/openapi/compute';
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';
	import * as Stores from '$lib/stores';

	let at: InternalToken;
	let organizationInfo: Stores.OrganizationInfo;
	let projectID: string;
	let regionID: string;
	let regions: Array<Region.RegionRead>;
	let projects: Array<Identity.ProjectRead>;
	let clusters: Array<Compute.ComputeClusterRead>;
	let images: Array<Compute.Image>;
	let flavors: Array<Compute.Flavor>;

	let resource: Compute.ComputeClusterWrite = {
		metadata: {
			name: uniqueNamesGenerator({
				dictionaries: [adjectives, animals],
				separator: '-',
				length: 2
			})
		},
		spec: {
			regionId: '',
			workloadPools: [
				{
					name: 'default',
					machine: {
						replicas: 3,
						flavorId: '',
						image: {
							distro: Compute.OsDistro.Ubuntu,
							version: '24.04'
						},
						publicIPAllocation: {
							enabled: false
						}
					}
				}
			]
		}
	};

	let poolValid: Array<boolean> = [false];

	Stores.organizationStore.subscribe((value: Stores.OrganizationInfo) => {
		organizationInfo = value;
		updateProjects();
	});

	token.subscribe((value: InternalToken) => {
		at = value;
		updateProjects();
	});

	function updateProjects() {
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

	$: updateRegions(at, organizationInfo);

	$: resource.spec.regionId = regionID;

	/* Clusters are scoped to control planes, so update this when the CP does */
	function updateClusters(at: InternalToken, projectID: string): void {
		if (!at || !projectID) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.compute(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Array<Compute.ComputeClusterRead>) => {
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
		organizationInfo: Stores.OrganizationInfo,
		regionID: string
	): void {
		if (!at || !organizationInfo || !regionID) return;

		const parameters = {
			organizationID: organizationInfo.id,
			regionID: regionID
		};

		Clients.compute(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet(parameters)
			.then((v: Array<Compute.Image>) => (images = v))
			.catch((e: Error) => Clients.error(e));
	}

	function updateFlavors(
		at: InternalToken,
		organizationInfo: Stores.OrganizationInfo,
		regionID: string
	): void {
		if (!at || !organizationInfo || !regionID) return;

		const parameters = {
			organizationID: organizationInfo.id,
			regionID: regionID
		};

		Clients.compute(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet(parameters)
			.then((v: Array<Compute.Flavor>) => (flavors = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: updateImages(at, organizationInfo, regionID);
	$: updateFlavors(at, organizationInfo, regionID);

	$: resource.spec.regionId = regionID;

	function addPool(): void {
		let pool: Compute.ComputeClusterWorkloadPool = {
			name: '',
			machine: {
				replicas: 3,
				flavorId: '',
				image: {
					distro: Compute.OsDistro.Ubuntu,
					version: '24.04'
				},
				publicIPAllocation: {
					enabled: false
				}
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

	import ComputeWorkloadPool from '$lib/ComputeWorkloadPool.svelte';

	/* There must be at least one workload pool, all of them must be valid and every pool must have a unique name */
	$: step3Valid =
		resource.spec.workloadPools.length > 0 &&
		poolValid.every((x) => x) &&
		[...new Set(resource.spec.workloadPools.map((x) => x.name))].length ==
			resource.spec.workloadPools.length;

	function complete() {
		const parameters = {
			organizationID: organizationInfo.id,
			projectID: projectID,
			computeClusterWrite: resource
		};

		Clients.compute(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersPost(parameters)
			.then(() => window.location.assign('/infrastructure/computeclusters'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<Stepper on:complete={complete} buttonNext="variant-filled-primary">
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
					bind:value={regionID}
				>
					{#each regions || [] as region}
						<option value={region.metadata.id}>{region.metadata.name}</option>
					{/each}
				</Select>
			</ShellSection>
		</Step>

		<Step locked={!step2Valid}>
			<svelte:fragment slot="header">Basic Cluster Setup</svelte:fragment>

			<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />
		</Step>
		<Step locked={!step3Valid}>
			<svelte:fragment slot="header">Worker Setup</svelte:fragment>

			<p>
				Workload pools provide compute resouce for your cluster. You may have as many as required
				for your workload. Each pool has a set of CPU, GPU and memory that can be selected from a
				defined set of flavours. Workload pools support automatic scaling, thus reducing overall
				operational cost when not in use.
			</p>

			{#each resource.spec.workloadPools as pool, index}
				<ShellSection title="Workload Pool {index + 1}">
					<button
						class="text-2xl"
						on:click={() => removePool(index)}
						on:keypress={() => removePool(index)}
						slot="tools"
					>
						<iconify-icon icon="mdi:trash-can-outline" />
					</button>

					<ComputeWorkloadPool {index} {flavors} {images} bind:pool bind:valid={poolValid[index]} />
				</ShellSection>
			{/each}

			<button class="btn flex gap-2 items-center w-full" on:click={addPool} on:keypress={addPool}>
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
