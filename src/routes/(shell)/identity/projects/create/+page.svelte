<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
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
	$: step1Valid = metadataValid && resource.spec.groupIDs && resource.spec.groupIDs.length != 0;

	function complete() {
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
	<Stepper on:complete={complete}>
		<Step locked={!step1Valid}>
			<svelte:fragment slot="header">Let's Get Started!</svelte:fragment>

			<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

			<ShellSection title="Groups">
				<label for="groups">
					Choose one or more groups of users that can access this project and all resources that it
					contains.
				</label>
				<select id="groups" class="select" multiple bind:value={resource.spec.groupIDs}>
					{#each groups || [] as group}
						<option value={group.metadata.id}>{group.metadata.name}</option>
					{/each}
				</select>
			</ShellSection>
		</Step>
		<Step>
			<svelte:fragment slot="header">Confirmation</svelte:fragment>

			<p>Create project "{resource.metadata.name}"?</p>
		</Step>
	</Stepper>
</ShellPage>
