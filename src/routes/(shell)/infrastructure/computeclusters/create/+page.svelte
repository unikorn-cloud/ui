<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Stepper from '$lib/layouts/Stepper.svelte';
	import ResourceList from '$lib/layouts/ResourceList.svelte';
	import ComputeWorkloadPool from '$lib/ComputeWorkloadPool.svelte';
	import ComputeWorkloadPoolSecurityRule from '$lib/ComputeWorkloadPoolSecurityRule.svelte';
	import Flavor from '$lib/Flavor.svelte';
	import Image from '$lib/Image.svelte';

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

	// When the region is updated, update the resource.
	$effect.pre(() => {
		if (regionID) resource.spec.regionId = regionID;
	});

	let clusters: Array<Compute.ComputeClusterRead> | undefined = $state();

	// Once a project ID is set we can poll the clusters.
	$effect.pre(() => {
		if (!projectID) return;

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
	});

	let names = $derived((clusters || []).map((x) => x.metadata.name));

	// Once a region is set we can poll images and flavors.
	let images: Array<Compute.Image> | undefined = $state();

	$effect.pre(() => {
		if (!regionID) return;

		const parameters = {
			organizationID: organizationInfo.id,
			regionID: regionID
		};

		Clients.compute(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet(parameters)
			.then((v: Array<Compute.Image>) => (images = v))
			.catch((e: Error) => Clients.error(e));
	});

	let flavors: Array<Compute.Flavor> | undefined = $state();

	$effect.pre(() => {
		if (!regionID) return;

		const parameters = {
			organizationID: organizationInfo.id,
			regionID: regionID
		};

		Clients.compute(toastStore, at)
			.apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet(parameters)
			.then((v: Array<Compute.Flavor>) => (flavors = v))
			.catch((e: Error) => Clients.error(e));
	});

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

	let firewallRuleValid: boolean = $state(false);

	let firewallRuleActive: boolean = $state(false);

	// Firewall rules are only active for one workload pool at a time.  The initial pool will
	// get and SSH ingress, as that's what 99% of people will want e.g. being able to actually
	// access their cluster.
	let firewallRules: Array<Compute.FirewallRule> = $state([]);

	function firewallRuleAdd() {
		firewallRules.push({
			direction: Compute.FirewallRuleDirectionEnum.Ingress,
			protocol: Compute.FirewallRuleProtocolEnum.Tcp,
			port: 0,
			prefixes: ['0.0.0.0/0']
		});

		return firewallRules.length - 1;
	}

	function firewallRuleRemove(index: number) {
		firewallRules.splice(index, 1);
	}

	let workloadPoolValid: boolean = $state(false);

	let workloadPoolActive: boolean = $state(false);

	function workloadPoolAdd(): number {
		let pool: Compute.ComputeClusterWorkloadPool = {
			name: '',
			machine: {
				replicas: 1,
				flavorId: '',
				image: null,
				publicIPAllocation: {
					enabled: false
				},
				firewall: []
			}
		};

		resource.spec.workloadPools.push(pool);

		return resource.spec.workloadPools.length - 1;
	}

	function workloadPoolRemove(index: number) {
		resource.spec.workloadPools.splice(index, 1);
	}

	// When editing a pool, make a local copy of the firewall rule.
	function workloadPoolActivate(index: number) {
		firewallRules = resource.spec.workloadPools[index].machine.firewall || [];
	}

	// When finishing editing a pool, copy the local version to the resource.
	function workloadPoolDeactivate(index: number) {
		resource.spec.workloadPools[index].machine.firewall = firewallRules;
	}

	// A workload pool is valid if all the fields in the pool are valid and
	// the name is unique among all other pools.
	let workloadPoolValidFull: boolean = $derived.by(() => {
		if (firewallRuleActive || !workloadPoolValid) return false;

		const names = resource.spec.workloadPools.map((x) => x.name);
		const uniqueNames = new Set(names);

		if (names.length != uniqueNames.size) return false;

		return true;
	});

	function lookupFlavor(flavorID: string): Compute.Flavor | undefined {
		if (!flavors) return;

		return flavors.find((x) => x.metadata.id == flavorID);
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
				<ResourceList
					title="Workload Pool Configuration"
					columns={4}
					items={resource.spec.workloadPools}
					initialItem={0}
					bind:active={workloadPoolActive}
					valid={workloadPoolValidFull}
					add={workloadPoolAdd}
					remove={workloadPoolRemove}
					activate={workloadPoolActivate}
					deactivate={workloadPoolDeactivate}
				>
					{#snippet description()}
						<p>
							Workload pools provide compute resouce for your cluster. You may have as many as
							required for your workload. Each pool has a set of CPU, GPU and memory that can be
							selected from a defined set of flavours.
						</p>
					{/snippet}

					<!-- eslint-disable @typescript-eslint/no-unused-vars -->
					{#snippet normal(pool: Compute.ComputeClusterWorkloadPool, index: number)}
						<div class="h5 font-bold">{pool.name}</div>

						<div>
							{pool.machine.replicas} replica{pool.machine.replicas > 1 ? 's' : ''}
						</div>

						<Flavor flavor={lookupFlavor(pool.machine.flavorId)} />

						<Image selector={pool.machine.image?.selector} />
					{/snippet}

					{#snippet expanded(pool: Compute.ComputeClusterWorkloadPool, index: number)}
						{#if images && flavors}
							<ComputeWorkloadPool
								{flavors}
								{images}
								bind:pool={resource.spec.workloadPools[index]}
								bind:valid={workloadPoolValid}
							>
								{#snippet firewall()}
									<ResourceList
										title="Firewall Rules"
										titleClass="h3"
										columns={4}
										items={firewallRules}
										bind:active={firewallRuleActive}
										valid={firewallRuleValid}
										add={firewallRuleAdd}
										remove={firewallRuleRemove}
									>
										{#snippet normal(rule: Compute.FirewallRule, index: number)}
											<div class="flex gap-2 items-center">
												<iconify-icon icon="tabler:arrows-down-up" class="text-2xl"></iconify-icon>
												{rule.direction}
											</div>
											<div class="flex gap-2 items-center">
												<iconify-icon icon="tabler:protocol" class="text-2xl"></iconify-icon>
												{rule.protocol}
											</div>
											<div class="flex gap-2 items-center">
												<iconify-icon icon="fluent:usb-port-24-regular" class="text-2xl"
												></iconify-icon>
												{rule.port.toString() + (rule.portMax ? '-' + rule.portMax.toString() : '')}
											</div>
											<div class="flex gap-2 items-center">
												<iconify-icon icon="mdi:check-network-outline" class="text-2xl"
												></iconify-icon>

												{rule.prefixes.join(', ')}
											</div>
										{/snippet}

										{#snippet expanded(rule: Compute.FirewallRule, index: number)}
											<div class="flex flex-col gap-4">
												<ComputeWorkloadPoolSecurityRule
													bind:rule={firewallRules[index]}
													bind:valid={firewallRuleValid}
												/>
											</div>
										{/snippet}
									</ResourceList>
								{/snippet}
							</ComputeWorkloadPool>
						{/if}
					{/snippet}
				</ResourceList>
			{/if}
		{/snippet}
	</Stepper>
</ShellPage>
