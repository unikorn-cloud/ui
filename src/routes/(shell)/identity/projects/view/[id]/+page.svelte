<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	import * as Clients from '$lib/clients';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'View/Update Project',
		description: 'Manage your project.'
	};

	let project = $derived.by(() => {
		let project = $state(data.project);
		return project;
	});

	$effect.pre(() => {
		if (!project.spec.groupIDs) project.spec.groupIDs = [];
	});

	let names: Array<string> = $derived(
		data.projects.filter((x) => x.metadata.id != $page.params.id).map((x) => x.metadata.name)
	);

	let metadataValid = $state(false);

	let valid = $derived(
		metadataValid && project?.spec.groupIDs && project?.spec.groupIDs.length != 0
	);

	function submit() {
		const parameters = {
			organizationID: data.organizationID,
			projectID: $page.params.id,
			projectWrite: project
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDPut(parameters)
			.then(() => window.location.assign('/identity/projects'))
			.catch((e: Error) => Clients.error(toastStore, e));
	}
</script>

<ShellPage {settings}>
	<ShellViewHeader metadata={project.metadata} />
	<ShellMetadataSection metadata={project.metadata} {names} bind:valid={metadataValid} />

	<ShellSection title="Groups">
		{#if project.spec.groupIDs}
			<MultiSelect
				id="group-ids"
				label="Select group access."
				hint="Groups associate users with projects and grant them permissions to create, view, edit and delete."
				bind:value={project.spec.groupIDs}
			>
				{#each data.groups as group}
					<option value={group.metadata.id}>{group.metadata.name}</option>
				{/each}
			</MultiSelect>
		{/if}
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
			label="Update"
			class="variant-filled-primary"
			clicked={submit}
			disabled={!valid}
		/>
	</div>
</ShellPage>
