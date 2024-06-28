<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
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

	let at: InternalToken;

	let organizationID: string;

	let groups: Array<Identity.GroupRead>;

	let availableGroups: Array<Identity.AvailableGroup>;

	let selectedGroups: string[] = [];

	let metadata: Identity.ResourceMetadata = { name: '' };

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

	let names: Array<string>;

	$: names = (groups || []).map((x) => x.metadata.name);

	let metadataValid = false;

	/* Cluster name must be valid, and it must be unique */
	$: step1Valid = metadataValid && roles.length > 0;

	function complete() {
		const parameters = {
			organizationID: organizationID,
			groupWrite: {
				metadata: metadata,
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

			<ShellMetadataSection {metadata} {names} bind:valid={metadataValid} />

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

			<p>Create group "{metadata.name}"?</p>
		</Step>
	</Stepper>
</ShellPage>
