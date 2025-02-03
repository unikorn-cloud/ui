<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';
	import * as Validation from '$lib/validation';

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

	let names = $derived(data.users.map((x) => x.spec.subject));

	let resource: Identity.UserWrite = $state({
		spec: {
			subject: '',
			state: Identity.UserState.Active,
			groupIDs: []
		}
	});

	/* Cluster name must be valid, and it must be unique */
	let usernameValid = $state(false);

	let valid = $derived(usernameValid && resource.spec.groupIDs.length > 0);

	function submit() {
		const parameters = {
			organizationID: data.organizationID,
			userWrite: resource
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDUsersPost(parameters)
			.then(() => window.location.assign('/identity/users'))
			.catch((e: Error) => Clients.error(toastStore, e));
	}
</script>

<ShellPage {settings}>
	<ShellSection title="User Information">
		<TextInput
			id="name"
			bind:value={resource.spec.subject}
			label="Email Address."
			hint="Users canonical email address, use of email aliases will not work."
			validators={[Validation.stringSet, (name: string) => Validation.unique(name, names)]}
			bind:valid={usernameValid}
		/>
	</ShellSection>

	<ShellSection title="Access Control">
		{#if resource.spec.groupIDs}
			<MultiSelect
				id="sa-groups"
				label="Groups"
				hint="Select at least one group that the user should be a member of."
				bind:value={resource.spec.groupIDs}
			>
				{#each data.groups as group}
					<option value={group.metadata.id}>
						{group.metadata.name}
					</option>
				{/each}
			</MultiSelect>
		{/if}
	</ShellSection>

	<div class="flex justify-between">
		<Button
			icon="mdi:cancel-bold"
			label="Cancel"
			class="variant-outline-primary"
			href="/identity/users"
		/>
		<Button
			icon="mdi:tick"
			label="Create"
			class="variant-filled-primary"
			clicked={submit}
			disabled={!valid}
		/>
	</div>
</ShellPage>
