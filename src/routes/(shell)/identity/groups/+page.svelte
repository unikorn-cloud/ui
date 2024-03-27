<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Groups',
		description: 'Manage your organizations groups and roles.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/identity/models';

	let at: string;

	token.subscribe((token: string) => (at = token));

	let organization: string;

	organizationStore.subscribe((value: string) => (organization = value));

	let groups: Models.Groups;

	function update(at: string, organization: string) {
		if (!at || !organization) return;

		const parameters = {
			organization: organization
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationGroupsGet(parameters)
			.then((v: Models.Groups) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organization);

	function remove(resource: Models.Group) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing project "${resource.name}" will also remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organization: organization,
					groupid: resource.id
				};

				Clients.identityClient(toastStore, at)
					.apiV1OrganizationsOrganizationGroupsGroupidDelete(parameters)
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	<a href="/identity/groups/create" class="btn variant-ghost-primary flex gap-2 items-center">
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</a>

	{#each groups || [] as resource}
		<article class="bg-surface-50-900-token rounded-lg p-4 flex items-center justify-between gap-8">
			<header class="flex items-center gap-4">
				<h6 class="h6">{resource.name}</h6>
			</header>

			<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
				<iconify-icon icon="mdi:close" />
			</button>
		</article>
	{/each}
</ShellPage>
