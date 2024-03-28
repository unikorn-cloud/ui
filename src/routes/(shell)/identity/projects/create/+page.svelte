<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

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
	import { client, error } from '$lib/clients';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/server/models';

	/* Input vaildation */
	import * as Validation from '$lib/validation';

	let at: string;

	let project: string;
	let projects: Models.Projects;

	let organization: string;

	organizationStore.subscribe((value: string) => (organization = value));

	token.subscribe((token: string) => {
		at = token;
		updateProjects();
	});

	function updateProjects() {
		/* Setup the token on load */
		if (!token || !organization) return;

		/* Get top-level resources required for the first step */
		const parameters = {
			organizationName: organization
		};

		client(toastStore, at)
			.apiV1OrganizationsOrganizationNameProjectsGet(parameters)
			.then((v: Models.Projects) => (projects = v))
			.catch((e: Error) => error(e));
	}

	/* Cluster name must be valid, and it must be unique */
	$: step1Valid =
		Validation.kubernetesNameValid(project) &&
		Validation.unique(project, Validation.namedResourceNames(projects));

	function complete() {
		const parameters = {
			organizationName: organization,
			projectSpec: {
				name: project
			}
		};

		client(toastStore, at)
			.apiV1OrganizationsOrganizationNameProjectsPost(parameters)
			.then(() => window.location.assign('/identity/projects'))
			.catch((e: Error) => error(e));
	}
</script>

<ShellPage {settings}>
	<Stepper on:complete={complete}>
		<Step locked={!step1Valid}>
			<svelte:fragment slot="header">Let's Get Started!</svelte:fragment>

			<h4 class="h4">Project Name</h4>
			<label for="cluster-name">
				Choose a name for the project. The name must be unique within the organiation, contain no
				more than 63 characters, and contain only letters, numbers and hyphens.
			</label>
			<input type="text" class="input" required bind:value={project} />
		</Step>
		<Step>
			<svelte:fragment slot="header">Confirmation</svelte:fragment>

			<p>Create project "{project}"?</p>
		</Step>
	</Stepper>
</ShellPage>
