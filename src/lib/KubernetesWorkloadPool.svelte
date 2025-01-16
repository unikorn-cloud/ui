<script lang="ts">
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Region from '$lib/openapi/region';

	import * as Formatters from '$lib/formatters';
	import * as Validation from '$lib/validation';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import TextInput from '$lib/forms/TextInput.svelte';
	import SlideToggle from '$lib/forms/SlideToggle.svelte';
	import Select from '$lib/forms/Select.svelte';
	import RangeSlider from '$lib/forms/RangeSlider.svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import SelectNew from '$lib/forms/SelectNew.svelte';
	import Flavor from '$lib/Flavor.svelte';

	interface Props {
		/* The pool should be bound to expose the built configuration */
		pool: Kubernetes.KubernetesClusterWorkloadPool;
		/* Whether the configuration is valid */
		valid: boolean;
		/* Flavors allows the pool type to be populated */
		flavors: Array<Region.Flavor>;
	}

	let { pool = $bindable(), valid = $bindable(), flavors }: Props = $props();

	function updateFlavors(flavors: Array<Region.Flavor>): void {
		if (!flavors || flavors.find((x) => x.metadata.id == pool.machine.flavorId)) return;
		pool.machine.flavorId = flavors[0].metadata.id;
	}

	$effect.pre(() => {
		updateFlavors(flavors);
	});

	/* Default to autoscaling with scale from zero */
	let autoscaling: boolean = $state(Boolean(pool.autoscaling));

	function updateAutoscaling(enabled: boolean) {
		if (enabled && !pool.autoscaling) {
			pool.autoscaling = {
				minimumReplicas: 0
			};
		} else if (!enabled && pool.autoscaling) {
			delete pool.autoscaling;
		}
	}

	$effect.pre(() => {
		updateAutoscaling(autoscaling);
	});

	let persistentStorage: boolean = $state(Boolean(pool.machine.disk));

	$effect.pre(() => {
		if (!flavors || !pool.machine.flavorId) return;

		/* Volumes cannot be used on baremetal nodes */
		const allowed = !lookupFlavor(flavors, pool.machine.flavorId).spec.baremetal;
		if (!allowed) {
			if (pool.machine.disk) {
				delete pool.machine.disk;
			}

			return;
		}

		if (persistentStorage && !pool.machine.disk) {
			pool.machine.disk = {
				size: 50
			};
		} else if (!persistentStorage && pool.machine.disk) {
			delete pool.machine.disk;
		}
	});

	$effect.pre(() => {
		valid = Validation.kubernetesNameValid(pool.name);
	});

	function lookupFlavor(
		flavors: Array<Region.Flavor> | undefined,
		flavorID: string | undefined
	): Region.Flavor {
		const defaultFlavor = {
			metadata: {
				id: 'undefined',
				name: 'undefined',
				creationTime: new Date()
			},
			spec: {
				cpus: 0,
				memory: 0,
				disk: 0
			}
		};

		if (!flavors || !flavorID) return defaultFlavor;

		const flavor = flavors.find((x) => x.metadata.id == flavorID);
		if (!flavor) return defaultFlavor;

		return flavor;
	}
</script>

<ShellSection title="Pool Metadata">
	<TextInput
		id="pool-name"
		label="Choose a name for your workload pool."
		hint="Name should be unique, contain 0-9, a-z, . or - and be at most 63 characters."
		validators={Validation.GetKubernetesNameValidators([])}
		bind:value={pool.name}
		bind:valid
	/>
</ShellSection>

<ShellSection title="Pool Topology">
	{#if flavors && pool.machine.flavorId}
		<SelectNew
			id="flavor"
			label="Choose a pool type."
			hint="Allows the selection of the pool's available resources to be used by workloads per pool
			member. This includes CPU, GPU and memory."
		>
			{#snippet selected_body()}
				<Flavor flavor={lookupFlavor(flavors, pool.machine.flavorId)} />
			{/snippet}
			{#snippet children()}
				{#each flavors || [] as flavor}
					<ListBoxItem bind:group={pool.machine.flavorId} name="foo" value={flavor.metadata.id}>
						<Flavor {flavor} />
					</ListBoxItem>
				{/each}
			{/snippet}
		</SelectNew>

		{#if !lookupFlavor(flavors, pool.machine.flavorId).spec.baremetal}
			<SlideToggle
				name="persistent-storage"
				label="Enable persistent storage."
				hint="If not selected, the disk size will be
                fixed to that offered by the pool type, and will be ephemeral with higher performance. If
                selected, the disk will be network attached with higher availabilty and the option to change the
                size."
				bind:checked={persistentStorage}
			/>

			{#if pool.machine.disk}
				<RangeSlider
					name="storage-size"
					label="Select the disk size per machine."
					min={50}
					max={4000}
					step={50}
					formatter={Formatters.formatGB}
					bind:value={pool.machine.disk.size}
				/>
			{/if}
		{/if}
	{/if}

	<SlideToggle
		name="autoscaling"
		label="Enable autoscaling."
		hint="This scaling enables the pool to grow, and shrink, depending on workload requirements. With
                automatic scaling you only pay for what you us, but there is an associated performance penalty
                when nodes are dynamically created and added to the cluster."
		bind:checked={autoscaling}
	/>

	{#if pool.autoscaling}
		<RangeSlider
			name="min-size"
			label="Select the minimum number of replicas."
			hint="When zero, the pool will not consume any resources when not in use. Otherwise, it will define a minimum number of members that must exist at any time,
                        providing resource that can be used immediately without waiting for automatic scaling."
			min={0}
			max={100}
			step={1}
			bind:value={pool.autoscaling.minimumReplicas}
		/>

		<RangeSlider
			name="max-size"
			label="Select the maximum number of replicas."
			min={1}
			max={100}
			step={1}
			bind:value={pool.machine.replicas}
		/>
	{:else}
		<RangeSlider
			name="size"
			label="Select the minimum number of replicas."
			min={1}
			max={100}
			step={1}
			bind:value={pool.machine.replicas}
		/>
	{/if}
</ShellSection>
