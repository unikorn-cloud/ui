<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create Group',
		description: 'Create a new group in the organization.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { Stepper, Step } from '@skeletonlabs/skeleton';

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/identity/models';

	/* Input vaildation */
	import * as Validation from '$lib/validation';

	let at: string;

	let organization: string;

	let groups: Models.Groups;

	let group: string;

	let users: string[];

	let roles: string[];

	organizationStore.subscribe((value: string) => (organization = value));

	token.subscribe((token: string) => (at = token));

	function update(at: string, organization: string) {
		if (!at || !organization) return;

		const parameters = {
			organization: organization
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationGroupsGet(parameters)
			.then((v: Models.Groups) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organization);

	/* Cluster name must be valid, and it must be unique */
	$: step1Valid = Validation.unique(
		group,
		(groups || []).map((group) => group.name)
	);

	function complete() {
		const parameters = {
			organization: organization,
			group: {
				id: 'ignored',
				name: group,
				roles: roles,
				users: users
			}
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationGroupsPost(parameters)
			.then(() => window.location.assign('/identity/projects'))
			.catch((e: Error) => Clients.error(e));
	}

	import { InputChip } from '@skeletonlabs/skeleton';
</script>

<ShellPage {settings}>
	<Stepper on:complete={complete}>
		<Step locked={!step1Valid}>
			<svelte:fragment slot="header">Let's Get Started!</svelte:fragment>

			<h4 class="h4">Group Name</h4>
			<label for="cluster-name">
				Choose a name for the group. The name must be unique within the organization.
			</label>
			<input type="text" class="input" required bind:value={group} />

			<h4 class="h4">Add Roles</h4>
			<label for="roles"> Select the roles members of this group have.</label>
			<InputChip name="roles" bind:value={roles} whitelist={['admin', 'user', 'reader']} />

			<h4 class="h4">Add Users</h4>
			<label for="users"> Select users that are members of this group. </label>
			<InputChip name="users" bind:value={users} />
		</Step>
		<Step>
			<svelte:fragment slot="header">Confirmation</svelte:fragment>

			<p>Create group "{group}"?</p>
		</Step>
	</Stepper>
</ShellPage>
