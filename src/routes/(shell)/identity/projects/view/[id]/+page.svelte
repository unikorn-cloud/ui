<script lang="ts">
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';

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

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as Stores from '$lib/stores';

	// Grab the organization scope.
	let organizationInfo = $state() as Stores.OrganizationInfo;

	Stores.organizationStore.subscribe((value: Stores.OrganizationInfo) => {
		organizationInfo = value;
	});

	// Grab the acces token.
	let at = $state() as InternalToken;

	token.subscribe((token: InternalToken): void => {
		at = token;
	});

	let projects: Array<Identity.ProjectRead> | undefined = $state();
	let groups: Array<Identity.GroupRead> | undefined = $state();

	function update(at: InternalToken, organizationInfo: Stores.OrganizationInfo) {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsGet(parameters)
			.then((v: Array<Identity.ProjectRead>) => (projects = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(parameters)
			.then((v: Array<Identity.GroupRead>) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	let project: Identity.ProjectRead | undefined = $state();

	function updateProject(projects: Array<Identity.ProjectRead> | undefined) {
		if (!projects) return;

		const temp = projects.find((x) => x.metadata.id == $page.params.id);
		if (!temp) return;

		if (!temp.spec.groupIDs) temp.spec.groupIDs = [];

		project = temp;
	}

	run(() => {
		updateProject(projects);
	});

	let names: Array<string> = $derived(
		(projects || []).filter((x) => x.metadata.id != $page.params.id).map((x) => x.metadata.name)
	);

	let metadataValid = $state(false);

	let valid = $derived(
		metadataValid && project?.spec.groupIDs && project?.spec.groupIDs.length != 0
	);

	run(() => {
		update(at, organizationInfo);
	});

	function submit() {
		if (!project) return;

		const parameters = {
			organizationID: organizationInfo.id,
			projectID: $page.params.id,
			projectWrite: project
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDPut(parameters)
			.then(() => window.location.assign('/identity/projects'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#if project}
		<ShellViewHeader metadata={project.metadata} />
		<ShellMetadataSection metadata={project.metadata} {names} bind:valid={metadataValid} />

		<ShellSection title="Groups">
			{#if groups && project.spec.groupIDs}
				<MultiSelect
					id="group-ids"
					label="Select group access."
					hint="Groups associate users with projects and grant them permissions to create, view, edit and delete."
					bind:value={project.spec.groupIDs}
				>
					{#each groups || [] as group}
						<option value={group.metadata.id}>{group.metadata.name}</option>
					{/each}
				</MultiSelect>
			{/if}
		</ShellSection>

		<div class="flex">
			<Button
				icon="mdi:tick"
				label="Update"
				class="btn variant-filled-primary"
				clicked={submit}
				disabled={!valid}
			/>
		</div>
	{/if}
</ShellPage>
