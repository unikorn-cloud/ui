<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
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

	let roles = $derived(
		data.roles.map(
			(x) => ({ label: x.metadata.name, value: x.metadata.id }) as AutocompleteOption<string>
		)
	);

	let users = $derived(
		data.users.map(
			(x) => ({ label: x.spec.subject, value: x.metadata.id }) as AutocompleteOption<string>
		)
	);

	let serviceAccounts = $derived(
		data.serviceAccounts.map(
			(x) => ({ label: x.metadata.name, value: x.metadata.id }) as AutocompleteOption<string>
		)
	);
</script>

<ShellPage {settings}>
	<ShellViewHeader metadata={group.metadata} />
	<ShellMetadataSection metadata={group.metadata} {names} bind:valid={metadataValid} />

	<ShellSection title="Roles">
		<MultiSelect
			id="role-ids"
			label="Select roles for group members."
			hint="You must select at least one role."
			options={roles}
			value={group.spec.roleIDs}
			add={(value: string) => group.spec.roleIDs.push(value)}
			remove={(index: number) => group.spec.roleIDs.splice(index, 1)}
		>
			{#snippet selected(value: string)}
				{data.roles.find((x) => x.metadata.id == value)?.metadata.name}
			{/snippet}
		</MultiSelect>
	</ShellSection>

	<ShellSection title="Users">
		<MultiSelect
			id="user-ids"
			label="Select group members."
			options={users}
			value={group.spec.userIDs}
			add={(value: string) => group.spec.userIDs.push(value)}
			remove={(index: number) => group.spec.userIDs.splice(index, 1)}
		>
			{#snippet selected(value: string)}
				{data.users.find((x) => x.metadata.id == value)?.spec.subject}
			{/snippet}
		</MultiSelect>
	</ShellSection>

	<ShellSection title="Service Accounts">
		<MultiSelect
			id="sa-ids"
			label="Select group members."
			options={serviceAccounts}
			value={group.spec.serviceAccountIDs}
			add={(value: string) => group.spec.serviceAccountIDs.push(value)}
			remove={(index: number) => group.spec.serviceAccountIDs.splice(index, 1)}
		>
			{#snippet selected(value: string)}
				{data.serviceAccounts.find((x) => x.metadata.id == value)?.metadata.name}
			{/snippet}
		</MultiSelect>
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
