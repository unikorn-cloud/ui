<script lang="ts">
	import { run } from 'svelte/legacy';

	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import TextInput from '$lib/forms/TextInput.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create User',
		description: 'Create a new user in the organization.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as Stores from '$lib/stores';
	import * as Validation from '$lib/validation';

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

	let users: Array<Identity.User> | undefined = $state();
	let groups: Array<Identity.GroupRead> | undefined = $state();

	function update(at: InternalToken, organizationInfo: Stores.OrganizationInfo) {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDUsersGet(parameters)
			.then((v: Array<Identity.User>) => (users = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(parameters)
			.then((v: Array<Identity.GroupRead>) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		update(at, organizationInfo);
	});

	let names = $derived((users || []).map((x) => x.name));

	let resource: Identity.User = $state({
		name: '',
		groupIDs: []
	});

	/* Cluster name must be valid, and it must be unique */
	let usernameValid = $state(false);

	let valid = $derived(usernameValid && resource.groupIDs.length > 0);

	function submit() {
		const parameters = {
			organizationID: organizationInfo.id,
			user: resource
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDUsersPost(parameters)
			.then(() => window.location.assign('/identity/users'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	<ShellSection title="User Information">
		<TextInput
			id="name"
			bind:value={resource.name}
			label="Email Address."
			hint="Users canonical email address, use of email aliases will not work."
			validators={[Validation.stringSet, (name: string) => Validation.unique(name, names)]}
			bind:valid={usernameValid}
		/>
	</ShellSection>

	<ShellSection title="Access Control">
		{#if resource.groupIDs}
			<MultiSelect
				id="sa-groups"
				label="Groups"
				hint="Select at least one group that the user should be a member of."
				bind:value={resource.groupIDs}
			>
				{#each groups || [] as group}
					<option value={group.metadata.id}>
						{group.metadata.name}
					</option>
				{/each}
			</MultiSelect>
		{/if}
	</ShellSection>

	<div class="flex">
		<Button
			icon="mdi:tick"
			label="Create"
			class="btn variant-filled-primary"
			clicked={submit}
			disabled={!valid}
		/>
	</div>
</ShellPage>
