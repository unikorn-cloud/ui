<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	import * as Clients from '$lib/clients';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'View/Update Group',
		description: 'Manage your group membership.'
	};

	let group = $derived.by(() => {
		let group = $state(data.group);
		return group;
	});

	// Add in any defaults before we rnder the DOM so we have things to bind to.
	$effect.pre(() => {
		if (!group.spec.userIDs) group.spec.userIDs = [];
		if (!group.spec.serviceAccountIDs) group.spec.serviceAccountIDs = [];
	});

	let names: Array<string> = $derived(
		data.groups.filter((x) => x.metadata.id != $page.params.id).map((x) => x.metadata.name)
	);

	let metadataValid = $state(false);

	let valid = $derived(metadataValid && group?.spec.roleIDs.length != 0);

	function submit() {
		const parameters = {
			organizationID: data.organizationID,
			groupid: $page.params.id,
			groupWrite: group
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDGroupsGroupidPut(parameters)
			.then(() => window.location.assign('/identity/groups'))
			.catch((e: Error) => Clients.error(toastStore, e));
	}
</script>

<ShellPage {settings}>
	<ShellViewHeader metadata={group.metadata} />
	<ShellMetadataSection metadata={group.metadata} {names} bind:valid={metadataValid} />

	<ShellSection title="Roles">
		<MultiSelect
			id="role-ids"
			label="Select roles for group members."
			hint="You must select at least one role."
			bind:value={group.spec.roleIDs}
		>
			{#each data.roles as role}
				<option value={role.metadata.id}>{role.metadata.name}</option>
			{/each}
		</MultiSelect>
	</ShellSection>

	<ShellSection title="Users">
		{#if group.spec.userIDs}
			<MultiSelect id="user-ids" label="Select group members." bind:value={group.spec.userIDs}>
				{#each data.users as user}
					<option value={user.metadata.id}>{user.spec.subject}</option>
				{/each}
			</MultiSelect>
		{/if}
	</ShellSection>

	<ShellSection title="Service Accounts">
		{#if group.spec.serviceAccountIDs}
			<MultiSelect
				id="sa-ids"
				label="Select group members."
				bind:value={group.spec.serviceAccountIDs}
			>
				{#each data.serviceAccounts as serviceAccount}
					<option value={serviceAccount.metadata.id}>{serviceAccount.metadata.name}</option>
				{/each}
			</MultiSelect>
		{/if}
	</ShellSection>

	<div class="flex justify-between">
		<Button
			icon="mdi:cancel-bold"
			label="Cancel"
			class="variant-outline-primary"
			href="/identity/groups"
		/>
		<Button
			icon="mdi:tick"
			label="Update"
			class="variant-filled-primary"
			clicked={submit}
			disabled={!valid}
		/>
	</div>
</ShellPage>
