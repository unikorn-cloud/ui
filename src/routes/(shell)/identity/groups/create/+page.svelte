<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import InputChips from '$lib/forms/InputChips.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create Group',
		description: 'Create a new group in the organization.'
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

	let groups: Array<Identity.GroupRead> | undefined = $state();
	let availableRoles: Array<Identity.RoleRead> | undefined = $state();
	let availableGroups: Array<Identity.AvailableGroup> | undefined = $state();

	$effect.pre(() => {
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
	});

	let names = $derived((groups || []).map((x) => x.metadata.name));

	let resource: Identity.GroupWrite = $state({
		metadata: {
			name: ''
		},
		spec: {
			roleIDs: [],
			users: [],
			providerGroups: []
		}
	});

	let metadataValid = $state(false);

	/* Cluster name must be valid, and it must be unique */
	let valid = $derived(metadataValid && resource.spec.roleIDs.length > 0);

	function submit() {
		const parameters = {
			organizationID: organizationInfo.id,
			groupWrite: resource
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsPost(parameters)
			.then(() => window.location.assign('/identity/groups'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

	<ShellSection title="Roles">
		{#if availableRoles}
			<MultiSelect
				id="role-ids"
				label="Select roles for group members."
				hint="You must select at least one role."
				bind:value={resource.spec.roleIDs}
			>
				{#each availableRoles || [] as role}
					<option value={role.metadata.id}>{role.metadata.name}</option>
				{/each}
			</MultiSelect>
		{/if}
	</ShellSection>

	<ShellSection title="Users">
		{#if availableGroups && resource.spec.providerGroups}
			<MultiSelect
				id="provider-groups"
				label="Include users with identity provider groups."
				hint="To add and remove members edit the group with your identity provider."
				bind:value={resource.spec.providerGroups}
			>
				{#each availableGroups || [] as group}
					<option value={group.name}>{group.displayName || group.name}</option>
				{/each}
			</MultiSelect>
		{/if}

		{#if resource.spec.users}
			<InputChips
				name="users"
				label="Include users by email address."
				hint="This must be the user's primary email address, not an alias."
				bind:value={resource.spec.users}
			/>
		{/if}
	</ShellSection>

	<div class="flex">
		<Button
			icon="mdi:tick"
			label="Create"
			class="variant-filled-primary"
			clicked={submit}
			disabled={!valid}
		/>
	</div>
</ShellPage>
