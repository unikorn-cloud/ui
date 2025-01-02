<script lang="ts">
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import InputChips from '$lib/forms/InputChips.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'View/Update Group',
		description: 'Manage your group membership.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as Stores from '$lib/stores';

	// Grab the organization scope.
	let organizationInfo = $state() as Stores.OrganizationInfo;

	Stores.organizationStore.subscribe((value: Stores.OrganizationInfo) => {
		organizationInfo = value;
	});

	// Grab the acces token.
	let at = $state() as InternalToken;

	token.subscribe((token: InternalToken): void => {
		at = token;
	});

	// Get root resources from the API.
	let groups: Array<Identity.GroupRead> | undefined = $state();
	let availableRoles: Array<Identity.RoleRead> | undefined = $state();
	let availableGroups: Array<Identity.AvailableGroup> | undefined = $state();

	function update(at: InternalToken, organizationInfo: Stores.OrganizationInfo) {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(parameters)
			.then((v: Array<Identity.GroupRead>) => (groups = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDRolesGet(parameters)
			.then((v: Array<Identity.RoleRead>) => (availableRoles = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDAvailableGroupsGet(parameters)
			.then((v: Array<Identity.AvailableGroup>) => {
				if (v.length == 0) return;
				availableGroups = v;
			})
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		update(at, organizationInfo);
	});

	// Once we know the groups, select the one we are viewing.
	let group: Identity.GroupRead | undefined = $state();

	function updateGroup(groups: Array<Identity.GroupRead> | undefined) {
		if (!groups) return;

		// Find our group based on ID.
		const temp = groups.find((x) => x.metadata.id == $page.params.id);
		if (!temp) return;

		// Add a provider groups array so the multiselet bind doesn't barf.
		if (!temp.spec.providerGroups) temp.spec.providerGroups = [];
		if (!temp.spec.users) temp.spec.users = [];

		group = temp;
	}

	run(() => {
		updateGroup(groups);
	});

	let names: Array<string> = $derived(
		(groups || []).filter((x) => x.metadata.id != $page.params.id).map((x) => x.metadata.name)
	);

	let metadataValid = $state(false);

	let valid = $derived(metadataValid && group?.spec.roleIDs.length != 0);

	function submit() {
		if (!at || !organizationInfo || !group) return;

		const parameters = {
			organizationID: organizationInfo.id,
			groupid: $page.params.id,
			groupWrite: group
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGroupidPut(parameters)
			.then(() => window.location.assign('/identity/groups'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#if group}
		<ShellViewHeader metadata={group.metadata} />
		<ShellMetadataSection metadata={group.metadata} {names} bind:valid={metadataValid} />

		<ShellSection title="Roles">
			{#if availableRoles}
				<MultiSelect
					id="role-ids"
					label="Select roles for group members."
					hint="You must select at least one role."
					bind:value={group.spec.roleIDs}
				>
					{#each availableRoles || [] as role}
						<option value={role.metadata.id}>{role.metadata.name}</option>
					{/each}
				</MultiSelect>
			{/if}
		</ShellSection>

		<ShellSection title="Users">
			{#if availableGroups && group.spec.providerGroups}
				<MultiSelect
					id="provider-groups"
					label="Include users with identity provider groups."
					hint="To add and remove members edit the group with your identity provider."
					bind:value={group.spec.providerGroups}
				>
					{#each availableGroups || [] as group}
						<option value={group.name}>{group.displayName || group.name}</option>
					{/each}
				</MultiSelect>
			{/if}

			{#if group.spec.users}
				<InputChips
					name="users"
					label="Include users by email address."
					hint="This must be the user's primary email address, not an alias."
					bind:value={group.spec.users}
				/>
			{/if}
		</ShellSection>

		<button
			class="btn variant-filled-primary flex gap-2 items-center"
			disabled={!valid}
			onclick={submit}
			onkeypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
