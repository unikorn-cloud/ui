<script lang="ts">
	/* Page setup */
	import { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create Project',
		description: 'Create a new project.'
	};

	import { Stepper, Step } from '@skeletonlabs/skeleton';

	/* Client setup */
	import { client, error } from '$lib/client.ts';
	import { token } from '$lib/credentials.js';
	import * as Models from '$lib/openapi/server/models';
	import * as Api from '$lib/openapi/server/apis';

	/* Input vaildation */
	import * as Validation from '$lib/validation.ts';

	let at: string;

	let project: string;
	let projects: Models.Projects;

	token.subscribe(async (token: string) => {
		/* Setup the token on load */
		if (!token) return;
		at = token;

		/* Get top-level resources required for the first step */
		client(at)
			.apiV1ProjectsGet()
			.then((v) => (projects = v))
			.catch((e: Error) => error(e));
	});

	/* Cluster name must be valid, and it must be unique */
	$: step1Valid =
		Validation.kubernetesNameValid(project) &&
		Validation.unique(project, Validation.namedResourceNames(projects));

	function complete() {
		const parameters: Api.ApiV1ProjectsPostRequest = {
			project: {
				name: project
			}
		};

		client(at)
			.apiV1ProjectsPost(parameters)
			.then(() => (window.location = '/identity/projects'))
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
