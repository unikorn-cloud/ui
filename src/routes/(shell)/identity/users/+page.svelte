<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate, beforeNavigate } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import BurgerMenu from '$lib/layouts/BurgerMenu.svelte';
	import BurgerMenuItem from '$lib/layouts/BurgerMenuItem.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Users',
		description: "Manage your organization's users."
	};

	const ticker = setInterval(() => invalidate('layout:users'), 5000);
	beforeNavigate(() => clearInterval(ticker));

	function remove(resource: Identity.UserRead) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing user "${resource.spec.subject}" and revoke access token.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: data.organizationID,
					userID: resource.metadata.id
				};

				Clients.identity(data.token)
					.apiV1OrganizationsOrganizationIDUsersUserIDDelete(parameters)
					.then(() => invalidate('layout:users'))
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}

	function userLastActive(user: Identity.UserRead): string {
		return user.status.lastActive ? user.status.lastActive.toUTCString() : 'never';
	}

	function stateIcon(user: Identity.UserRead): string {
		switch (user.spec.state) {
			case Identity.UserState.Active:
				return 'mdi:tick';
			case Identity.UserState.Pending:
				return 'mdi:sleep';
			case Identity.UserState.Suspended:
				return 'mdi:error-outline';
		}

		return 'mdi:question-mark';
	}

	function stateColor(user: Identity.UserRead): string {
		switch (user.spec.state) {
			case Identity.UserState.Active:
				return 'text-success-500';
			case Identity.UserState.Pending:
				return 'text-warning-500';
			case Identity.UserState.Suspended:
				return 'text-error-500';
		}

		return 'text-surface-500';
	}
</script>

<ShellPage {settings} allowed={data.allowed}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/identity/users/create" />
	{/snippet}

	<ShellList>
		{#each data.users || [] as resource}
			<ShellListItem icon="mdi:user-outline">
				<ShellListItemHeader
					title={resource.spec.subject}
					href="/identity/users/view/{resource.metadata.id}"
				/>

				<ShellListItemBadges>
					{#snippet extra()}
						<Badge icon={stateIcon(resource)} iconcolor={stateColor(resource)}
							>{resource.spec.state}</Badge
						>
					{/snippet}
				</ShellListItemBadges>

				<ShellListItemMetadata metadata={resource.metadata}>
					{#snippet extra()}
						<ShellMetadataItem
							icon="mdi:run"
							label="Last Active"
							value={userLastActive(resource)}
						/>
					{/snippet}
				</ShellListItemMetadata>

				{#snippet trail()}
					<BurgerMenu name="menu-{resource.metadata.id}">
						<BurgerMenuItem clicked={() => remove(resource)} icon="mdi:trash-can-outline">
							Delete
						</BurgerMenuItem>
					</BurgerMenu>
				{/snippet}
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
