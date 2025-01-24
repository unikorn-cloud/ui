<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeaderSimple from '$lib/layouts/ShellViewHeaderSimple.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import Select from '$lib/forms/Select.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'View/Update User',
		description: 'Manage your user.'
	};

	// Once we know the users, select the one we are viewing.
	let user = $derived(data.users.find((x) => x.metadata.id == $page.params.id));

	$effect.pre(() => {
		if (!user) return;
		if (!user.spec.groupIDs) user.spec.groupIDs = [];
	});

	function submit() {
		if (!user) return;

		const parameters = {
			organizationID: data.organizationID,
			userID: $page.params.id,
			userWrite: user
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDUsersUserIDPut(parameters)
			.then(() => window.location.assign('/identity/users'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings} allowed={data.allowed}>
	{#if user}
		<ShellViewHeaderSimple name={user.spec.subject} />

		<ShellSection title="Access Control">
			<Select
				id="sa-state"
				label="Account State"
				hint="Active users can login and do things, other states don't allow login but retail group memberships."
				disabled={user.spec.state == Identity.UserState.Pending}
				bind:value={user.spec.state}
			>
				<option value={Identity.UserState.Active}>Active</option>
				{#if user.spec.state == Identity.UserState.Pending}
					<option value={Identity.UserState.Pending}>Pending</option>
				{/if}
				<option value={Identity.UserState.Suspended}>Suspended</option>
			</Select>

			{#if user.spec.groupIDs}
				<MultiSelect
					id="sa-groups"
					label="Groups"
					hint="Select at least one group that the user should be a member of."
					bind:value={user.spec.groupIDs}
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
			<Button icon="mdi:tick" label="Update" class="variant-filled-primary" clicked={submit} />
		</div>
	{/if}
</ShellPage>
