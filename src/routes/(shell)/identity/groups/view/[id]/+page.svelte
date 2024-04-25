<script lang="ts">
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'View/Update Group',
		description: 'Manage your group membership.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/identity/models';

	let at: string;

	token.subscribe((token: string) => (at = token));

	let organization: string;

	organizationStore.subscribe((value: string) => (organization = value));

	let group: Models.Group;

	let availableRoles: string[];

	let availableGroups: Models.AvailableGroups;

	function update(at: string, organization: string) {
		if (!at || !organization) return;

		const parameters = {
			organization: organization,
			groupid: $page.params.id
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationGroupsGroupidGet(parameters)
			.then((v: Models.Group) => (group = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationRolesGet(parameters)
			.then((v: Models.RoleList) => (availableRoles = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationAvailableGroupsGet(parameters)
			.then((v: Models.AvailableGroups) => (availableGroups = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organization);

	function submit() {
		if (!at || !organization) return;

		const parameters = {
			organization: organization,
			groupid: group.id,
			group: group
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationGroupsGroupidPut(parameters)
			.then(() => window.location.assign('/identity/groups'))
			.catch((e: Error) => Clients.error(e));
	}

	import { InputChip } from '@skeletonlabs/skeleton';
</script>

<ShellPage {settings}>
	{#if group}
		<h2 class="h2">{group.name}</h2>

		<h4 class="h4">Roles</h4>
		<label class="label">
			<span>Roles for users in the group.</span>
			<select class="select" multiple bind:value={group.roles}>
				{#each availableRoles || [] as role}
					<option value={role}>{role}</option>
				{/each}
			</select>
		</label>

		{#if availableGroups}
			<h4 class="h4">Identity Provider Groups</h4>
			<label for="groups">
				Select any groups from your identity provider that will implicitly include users.
			</label>
			<select id="groups" class="select" multiple bind:value={group.providerGroups}>
				{#each availableGroups || [] as group}
					<option value={group.name}>{group.displayName || group.name}</option>
				{/each}
			</select>
		{/if}

		<h4 class="h4">Explicit Users</h4>
		<label class="label" for="users"> Users that are part of the group. </label>
		<InputChip name="users" bind:value={group.users} />

		<button
			class="btn variant-ghost-primary flex gap-2 items-center"
			on:click={submit}
			on:keypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
