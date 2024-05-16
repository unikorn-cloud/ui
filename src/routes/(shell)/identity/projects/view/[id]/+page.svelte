<script lang="ts">
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';

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

	let organization: string;

	organizationStore.subscribe((value: string) => (organization = value));

	let project: Models.Project;

	let groups: Models.Groups;

	function update(at: InternalToken, organization: string) {
		if (!at || !organization) return;

		const parameters = {
			organization: organization,
			project: $page.params.id
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationProjectsProjectGet(parameters)
			.then((v: Models.Project) => (project = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationGroupsGet(parameters)
			.then((v: Models.Groups) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organization);

	function submit() {
		const parameters = {
			organization: organization,
			project: project.spec.name,
			projectSpec: project.spec
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationProjectsProjectPut(parameters)
			.then(() => window.location.assign('/identity/projects'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#if project}
		<h2 class="h2">{project.spec.name}</h2>

		<h4 class="h4">Groups</h4>
		<label for="groups">
			Choose one or more groups of users that can access this project and all resources that it
			contains.
		</label>
		<select id="groups" class="select" multiple bind:value={project.spec.groupIDs}>
			{#each groups || [] as group}
				<option value={group.id}>{group.name}</option>
			{/each}
		</select>

		<button
			class="btn variant-ghost-primary flex gap-2 items-center"
			on:click={submit}
			on:keypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
