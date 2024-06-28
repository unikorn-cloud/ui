<script lang="ts">
	import * as Validation from '$lib/validation';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

	// Metadata object to bind to.
	export let metadata: Kubernetes.ResourceMetadata;

	// A list of names that already exist in this context for validation,
	// so ensure you prune out the current one when using in an update
	// dialog.
	export let names: Array<string>;

	// Whether the input is valid.
	export let valid = false;

	$: valid =
		Validation.kubernetesNameValid(metadata.name) && Validation.unique(metadata.name, names);
</script>

<ShellSection title="Resource Metadata">
	<label for="name"
		>Display name. The name must be unique, contain no more than 63 characters, and contain only
		letters, numbers and hyphens.</label
	>
	<input id="name" class="input" type="text" bind:value={metadata.name} />

	<label for="name">Optional description.</label>
	<input id="description" class="input" type="text" bind:value={metadata.description} />
</ShellSection>
