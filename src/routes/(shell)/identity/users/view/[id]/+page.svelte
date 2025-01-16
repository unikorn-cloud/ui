<script lang="ts">
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeaderSimple from '$lib/layouts/ShellViewHeaderSimple.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'View/Update User',
		description: 'Manage your user.'
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
	let users: Array<Identity.User> | undefined = $state();
	let groups: Array<Identity.GroupRead> | undefined = $state();

	$effect.pre(() => {
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
	});

	// Once we know the users, select the one we are viewing.
	let user = $derived.by(() => {
		if (!users) return;

		// Find our group based on ID.
		const user = users.find((x) => x.name == $page.params.id);
		if (!user) return;

		// Add stuff to bind to...
		if (!user.groupIDs) user.groupIDs = [];

		return user;
	});

	function submit() {
		if (!at || !organizationInfo || !user) return;

		const parameters = {
			organizationID: organizationInfo.id,
			username: $page.params.id,
			user: user
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDUsersUsernamePut(parameters)
			.then(() => window.location.assign('/identity/users'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#if user}
		<ShellViewHeaderSimple name={user.name} />

		<ShellSection title="Access Control">
			{#if user.groupIDs}
				<MultiSelect
					id="sa-groups"
					label="Groups"
					hint="Select at least one group that the user should be a member of."
					bind:value={user.groupIDs}
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
			<Button icon="mdi:tick" label="Update" class="variant-filled-primary" clicked={submit} />
		</div>
	{/if}
</ShellPage>
