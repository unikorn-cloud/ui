<script lang="ts">
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
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
	import * as Models from '$lib/openapi/identity/models';

	let at: InternalToken;

	token.subscribe((token: InternalToken) => (at = token));

	let organizationID: string;

	organizationStore.subscribe((value: string) => (organizationID = value));

	let project: Models.ProjectRead;

	let groups: Models.Groups;

	function update(at: InternalToken, organizationID: string) {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID,
			projectID: $page.params.id
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDGet(parameters)
			.then((v: Models.ProjectRead) => (project = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(parameters)
			.then((v: Models.Groups) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organizationID);

	function submit() {
		const parameters = {
			organizationID: organizationID,
			projectID: $page.params.id,
			projectWrite: project
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDPut(parameters)
			.then(() => window.location.assign('/identity/projects'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#if project}
		<h2 class="h2">{project.metadata.name}</h2>

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
			on:click={submit}
			on:keypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
