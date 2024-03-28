<script lang="ts">
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';

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
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/identity/models';

	let at: string;

	token.subscribe((token: string) => (at = token));

	let organization: string;

	organizationStore.subscribe((value: string) => (organization = value));

	let group: Models.Group;

	function update(at: string, organization: string) {
		if (!at || !organization) return;

		const parameters = {
			organization: organization,
			groupid: $page.params.id
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationGroupsGroupidGet(parameters)
			.then((v: Models.Group) => (group = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organization);

	function submit() {
		if (!at || !organization) return;
	}

	import { InputChip } from '@skeletonlabs/skeleton';
</script>

<ShellPage {settings}>
	{#if group}
		<h3 class="h3">{group.name}</h3>

		<label class="label">
			<span>Roles for users in the group.</span>
			<select class="select" multiple bind:value={group.roles}>
				<option value="admin">Administrator</option>
				<option value="user">User</option>
				<option value="reader">Reader</option>
			</select>
		</label>

		<label class="label" for="users"> Users that are part of the group. </label>
		<InputChip name="users" bind:value={group.users} />

		<button
			class="btn variant-ghost-primary flex gap-2 items-center"
			on:click={submit}
			on:keypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
