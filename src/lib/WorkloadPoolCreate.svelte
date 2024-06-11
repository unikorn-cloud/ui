<script lang="ts">
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Region from '$lib/openapi/region';

	import { SlideToggle, RangeSlider } from '@skeletonlabs/skeleton';

	import * as Formatters from '$lib/formatters';
	import * as Validation from '$lib/validation';

	/* The pool should be bound to expose the built configuration */
	export let pool: Kubernetes.KubernetesClusterWorkloadPool;

	/* Whether the configuration is valid */
	export let valid: boolean;

	/* Flavors allows the pool type to be populated */
	export let flavors: Region.Flavors;

	let flavorID: string;

	function updateFlavors(flavors: Region.Flavors): void {
		/* Bizarrely this triggers when the select is interacted with :shrug: */
		if (!flavors || flavorID) return;
		flavorID = flavors[0].metadata.id;
	}

	$: updateFlavors(flavors);

	/* Default to 50GB per node */
	let storage: number = 50;

	/* Default to autoscaling with scale from zero */
	let autoscaling: boolean = true;
	let replicasMin: number = 0;
	let replicasMax: number = 3;

	$: valid = Validation.kubernetesNameValid(pool.name);

	/* Update the model as we update the inputs */
	$: pool.machine.flavorId = flavorID;

	$: {
		if (pool.machine.disk) {
			pool.machine.disk.size = storage;
		} else {
			pool.machine.disk = { size: storage };
		}
	}

	$: pool.machine.replicas = replicasMax;

	$: pool.autoscaling = autoscaling ? { minimumReplicas: replicasMin } : undefined;
</script>

<h4 class="h4">Pool Name</h4>
<p>
	Select a name for your workload pool. The name must be unique within the cluster. Workload pool
	names can be used to schedule workloads within the Kubernetes cluster via Kubernetes node
	selectors.
</p>
<input type="text" class="input" bind:value={pool.name} />

<h4 class="h4">Pool Type</h4>
<p>
	The pool type allows the selection of the pool's available resources to be used by workloads per
	pool member. This includes CPU, GPU and memory.
</p>
<select class="select" bind:value={flavorID}>
	{#each flavors || [] as flavor}
		<option value={flavor.metadata.id}>{Formatters.flavorFormatter(flavor)}</option>
	{/each}
</select>

<h4 class="h4">Pool Storage</h4>
<p>Define the local storage required for a workload pool member.</p>
<div class="flex gap-8">
	<RangeSlider class="grow" name="storage" min={50} max={4000} step={50} bind:value={storage} />
	<span>{storage} GB</span>
</div>

<h4 class="h4">Pool Automatic Scaling</h4>
<p>
	Automatic scaling enables the pool to grow, and shrink, depending on workload requirements. With
	automatic scaling you only pay for what you us, but there is an associated performance penalty
	when nodes are dynamically created and added to the cluster.
</p>
<SlideToggle name="autoscaling" bind:checked={autoscaling} />

{#if autoscaling}
	<h6 class="h6">Minimum Pool Size</h6>
	<p>
		Define the minimum pool replicas. When zero, the pool will not consume any resources when not in
		use. Otherwise, it will define a minimum number of members that must exist at any time,
		providing resource that can be used immediately without waiting for automatic scaling.
	</p>
	<div class="flex gap-8">
		<RangeSlider name="minsize" class="grow" min={0} max={100} step={1} bind:value={replicasMin} />
		<span>{replicasMin}</span>
	</div>

	<h6 class="h6">Maximum Pool Size</h6>
	<p>Define the maximum pool replicas.</p>
	<div class="flex gap-8">
		<RangeSlider class="grow" name="maxsize" min={1} max={100} step={1} bind:value={replicasMax} />
		<span>{replicasMax}</span>
	</div>
{:else}
	<h6 class="h6">Pool Size</h6>
	<p>Define the pool replicas</p>
	<div class="flex gap-8">
		<RangeSlider class="grow" name="size" min={1} max={100} step={1} bind:value={replicasMax} />
		<span>{replicasMax}</span>
	</div>
{/if}
