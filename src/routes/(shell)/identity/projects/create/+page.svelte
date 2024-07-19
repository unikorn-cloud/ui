<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create Project',
		description: 'Create a new project.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';

	let at: InternalToken;
	let organizationID: string;
	let projects: Array<Identity.ProjectRead>;
	let groups: Array<Identity.GroupRead>;

	let resource: Identity.ProjectWrite = {
		metadata: {
			name: ''
		},
		spec: {
			groupIDs: []
		}
	};

	organizationStore.subscribe((value: string) => (organizationID = value));

	token.subscribe((token: InternalToken) => {
		at = token;
		updateProjects();
	});

	function updateProjects() {
		/* Setup the token on load */
		if (!token || !organizationID) return;

		/* Get top-level resources required for the first step */
		const parameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsGet(parameters)
			.then((v: Array<Identity.ProjectRead>) => (projects = v))
			.catch((e: Error) => Clients.error(e));

		const groupsParameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(groupsParameters)
			.then((v: Array<Identity.GroupRead>) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	let names: Array<string>;

	$: names = (projects || []).map((x) => x.metadata.name);

	let metadataValid = false;

	/* Cluster name must be valid, and it must be unique */
	$: valid = metadataValid && resource.spec.groupIDs && resource.spec.groupIDs.length != 0;

	function submit() {
		const parameters = {
			organizationID: organizationID,
			projectWrite: resource
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsPost(parameters)
			.then(() => window.location.assign('/identity/projects'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

	<ShellSection title="Groups">
		{#if groups && resource.spec.groupIDs}
			<MultiSelect
				id="group-ids"
				label="Select group access."
				hint="Groups associate users with projects and grant them permissions to create, view, edit and delete."
				bind:value={resource.spec.groupIDs}
			>
				{#each groups || [] as group}
					<option value={group.metadata.id}>{group.metadata.name}</option>
				{/each}
			</MultiSelect>
		{/if}
	</ShellSection>

	<button
		class="btn variant-filled-primary flex gap-2 items-center"
		disabled={!valid}
		on:click={submit}
		on:keypress={submit}
	>
		Create
	</button>
</ShellPage>
