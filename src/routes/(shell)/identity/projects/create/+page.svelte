<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create Project',
		description: 'Create a new project.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { Stepper, Step } from '@skeletonlabs/skeleton';

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';

	/* Input vaildation */
	import * as Validation from '$lib/validation';

	let at: InternalToken;

	let project: string;
	let projects: Identity.Projects;

	let organizationID: string;

	let groups: Identity.Groups;
	let groupIDs: string[] = [];

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
			.then((v: Identity.Projects) => (projects = v))
			.catch((e: Error) => Clients.error(e));

		const groupsParameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(groupsParameters)
			.then((v: Identity.Groups) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	/* Cluster name must be valid, and it must be unique */
	$: step1Valid =
		Validation.kubernetesNameValid(project) &&
		Validation.unique(project, Validation.namedResourceNames(projects));

	function complete() {
		const parameters = {
			organizationID: organizationID,
			projectWrite: {
				metadata: {
					name: project
				},
				spec: {
					groupIDs: groupIDs
				}
			}
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsPost(parameters)
			.then(() => window.location.assign('/identity/projects'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<Stepper on:complete={complete}>
		<Step locked={!step1Valid}>
			<svelte:fragment slot="header">Let's Get Started!</svelte:fragment>

			<ShellSection title="Project Name">
				<label for="cluster-name">
					Choose a name for the project. The name must be unique within the organiation, contain no
					more than 63 characters, and contain only letters, numbers and hyphens.
				</label>
				<input type="text" class="input" required bind:value={project} />
			</ShellSection>

			<ShellSection title="Groups">
				<label for="groups">
					Choose one or more groups of users that can access this project and all resources that it
					contains.
				</label>
				<select id="groups" class="select" multiple bind:value={groupIDs}>
					{#each groups || [] as group}
						<option value={group.metadata.id}>{group.metadata.name}</option>
					{/each}
				</select>
			</ShellSection>
		</Step>
		<Step>
			<svelte:fragment slot="header">Confirmation</svelte:fragment>

			<p>Create project "{project}"?</p>
		</Step>
	</Stepper>
</ShellPage>
