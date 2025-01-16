<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Button from '$lib/forms/Button.svelte';
	import ButtonIcon from '$lib/forms/ButtonIcon.svelte';
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

	let poolValid: boolean = $state(false);

	function addPool(): void {
		let pool: Compute.ComputeClusterWorkloadPool = {
			name: '',
			machine: {
				replicas: 3,
				flavorId: '',
				image: null,
				publicIPAllocation: {
					enabled: true
				},
				firewall: []
			}
		};

		resource.spec.workloadPools.push(pool);
	}

	function removePool(index: number): void {
		resource.spec.workloadPools.splice(index, 1);
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

		if (workloadPoolActive >= 0) return false;

		if (resource.spec.workloadPools.length == 0) return false;
		if (!poolValid) return false;

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

	let firewallRuleActive = $state(-1);

	// Firewall rules are only active for one workload pool at a time.  The initial pool will
	// get and SSH ingress, as that's what 99% of people will want e.g. being able to actually
	// access their cluster.
	let firewallRules: Array<Compute.FirewallRule> = $state([
		{
			direction: Compute.FirewallRuleDirectionEnum.Ingress,
			protocol: Compute.FirewallRuleProtocolEnum.Tcp,
			port: 22,
			prefixes: ['0.0.0.0/0']
		}
	]);

	function firewallRuleActivate(index: number) {
		firewallRuleActive = index;
	}

	function firewallRuleDeactivate() {
		firewallRuleActive = -1;
	}

	function firewallRuleAdd() {
		firewallRules.push({
			direction: Compute.FirewallRuleDirectionEnum.Ingress,
			protocol: Compute.FirewallRuleProtocolEnum.Tcp,
			port: 0,
			prefixes: ['0.0.0.0/0']
		});

		workloadPoolActivate(firewallRules.length - 1);
	}

	function firewallRuleRemove(index: number) {
		firewallRuleDeactivate();
		firewallRules.splice(index, 1);
	}

	let firewallRuleValid = $state(false);

	// Workload pools.
	let workloadPoolActive = $state(0);

	function workloadPoolAdd() {
		addPool();
		workloadPoolActivate(resource.spec.workloadPools.length - 1);
	}

	function workloadPoolRemove(index: number) {
		workloadPoolDeactivate(index);
		removePool(index);
	}

	// When editing a pool, make a local copy of the firewall rule.
	function workloadPoolActivate(index: number) {
		firewallRules = resource.spec.workloadPools[index].machine.firewall || [];
		workloadPoolActive = index;
	}

	// When finishing editing a pool, copy the local version to the resource.
	function workloadPoolDeactivate(index: number) {
		resource.spec.workloadPools[index].machine.firewall = firewallRules;
		workloadPoolActive = -1;
	}

	// A workload pool is valid if all the fields in the pool are valid and
	// the name is unique among all other pools.
	function workloadPoolValid(): boolean {
		if (!poolValid) return false;

		const names = resource.spec.workloadPools.map((x) => x.name);
		const uniqueNames = new Set(names);

		if (names.length != uniqueNames.size) return false;

		return true;
	}

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
				<div class="flex justify-between items-center">
					<h2 class="h2">Workload Pools</h2>
					<Button
						icon="mdi:add"
						label="Add"
						clicked={workloadPoolAdd}
						disabled={workloadPoolActive >= 0}
					/>
				</div>

				<p>
					Workload pools provide compute resouce for your cluster. You may have as many as required
					for your workload. Each pool has a set of CPU, GPU and memory that can be selected from a
					defined set of flavours.
				</p>

				<ResourceList columns={5} items={resource.spec.workloadPools} active={workloadPoolActive}>
					<!-- eslint-disable @typescript-eslint/no-unused-vars -->
					{#snippet normal(pool: Compute.ComputeClusterWorkloadPool, index: number)}
						<div class="h5 font-bold">{pool.name}</div>

						<div>
							{pool.machine.replicas} replica{pool.machine.replicas > 1 ? 's' : ''}
						</div>

						<Flavor flavor={lookupFlavor(pool.machine.flavorId)} />

						<Image selector={pool.machine.image?.selector} />

						<div class="text-2xl flex gap-2 text-primary-600-300-token justify-self-end">
							<ButtonIcon
								icon="mdi:edit-outline"
								clicked={() => workloadPoolActivate(index)}
								disabled={workloadPoolActive >= 0}
							/>
							<ButtonIcon
								icon="mdi:trash-can-outline"
								clicked={() => workloadPoolRemove(index)}
								disabled={workloadPoolActive >= 0}
							/>
						</div>
					{/snippet}

					{#snippet expanded(pool: Compute.ComputeClusterWorkloadPool, index: number)}
						<div class="flex flex-col gap-4">
							{#if images && flavors}
								<ComputeWorkloadPool
									{flavors}
									{images}
									bind:pool={resource.spec.workloadPools[index]}
									bind:valid={poolValid}
								>
									{#snippet firewall()}
										<div class="flex flex-col gap-2">
											<div class="flex justify-between items-center">
												<h3 class="h3">Firewall Rules</h3>
												<Button
													icon="mdi:add"
													label="Add"
													clicked={firewallRuleAdd}
													disabled={firewallRuleActive > 0}
												/>
											</div>

											<ResourceList columns={5} items={firewallRules} active={firewallRuleActive}>
												{#snippet normal(rule: Compute.FirewallRule, index: number)}
													<div class="flex gap-2">
														<div class="font-bold">Direction</div>
														{rule.direction}
													</div>
													<div class="flex gap-2">
														<div class="font-bold">Protocol</div>
														{rule.protocol}
													</div>
													<div class="flex gap-2">
														<div class="font-bold">Port</div>
														{rule.port}
													</div>
													<div class="flex gap-2">
														<div class="font-bold">Prefixes</div>

														{rule.prefixes.join(', ')}
													</div>
													<div
														class="text-2xl flex gap-2 text-primary-600-300-token justify-self-end"
													>
														<ButtonIcon
															icon="mdi:edit-outline"
															clicked={() => firewallRuleActivate(index)}
															disabled={firewallRuleActive >= 0}
														/>
														<ButtonIcon
															icon="mdi:trash-can-outline"
															clicked={() => firewallRuleRemove(index)}
															disabled={firewallRuleActive >= 0}
														/>
													</div>
												{/snippet}

												{#snippet expanded(rule: Compute.FirewallRule, index: number)}
													<div class="flex flex-col gap-4">
														<ComputeWorkloadPoolSecurityRule
															bind:rule={firewallRules[index]}
															bind:valid={firewallRuleValid}
														/>

														<div class="flex justify-between">
															<Button
																icon="mdi-trash-can-outline"
																label="Delete Rule"
																class="variant-outline-error"
																clicked={() => firewallRuleRemove(index)}
															/>
															<Button
																icon="mdi:check"
																label="Update Rule"
																class="variant-filled-primary"
																clicked={firewallRuleDeactivate}
																disabled={!firewallRuleValid}
															/>
														</div>
													</div>
												{/snippet}
											</ResourceList>
										</div>
									{/snippet}
								</ComputeWorkloadPool>
							{/if}

							<div class="flex justify-between">
								<Button
									icon="mdi-trash-can-outline"
									label="Delete Pool"
									class="variant-outline-error"
									clicked={() => workloadPoolRemove(index)}
								/>
								<Button
									icon="mdi:check"
									label="Update Pool"
									class="variant-filled-primary"
									clicked={() => workloadPoolDeactivate(index)}
									disabled={firewallRuleActive >= 0 || !workloadPoolValid()}
								/>
							</div>
						</div>
					{/snippet}
				</ResourceList>
			{/if}
		{/snippet}
	</Stepper>
</ShellPage>
