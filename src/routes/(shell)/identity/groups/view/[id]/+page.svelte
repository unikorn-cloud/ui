<script lang="ts">
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
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
	import * as Identity from '$lib/openapi/identity';

	let at: InternalToken;

	token.subscribe((token: InternalToken) => (at = token));

	let organizationID: string;

	organizationStore.subscribe((value: string) => (organizationID = value));

	let groups: Array<Identity.GroupRead>;
	let group: Identity.GroupRead;

	let availableRoles: string[];

	let availableGroups: Array<Identity.AvailableGroup>;

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

	function updateGroup(groups: Array<Identity.GroupRead>) {
		if (!groups) return;

		// Find our group based on ID.
		const temp = groups.find((x) => x.metadata.id == $page.params.id);
		if (!temp) return;

		// Add a provider groups array so the multiselet bind doesn't barf.
		if (!temp.spec.providerGroups) temp.spec.providerGroups = [];

		group = temp;
	}

	$: updateGroup(groups);

	let names: Array<string>;

	$: names = (groups || [])
		.filter((x) => x.metadata.id != $page.params.id)
		.map((x) => x.metadata.name);

	let metadataValid = false;

	$: valid = metadataValid && group.spec.roles.length != 0;

	function submit() {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID,
			groupid: $page.params.id,
			groupWrite: group
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGroupidPut(parameters)
			.then(() => window.location.assign('/identity/groups'))
			.catch((e: Error) => Clients.error(e));
	}

	import { InputChip } from '@skeletonlabs/skeleton';
</script>

<ShellPage {settings}>
	{#if group}
		<ShellViewHeader metadata={group.metadata} />
		<ShellMetadataSection metadata={group.metadata} {names} bind:valid={metadataValid} />

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
			class="btn variant-filled-tertiary flex gap-2 items-center"
			disabled={!valid}
			on:click={submit}
			on:keypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
