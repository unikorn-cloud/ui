<script lang="ts">
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Region from '$lib/openapi/region';

	import { SlideToggle, RangeSlider } from '@skeletonlabs/skeleton';

	import * as Formatters from '$lib/formatters';
	import * as Validation from '$lib/validation';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

	/* The pool should be bound to expose the built configuration */
	export let pool: Kubernetes.KubernetesClusterWorkloadPool;

	/* Whether the configuration is valid */
	export let valid: boolean;

	/* Flavors allows the pool type to be populated */
	export let flavors: Array<Region.Flavor>;

	function updateFlavors(flavors: Array<Region.Flavor>): void {
		/* Bizarrely this triggers when the select is interacted with :shrug: */
		if (!flavors || pool.machine.flavorId) return;
		pool.machine.flavorId = flavors[0].metadata.id;
	}

	$: updateFlavors(flavors);

	/* Default to autoscaling with scale from zero */
	let autoscaling: boolean = Boolean(pool.autoscaling);

	function updateAutoscaling(enabled: boolean) {
		if (enabled && !pool.autoscaling) {
			pool.autoscaling = {
				minimumReplicas: 0
			};
		} else if (!enabled && pool.autoscaling) {
			delete pool.autoscaling;
		}
	}

	$: updateAutoscaling(autoscaling);

	let persistentStorage: boolean = Boolean(pool.machine.disk);

	function updateDisk(enabled: boolean) {
		if (enabled && !pool.machine.disk) {
			pool.machine.disk = {
				size: 50
			};
		} else if (!enabled && pool.machine.disk) {
			delete pool.machine.disk;
		}
	}

	$: updateDisk(persistentStorage);

	$: valid = Validation.kubernetesNameValid(pool.name);
</script>

<ShellSection title="Pool Metadata">
	<p>
		Select a name for your workload pool. The name must be unique within the cluster. Workload pool
		names can be used to schedule workloads within the Kubernetes cluster via Kubernetes node
		selectors.
	</p>
	<input type="text" class="input" bind:value={pool.name} />
</ShellSection>

<ShellSection title="Pool Topology">
	<p>
		The pool type allows the selection of the pool's available resources to be used by workloads per
		pool member. This includes CPU, GPU and memory.
	</p>
	<select class="select" bind:value={pool.machine.flavorId}>
		{#each flavors || [] as flavor}
			<option value={flavor.metadata.id}>{Formatters.flavorFormatter(flavor)}</option>
		{/each}
	</select>

	<p>
		Enable persistent volume based storage for the pool? If not selected, the disk size will be
		fixed to that offered by the pool type, and will be ephemeral with higher performance. If
		selected, the disk will be network attached with higher availabilty and the option to change the
		size.
	</p>
	<SlideToggle name="autoscaling" bind:checked={persistentStorage} />

	{#if pool.machine.disk}
		<p>Define the local storage required for a workload pool member.</p>
		<div class="flex gap-8">
			<RangeSlider
				class="grow"
				name="storage"
				min={50}
				max={4000}
				step={50}
				bind:value={pool.machine.disk.size}
			/>
			<span>{pool.machine.disk.size} GB</span>
		</div>
	{/if}

	<p>
		Automatic scaling enables the pool to grow, and shrink, depending on workload requirements. With
		automatic scaling you only pay for what you us, but there is an associated performance penalty
		when nodes are dynamically created and added to the cluster.
	</p>
	<SlideToggle name="autoscaling" bind:checked={autoscaling} />

	{#if pool.autoscaling}
		<p>
			Define the minimum pool replicas. When zero, the pool will not consume any resources when not
			in use. Otherwise, it will define a minimum number of members that must exist at any time,
			providing resource that can be used immediately without waiting for automatic scaling.
		</p>
		<div class="flex gap-8">
			<RangeSlider
				name="minsize"
				class="grow"
				min={0}
				max={100}
				step={1}
				bind:value={pool.autoscaling.minimumReplicas}
			/>
			<span>{pool.autoscaling.minimumReplicas}</span>
		</div>

		<p>Define the maximum pool replicas.</p>
		<div class="flex gap-8">
			<RangeSlider
				class="grow"
				name="maxsize"
				min={1}
				max={100}
				step={1}
				bind:value={pool.machine.replicas}
			/>
			<span>{pool.machine.replicas}</span>
		</div>
	{:else}
		<p>Define the pool replicas</p>
		<div class="flex gap-8">
			<RangeSlider
				class="grow"
				name="size"
				min={1}
				max={100}
				step={1}
				bind:value={pool.machine.replicas}
			/>
			<span>{pool.machine.replicas}</span>
		</div>
	{/if}
</ShellSection>
