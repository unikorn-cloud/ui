<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create Group',
		description: 'Create a new group in the organization.'
	};

	let names = $derived(data.groups.map((x) => x.metadata.name));

	let resource: Identity.GroupWrite = $state({
		metadata: {
			name: ''
		},
		spec: {
			roleIDs: [],
			userIDs: []
		}
	});

	let metadataValid = $state(false);

	/* Cluster name must be valid, and it must be unique */
	let valid = $derived(metadataValid && resource.spec.roleIDs.length > 0);

	function submit() {
		const parameters = {
			organizationID: data.organizationID,
			groupWrite: resource
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDGroupsPost(parameters)
			.then(() => window.location.assign('/dashboard/identity/groups'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings} allowed={data.allowed}>
	<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

	<ShellSection title="Roles">
		<MultiSelect
			id="role-ids"
			label="Select roles for group members."
			hint="You must select at least one role."
			bind:value={resource.spec.roleIDs}
		>
			{#each data.roles as role}
				<option value={role.metadata.id}>{role.metadata.name}</option>
			{/each}
		</MultiSelect>
	</ShellSection>

	<ShellSection title="Users">
		{#if resource.spec.userIDs}
			<MultiSelect id="user-ids" label="Select group members." bind:value={resource.spec.userIDs}>
				{#each data.users as user}
					<option value={user.metadata.id}>{user.spec.subject}</option>
				{/each}
			</MultiSelect>
		{/if}
	</ShellSection>

	<div class="flex justify-between">
		<Button
			icon="mdi:cancel-bold"
			label="Cancel"
			class="variant-outline-primary"
			href="/dashboard/identity/groups"
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
