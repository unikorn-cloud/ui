<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create Project',
		description: 'Create a new project.'
	};

	let names: Array<string> = $derived(data.projects.map((x) => x.metadata.name));

	let resource: Identity.ProjectWrite = $state({
		metadata: {
			name: ''
		},
		spec: {
			groupIDs: []
		}
	});

	let metadataValid = $state(false);

	/* Cluster name must be valid, and it must be unique */
	let valid = $derived(
		metadataValid && resource.spec.groupIDs && resource.spec.groupIDs.length != 0
	);

	function submit() {
		const parameters = {
			organizationID: data.organizationID,
			projectWrite: resource
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDProjectsPost(parameters)
			.then(() => window.location.assign('/identity/projects'))
			.catch((e: Error) => Clients.error(toastStore, e));
	}

	let groups = $derived(
		data.groups.map(
			(x) => ({ label: x.metadata.name, value: x.metadata.id }) as AutocompleteOption<string>
		)
	);
</script>

<ShellPage {settings}>
	<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

	<ShellSection title="Groups">
		<MultiSelect
			id="group-ids"
			label="Select group access."
			hint="Groups associate users with projects and grant them permissions to create, view, edit and delete."
			options={groups}
			value={resource.spec.groupIDs}
			add={(value: string) => resource.spec.groupIDs.push(value)}
			remove={(index: number) => resource.spec.groupIDs.splice(index, 1)}
		>
			{#snippet selected(value: string)}
				{data.groups.find((x) => x.metadata.id == value)?.metadata.name}
			{/snippet}
		</MultiSelect>
	</ShellSection>

	<div class="flex justify-between">
		<Button
			icon="mdi:cancel-bold"
			label="Cancel"
			class="variant-outline-primary"
			href="/identity/projects"
		/>
		<Button
			icon="mdi:tick"
			label="Create"
			class="variant-filled-primary"
			clicked={submit}
			disabled={!valid}
		/>
	</div>
</ShellPage>
