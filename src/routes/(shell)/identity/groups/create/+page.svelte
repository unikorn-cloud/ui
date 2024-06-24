<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

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
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';

	/* Input vaildation */
	import * as Validation from '$lib/validation';

	let at: InternalToken;

	let organizationID: string;

	let groups: Array<Identity.GroupRead>;

	let availableGroups: Array<Identity.AvailableGroup>;

	let selectedGroups: string[] = [];

	let group: string;

	let users: string[] = [];

	let roles: string[] = [];

	let availableRoles: string[];

	organizationStore.subscribe((value: string) => (organizationID = value));

	token.subscribe((token: InternalToken) => (at = token));

	function update(at: InternalToken, organizationID: string) {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(parameters)
			.then((v: Array<Identity.GroupRead>) => (groups = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDRolesGet(parameters)
			.then((v: Array<string>) => (availableRoles = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDAvailableGroupsGet(parameters)
			.then((v: Array<Identity.AvailableGroup>) => (availableGroups = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organizationID);

	/* Cluster name must be valid, and it must be unique */
	$: step1Valid =
		Validation.unique(
			group,
			(groups || []).map((group) => group.metadata.name)
		) && roles.length > 0;

	function complete() {
		const parameters = {
			organizationID: organizationID,
			groupWrite: {
				metadata: {
					name: group
				},
				spec: {
					roles: roles,
					users: users,
					providerGroups: selectedGroups
				}
			}
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsPost(parameters)
			.then(() => window.location.assign('/identity/groups'))
			.catch((e: Error) => Clients.error(e));
	}

	import { InputChip } from '@skeletonlabs/skeleton';
</script>

<ShellPage {settings}>
	<Stepper on:complete={complete}>
		<Step locked={!step1Valid}>
			<svelte:fragment slot="header">Let's Get Started!</svelte:fragment>

			<ShellSection title="Group Name">
				<label for="group">
					Choose a name for the group. The name must be unique within the organization.
				</label>
				<input id="group" type="text" class="input" required bind:value={group} />
			</ShellSection>

			<ShellSection title="Roles">
				<label for="roles"> Select the roles members of this group have.</label>
				<select id="roles" class="select" multiple bind:value={roles}>
					{#each availableRoles || [] as role}
						<option value={role}>{role}</option>
					{/each}
				</select>
			</ShellSection>

			{#if availableGroups}
				<ShellSection title="Identity Provider Groups">
					<label for="groups">
						Select any groups from your identity provider that will implicitly include users.
					</label>
					<select id="groups" class="select" multiple bind:value={selectedGroups}>
						{#each availableGroups || [] as group}
							<option value={group.name}>{group.displayName || group.name}</option>
						{/each}
					</select>
				</ShellSection>
			{/if}

			<ShellSection title="Explicit Users">
				<label for="users"
					>Add any explicit users that are members of this group. These may be from outside the
					organization.</label
				>
				<InputChip name="users" bind:value={users} />
			</ShellSection>
		</Step>
		<Step>
			<svelte:fragment slot="header">Confirmation</svelte:fragment>

			<p>Create group "{group}"?</p>
		</Step>
	</Stepper>
</ShellPage>
