<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as RegionUtil from '$lib/regionutil';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import Select from '$lib/forms/Select.svelte';
	import Stepper from '$lib/layouts/Stepper.svelte';
	import ResourceList from '$lib/layouts/ResourceList.svelte';
	import KubernetesWorkloadPool from '$lib/KubernetesWorkloadPool.svelte';
	import Flavor from '$lib/Flavor.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'View/update Kubernetes Cluster',
		description: 'Update an existing Kubernetes cluster.'
	};

	// TODO: move into +page.ts
	let cluster = $derived.by(() => {
		let cluster = $state(data.cluster);
		return cluster;
	});

	// TODO: move into +page.ts
	let clusters = $derived(
		data.clusters.filter((x) => x.metadata.projectId == data.cluster.metadata.projectId)
	);

	// TODO: move into +page.ts
	let names: Array<string> = $derived(
		(clusters || []).filter((x) => x.metadata.id != page.params.id).map((x) => x.metadata.name)
	);

	// TODO: move into +page.ts
	const versions = [
		...new Set(data.images.map((x) => x.spec.softwareVersions?.kubernetes || ''))
	].reverse();

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

		cluster.spec.workloadPools.push(pool);

		return cluster.spec.workloadPools.length - 1;
	}

	function workloadPoolRemove(index: number) {
		cluster.spec.workloadPools.splice(index, 1);
	}

	// A workload pool is valid if all the fields in the pool are valid and
	// the name is unique among all other pools.
	let workloadPoolValidFull: boolean = $derived.by(() => {
		if (!workloadPoolValid) return false;

		const names = cluster.spec.workloadPools.map((x) => x.name);
		const uniqueNames = new Set(names);

		if (names.length != uniqueNames.size) return false;

		return true;
	});

	let step: number = $state(0);

	// Step 1 requires the metadata to be valid and a version to have been selected.
	let metadataValid = $state(false);

	let step1valid: boolean = $derived.by(() => {
		if (step != 0) return true;

		if (!metadataValid) return false;

		return true;
	});

	// Step 2 requires a workload pool to be defined, every workload pool to be valid
	// and all workload pool names to be unique.
	let step2valid: boolean = $derived.by(() => {
		if (step != 1) return true;

		if (cluster.spec.workloadPools.length == 0) return false;

		const names = cluster.spec.workloadPools.map((x) => x.name);
		const uniqueNames = new Set(names);

		if (names.length != uniqueNames.size) return false;

		return true;
	});

	// Roll up the overall validity for the stepper to allow progress.
	let valid = $derived(step1valid && step2valid);

	function lookupFlavor(flavorID: string | undefined): Kubernetes.Flavor | undefined {
		return data.flavors.find((x) => x.metadata.id == flavorID);
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

	function complete() {
		const parameters = {
			organizationID: data.organizationID,
			projectID: cluster.metadata.projectId,
			clusterID: cluster.metadata.id,
			kubernetesClusterWrite: cluster
		};

		Clients.kubernetes(data.token)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPut(parameters)
			.then(() => window.location.assign('/kubernetes/clusters'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<ShellViewHeader metadata={cluster.metadata}>
		{#snippet badges()}
			<Badge icon={RegionUtil.icon(data.regions, cluster.spec.regionId)}>
				{RegionUtil.name(data.regions, cluster.spec.regionId)}
			</Badge>
		{/snippet}
	</ShellViewHeader>

	<Stepper steps={2} bind:step {valid} {complete}>
		{#snippet content(index: number)}
			{#if index === 0}
				<h2 class="h2">Basic Cluster Setup</h2>

				<ShellMetadataSection metadata={cluster.metadata} {names} bind:valid={metadataValid} />

				<ShellSection title="Platform Configuration">
					<Select
						id="kubernetes-version"
						label="Choose a Kubernetes version."
						hint="Kubernetes provides guarantees backward
                                                compatibility so choosing the newest is usually the right choice as that provides a rich
                                                feature set and enhanced security. Certain applications — e.g. Kubeflow —
						may require a specific version."
						bind:value={cluster.spec.version}
					>
						{#each versions as version}
							<option value={version}>{version}</option>
						{/each}
					</Select>
				</ShellSection>
			{:else if step === 1}
				<ResourceList
					title="Workload Pool Configuration"
					columns={3}
					items={cluster.spec.workloadPools}
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
						<KubernetesWorkloadPool
							flavors={data.flavors}
							bind:pool={cluster.spec.workloadPools[index]}
							bind:valid={workloadPoolValid}
						/>
					{/snippet}
				</ResourceList>
			{/if}
		{/snippet}
	</Stepper>
</ShellPage>
