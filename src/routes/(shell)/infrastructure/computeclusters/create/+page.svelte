<script lang="ts">
	import { run } from 'svelte/legacy';

	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Stepper from '$lib/layouts/Stepper.svelte';
	import ComputeWorkloadPool from '$lib/ComputeWorkloadPool.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Create Compute Cluster',
		description: 'Create and deploy a new compute cluster.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Compute from '$lib/openapi/compute';
	import * as Identity from '$lib/openapi/identity';
	import * as Region from '$lib/openapi/region';
	import * as Stores from '$lib/stores';

	// Define the new resource defaults.
	let resource: Compute.ComputeClusterWrite = $state({
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
						replicas: 1,
						flavorId: '',
						image: null,
						publicIPAllocation: {
							enabled: true
						},
						firewall: [
							{
								direction: Compute.FirewallRuleDirectionEnum.Ingress,
								protocol: Compute.FirewallRuleProtocolEnum.Tcp,
								port: 22,
								prefixes: ['0.0.0.0/0']
							}
						]
					}
				}
			]
		}
	});

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

	// Grab the root resources from the API.
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

	let regions: Array<Region.RegionRead> | undefined = $state();
	let regionID: string | undefined = $state();

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

	run(() => {
		if (regionID) resource.spec.regionId = regionID;
	});

	let clusters: Array<Compute.ComputeClusterRead> | undefined = $state();

	// Once a project ID is set we can poll the clusters.
	function updateClusters(at: InternalToken, projectID: string | undefined): void {
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

	run(() => {
		updateClusters(at, projectID);
	});

	let names = $derived((clusters || []).map((x) => x.metadata.name));

	// Once a region is set we can poll images and flavors.
	let images: Array<Compute.Image> | undefined = $state();

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

		Clients.compute(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet(parameters)
			.then((v: Array<Compute.Image>) => (images = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateImages(at, organizationInfo, regionID);
	});

	let flavors: Array<Compute.Flavor> | undefined = $state();

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

		Clients.compute(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet(parameters)
			.then((v: Array<Compute.Flavor>) => (flavors = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateFlavors(at, organizationInfo, regionID);
	});

	let poolValid: Array<boolean> = $state([false]);

	function addPool(): void {
		let pool: Compute.ComputeClusterWorkloadPool = {
			name: '',
			machine: {
				replicas: 3,
				flavorId: '',
				image: null,
				publicIPAllocation: {
					enabled: true
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

	function complete() {
		if (!projectID) return;

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
	<Stepper steps={3} bind:step {complete} {valid}>
		{#snippet content(index: number)}
			{#if index === 0}
				<h2 class="h2">Basic Configuration</h2>

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
			{:else if index === 1}
				<h2 class="h2">Platform Configuration</h2>

				<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />
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

						{#if flavors && images}
							<ComputeWorkloadPool
								{index}
								{flavors}
								{images}
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
