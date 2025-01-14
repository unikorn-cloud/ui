<script lang="ts">
	import { run } from 'svelte/legacy';

	import * as Compute from '$lib/openapi/compute';

	import * as Formatters from '$lib/formatters';
	import * as Validation from '$lib/validation';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import TextInput from '$lib/forms/TextInput.svelte';
	import SlideToggle from '$lib/forms/SlideToggle.svelte';
	import SelectNew from '$lib/forms/SelectNew.svelte';
	import RangeSlider from '$lib/forms/RangeSlider.svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import Select from '$lib/forms/Select.svelte';
	import Flavor from '$lib/Flavor.svelte';
	import Image from '$lib/Image.svelte';
	import ComputeWorkloadPoolSecurityRule from '$lib/ComputeWorkloadPoolSecurityRule.svelte';

	interface Props {
		/* The pool index allows us to fully qualify IDs so they are unique */
		index: number;
		/* The pool should be bound to expose the built configuration */
		pool: Compute.ComputeClusterWorkloadPool;
		/* Whether the configuration is valid */
		valid: boolean;
		/* Flavors allows the pool type to be populated */
		flavors: Array<Compute.Flavor>;
		/* Images allows the pool operating system image to be populated */
		images: Array<Compute.Image>;
	}

	let { index, pool = $bindable(), valid = $bindable(), flavors, images }: Props = $props();

	// Handle public IP addition or deletion for the pool.
	let publicIP: boolean = $derived(
		(pool.machine.publicIPAllocation && pool.machine.publicIPAllocation.enabled) || false
	);

	$effect.pre(() => {
		if (publicIP) {
			pool.machine.publicIPAllocation = {
				enabled: true
			};
		} else {
			delete pool.machine.publicIPAllocation;
		}
	});

	// Select a flavor for the workload pool if one is not already set or it no longer exists.
	$effect.pre(() => {
		if (flavors.find((x) => x.metadata.id == pool.machine.flavorId)) return;

		pool.machine.flavorId = flavors[0].metadata.id;
	});

	// If a flavorID is selected, by the workload pool, extract that flavor.
	let flavor = $derived(flavors.find((x) => x.metadata.id == pool.machine.flavorId));

	function osKey(distro: Compute.OsDistro, variant: string | undefined, version: string): string {
		if (!variant) return distro + ':' + version;

		return distro + ':' + variant + ':' + version;
	}

	function imageKey(image: Compute.Image): string {
		return osKey(image.spec.os.distro, image.spec.os.variant, image.spec.os.version);
	}

	function selectorKey(selector: Compute.ImageSelector): string {
		return osKey(selector.distro, selector.variant, selector.version);
	}

	// initialImage sets the image as either that defined by the pool
	// or an aribtrary one from the image list.
	function initialImage(): string {
		if (pool.machine.image?.selector) {
			return selectorKey(pool.machine.image.selector);
		}

		return selectorKey(images[0].spec.os);
	}

	let image = $state(initialImage());

	// Create a mapping of operating system distribution (optionally variant) and version.
	let osVersions: Record<string, Compute.Image> = $derived.by(() => {
		let result: Record<string, Compute.Image> = {};

		for (const image of images) {
			const key = imageKey(image);

			if (key in result) continue;

			result[key] = image;
		}

		// If the current image is invalid, select and a new arbirary one.
		if (!(image in result)) {
			image = Object.keys(result)[0];
		}

		return result;
	});

	// When the image changes, update the pool.
	$effect.pre(() => {
		if (!osVersions || !(image in osVersions)) return;

		const i = osVersions[image];

		pool.machine.image = {
			selector: {
				distro: i.spec.os.distro,
				variant: i.spec.os.variant,
				version: i.spec.os.version
			}
		};
	});

	// Update whether persistent storage is allowed once the flavor ID is determined.
	let persistentStorageAllowed = $derived(flavor && !flavor.spec.baremetal);

	// Update persistent storage if requested by the user.
	let persistentStorage: boolean = $state(Boolean(pool.machine.disk));

	$effect.pre(() => {
		// Volumes cannot be used on baremetal nodes */
		if (!persistentStorageAllowed) {
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

	// Pool is valid if the name is.
	$effect.pre(() => {
		valid = Validation.kubernetesNameValid(pool.name);
	});

	function newFirewallRule(): Compute.FirewallRule {
		return {
			direction: Compute.FirewallRuleDirectionEnum.Ingress,
			protocol: Compute.FirewallRuleProtocolEnum.Tcp,
			port: 0,
			prefixes: []
		};
	}

	let showRuleDefine: boolean = $state(false);

	let tempRule: Compute.FirewallRule = $state(newFirewallRule());

	let tempRuleValid: boolean = $state(false);

	function addFirewallRule() {
		tempRuleValid = false;
		tempRule = newFirewallRule();
		showRuleDefine = true;
	}

	function submitFirewallRule() {
		if (!showRuleDefine) return;

		if (!pool.machine.firewall) {
			pool.machine.firewall = [];
		}

		pool.machine.firewall.push(tempRule);
		pool.machine.firewall = pool.machine.firewall;

		showRuleDefine = false;
	}

	function deleteFirewallRule(index: number) {
		if (!pool.machine.firewall) return;

		pool.machine.firewall.splice(index, 1);
		pool.machine.firewall = pool.machine.firewall;
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
	{#if pool.machine.flavorId}
		<SelectNew
			id="flavor-{index}"
			label="Choose a pool type."
			hint="Allows the selection of the pool's available resources to be used by workloads per pool
			member. This includes CPU, GPU and memory."
		>
			{#snippet selected_body()}
				{#if flavor}
					<Flavor {flavor} />
				{/if}
			{/snippet}
			{#snippet children()}
				{#each flavors || [] as flavor}
					<ListBoxItem bind:group={pool.machine.flavorId} name="foo" value={flavor.metadata.id}>
						<Flavor {flavor} />
					</ListBoxItem>
				{/each}
			{/snippet}
		</SelectNew>

		{#if persistentStorageAllowed}
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

	{#if osVersions}
		<SelectNew
			id="image-{index}"
			label="Choose an image ."
			hint="Allows the selection of the pool's operating system image per pool."
		>
			{#snippet selected_body()}
				<Image image={osVersions[image]} />
			{/snippet}

			{#snippet children()}
				{#each Object.keys(osVersions) as value}
					<ListBoxItem bind:group={image} name="foo" {value}>
						<Image image={osVersions[value]} />
					</ListBoxItem>
				{/each}
			{/snippet}
		</SelectNew>
	{/if}

	<RangeSlider
		name="size"
		label="Select the minimum number of replicas."
		min={1}
		max={100}
		step={1}
		bind:value={pool.machine.replicas}
	/>

	<SlideToggle
		name="public_ip"
		label="Enable Public Access."
		hint="Selecting this option allocates a public IP address to each node in the pool."
		checked={publicIP}
	/>

	<ShellSection title="Firewall Rules">
		<div class="table-container">
			<table class="table">
				<thead>
					<tr>
						<th>Direction</th>
						<th>Protocol</th>
						<th>Port</th>
						<th>Prefixes</th>
						<th class="table-cell-fit"></th>
					</tr>
				</thead>
				<tbody>
					{#each pool.machine.firewall || [] as rule, i}
						<tr>
							<td>{rule.direction}</td>
							<td>{rule.protocol}</td>
							<td
								>{rule.port}{#if rule.portMax}-{rule.portMax}{/if}</td
							>
							<td>{rule.prefixes.join(', ')}</td>
							<td>
								<button
									class="text-2xl"
									onclick={() => deleteFirewallRule(i)}
									onkeypress={() => deleteFirewallRule(i)}
									aria-label="delete firewall rule"
								>
									<iconify-icon icon="mdi:trash-can-outline"></iconify-icon>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if showRuleDefine}
			<ComputeWorkloadPoolSecurityRule id="foo" rule={tempRule} bind:valid={tempRuleValid} />

			<button
				class="btn variant-filled-primary"
				disabled={!tempRuleValid}
				onclick={submitFirewallRule}
				onkeypress={submitFirewallRule}>Submit</button
			>
		{:else}
			<button
				class="btn flex gap-2 items-center w-full"
				onclick={addFirewallRule}
				onkeypress={addFirewallRule}
			>
				<iconify-icon icon="mdi:add"></iconify-icon>
				<span>Add New Rule</span>
			</button>
		{/if}
	</ShellSection>
</ShellSection>
