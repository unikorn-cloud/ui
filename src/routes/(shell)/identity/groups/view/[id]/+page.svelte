<script lang="ts">
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

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
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/identity/models';

	let at: InternalToken;

	token.subscribe((token: InternalToken) => (at = token));

	let organizationID: string;

	organizationStore.subscribe((value: string) => (organizationID = value));

	let group: Models.GroupRead;

	let availableRoles: string[];

	let availableGroups: Models.AvailableGroups;

	function update(at: InternalToken, organizationID: string) {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID,
			groupid: $page.params.id
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGroupidGet(parameters)
			.then((v: Models.GroupRead) => {
				if (!v.spec.providerGroups) v.spec.providerGroups = [];
				group = v;
			})
			.catch((e: Error) => Clients.error(e));

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationIDRolesGet(parameters)
			.then((v: Models.RoleList) => (availableRoles = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationIDAvailableGroupsGet(parameters)
			.then((v: Models.AvailableGroups) => (availableGroups = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organizationID);

	function submit() {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID,
			groupid: $page.params.id,
			groupWrite: group
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGroupidPut(parameters)
			.then(() => window.location.assign('/identity/groups'))
			.catch((e: Error) => Clients.error(e));
	}

	import { InputChip } from '@skeletonlabs/skeleton';
</script>

<ShellPage {settings}>
	{#if group}
		<h2 class="h2">{group.metadata.name}</h2>

		<ShellSection title="Roles">
			<label class="label">
				<span>Roles for users in the group.</span>
				<select class="select" multiple bind:value={group.spec.roles}>
					{#each availableRoles || [] as role}
						<option value={role}>{role}</option>
					{/each}
				</select>
			</label>
		</ShellSection>

		{#if availableGroups}
			<ShellSection title="Identity Provider Groups">
				<label for="groups">
					Select any groups from your identity provider that will implicitly include users.
				</label>
				<select id="groups" class="select" multiple bind:value={group.spec.providerGroups}>
					{#each availableGroups || [] as group}
						<option value={group.name}>{group.displayName || group.name}</option>
					{/each}
				</select>
			</ShellSection>
		{/if}

		<ShellSection title="Explicit Users">
			<label class="label" for="users"> Users that are part of the group. </label>
			<InputChip name="users" bind:value={group.spec.users} />
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
