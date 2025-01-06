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

	let publicIP: boolean = $state(false);

	function updatePublicIP(publicIP: boolean) {
		if (publicIP) {
			pool.machine.publicIPAllocation = {
				enabled: true
			};
		} else {
			delete pool.machine.publicIPAllocation;
		}
	}

	run(() => {
		updatePublicIP(publicIP);
	});

	let osVersions: Record<string, Array<string>> = $state({});

	function updateFlavors(flavors: Array<Compute.Flavor>): void {
		if (!flavors || flavors.find((x) => x.metadata.id == pool.machine.flavorId)) return;
		pool.machine.flavorId = flavors[0].metadata.id;
	}

	run(() => {
		updateFlavors(flavors);
	});

	function osKey(distro: Compute.OsDistro, variant: string | undefined): string {
		let key = distro;

		if (variant) {
			key = key + ':' + variant;
		}

		return key;
	}

	function imageKey(image: Compute.Image): string {
		return osKey(image.spec.os.distro, image.spec.os.variant);
	}

	function updateImages(images: Array<Compute.Image>): void {
		for (const image of images) {
			const key = imageKey(image);

			if (!osVersions[key]) {
				osVersions[key] = [];
			}

			if (!osVersions[key].find((x) => x == image.spec.os.version)) {
				osVersions[key].push(image.spec.os.version);
			}
		}

		const key = osKey(pool.machine.image.distro, pool.machine.image.variant);

		if (
			!images ||
			(osVersions[key] && osVersions[key].find((x) => x == pool.machine.image.version))
		)
			return;

		pool.machine.image = {
			distro: images[0].spec.os.distro,
			variant: images[0].spec.os.variant,
			version: images[0].spec.os.version
		};
	}

	run(() => {
		updateImages(images);
	});

	let persistentStorage: boolean = $state(Boolean(pool.machine.disk));

	function updateDisk(
		enabled: boolean,
		flavors: Array<Compute.Flavor>,
		flavorID: string | undefined
	) {
		if (!flavors || !flavorID) return;

		/* Volumes cannot be used on baremetal nodes */
		const allowed = !lookupFlavor(flavors, flavorID).spec.baremetal;
		if (!allowed) {
			if (pool.machine.disk) {
				delete pool.machine.disk;
			}

			return;
		}

		if (enabled && !pool.machine.disk) {
			pool.machine.disk = {
				size: 50
			};
		} else if (!enabled && pool.machine.disk) {
			delete pool.machine.disk;
		}
	}

	run(() => {
		updateDisk(persistentStorage, flavors, pool.machine.flavorId);
	});

	run(() => {
		valid = Validation.kubernetesNameValid(pool.name);
	});

	function lookupFlavor(flavors: Array<Compute.Flavor>, flavorID: string): Compute.Flavor {
		const flavor = flavors.find((x) => x.metadata.id == flavorID);
		if (!flavor) {
			return {
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
		}

		return flavor;
	}

	function lookupImage(
		images: Array<Compute.Image>,
		distro: Compute.OsDistro,
		variant: string | undefined,
		version: string | undefined
	): Compute.Image {
		const key = osKey(distro, variant);

		const image = images.find((x) => imageKey(x) == key && x.spec.os.version == version);
		if (!image) {
			return {
				metadata: {
					id: 'undefined',
					name: 'undefined',
					creationTime: new Date()
				},
				spec: {
					virtualization: 'any',
					sizeGiB: 0,
					os: {
						kernel: Compute.OsKernel.Linux,
						family: Compute.OsFamily.Debian,
						distro: Compute.OsDistro.Ubuntu,
						version: 'undefined'
					}
				}
			};
		}

		return image;
	}

	function lookupImageFromKey(
		images: Array<Compute.Image>,
		key: string,
		version: string
	): Compute.Image {
		const parts = key.split(':');
		const distro = parts[0] as Compute.OsDistro;
		const variant = parts[1];

		return lookupImage(images, distro, variant, version);
	}

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
	{#if flavors && pool.machine.flavorId}
		<SelectNew
			id="flavor-{index}"
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

	{#if osVersions && pool.machine.image}
		<SelectNew
			id="image-{index}"
			label="Choose an image ."
			hint="Allows the selection of the pool's operating system image per pool."
		>
			{#snippet selected_body()}
				<Image
					image={lookupImage(
						images,
						pool.machine.image.distro,
						pool.machine.image.variant,
						pool.machine.image.version
					)}
				/>
			{/snippet}

			{#snippet children()}
				{#each Object.keys(osVersions) as os}
					{#each osVersions[os] as version}
						<ListBoxItem
							bind:group={pool.machine.image}
							name="foo"
							,
							value={{ os: os, version: version }}
						>
							<Image image={lookupImageFromKey(images, os, version)} />
						</ListBoxItem>
					{/each}
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
		bind:checked={publicIP}
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
