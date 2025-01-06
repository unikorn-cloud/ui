<script lang="ts">
	import { run } from 'svelte/legacy';

	import * as Compute from '$lib/openapi/compute';
	import Select from '$lib/forms/Select.svelte';
	import TextInput from '$lib/forms/TextInput.svelte';
	import InputChips from '$lib/forms/InputChips.svelte';
	import * as Validators from '$lib/validation';

	interface Props {
		// id uniqueuly identifies the workload pool and rule.
		id: string;
		// rule is the object we are filling in.
		rule: Compute.FirewallRule;
		// valid if the all field validators resolve to true.
		valid?: boolean;
	}

	let { id, rule = $bindable(), valid = $bindable(false) }: Props = $props();

	let port: string = $state('');
	let portValid: boolean = $state(false);

	let portMax: string = $state('');
	let portMaxValid: boolean = $state(false);

	run(() => {
		valid = portValid && portMaxValid && rule.prefixes.length > 0;
	});

	function updatePorts(port: string, portMax: string) {
		const x = parseInt(port, 10);

		if (!isNaN(x)) {
			rule.port = x;
		}

		if (!portMax) {
			delete rule.portMax;

			return;
		}

		const y = parseInt(portMax, 10);

		if (!isNaN(y)) {
			rule.portMax = y;
		}
	}

	run(() => {
		updatePorts(port, portMax);
	});
</script>

<Select
	id="direction-{id}"
	label="Network Direction"
	hint="Ingress allows traffic to the host, egress traffic from the host."
	bind:value={rule.direction}
>
	{#each Object.values(Compute.FirewallRuleDirectionEnum) as direction}
		<option value={direction}>{direction}</option>
	{/each}
</Select>

<Select
	id="protocol-{id}"
	label="Network Protocol"
	hint="OSI layer 4 transport protocol"
	bind:value={rule.protocol}
>
	{#each Object.values(Compute.FirewallRuleProtocolEnum) as protocol}
		<option value={protocol}>{protocol}</option>
	{/each}
</Select>

<TextInput
	id="port-{id}"
	label="Port"
	hint="Port number, or start of range of ports (specified as 100-200 inclusive), to allow access to."
	bind:value={port}
	bind:valid={portValid}
	validators={[Validators.stringInt]}
/>

<TextInput
	id="portmax-{id}"
	label="Port Range End"
	hint="If specified this is the end of the port range, including this port number."
	bind:value={portMax}
	bind:valid={portMaxValid}
	validators={[Validators.stringIntOrUndefined]}
/>

<InputChips
	name="ingress-cidr-{id}"
	label="Address Ranges"
	hint="Address ranges to allow access to the selected port.  0.0.0.0/0 allows traffic from any host."
	bind:value={rule.prefixes}
/>
