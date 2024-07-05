<script lang="ts">
	import * as Validation from '$lib/validation';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import TextInput from '$lib/forms/TextInput.svelte';

	// Metadata object to bind to.
	export let metadata: Kubernetes.ResourceMetadata;

	// A list of names that already exist in this context for validation,
	// so ensure you prune out the current one when using in an update
	// dialog.
	export let names: Array<string>;

	// Whether the input is valid.
	export let valid = false;
</script>

<ShellSection title="Resource Metadata">
	<TextInput
		id="name"
		bind:value={metadata.name}
		label="Resource name."
		hint="Name should be unique, contain 0-9, a-z, . or - and be at most 63 characters."
		validators={Validation.GetKubernetesNameValidators(names)}
		bind:valid
	/>
	<TextInput
		id="description"
		bind:value={metadata.description}
		label="Resource decription."
		hint="This is optional but may add more verbose information about the resource."
	/>
</ShellSection>
