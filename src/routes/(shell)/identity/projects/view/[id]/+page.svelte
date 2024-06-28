<script lang="ts">
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'View/Update Project',
		description: 'Manage your project.'
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

	token.subscribe((token: InternalToken) => (at = token));

	let organizationID: string;

	organizationStore.subscribe((value: string) => (organizationID = value));

	let projects: Array<Identity.ProjectRead>;
	let project: Identity.ProjectRead;

	let groups: Array<Identity.GroupRead>;

	function update(at: InternalToken, organizationID: string) {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
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

	function updateProject(projects: Array<Identity.ProjectRead>) {
		if (!projects) return;

		const temp = projects.find((x) => x.metadata.id == $page.params.id);
		if (!temp) return;

		project = temp;
	}

	$: updateProject(projects);

	let names: Array<string>;

	$: names = (projects || [])
		.filter((x) => x.metadata.id != $page.params.id)
		.map((x) => x.metadata.name);

	let metadataValid = false;

	$: valid = metadataValid && project.spec.groupIDs && project.spec.groupIDs.length != 0;

	$: update(at, organizationID);

	function submit() {
		const parameters = {
			organizationID: organizationID,
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
			<label for="groups">
				Choose one or more groups of users that can access this project and all resources that it
				contains.
			</label>
			<select id="groups" class="select" multiple bind:value={project.spec.groupIDs}>
				{#each groups || [] as group}
					<option value={group.metadata.id}>{group.metadata.name}</option>
				{/each}
			</select>
		</ShellSection>

		<button
			class="btn variant-ghost-primary flex gap-2 items-center"
			disabled={!valid}
			on:click={submit}
			on:keypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
