<script lang="ts">
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
	import Protected from '$lib/rbac/Protected.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Users',
		description: "Manage your organization's users."
	};

	import { onDestroy } from 'svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as RBAC from '$lib/rbac';
	import * as Stores from '$lib/stores';

	// Define required RBAC rules.
	let allowed: boolean = $state(false);

	let organizationScopes: Array<RBAC.OrganizationScope> = [
		{
			endpoint: 'identity:users',
			operation: Identity.AclOperation.Create
		}
	];

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

	let users: Array<Identity.UserRead> | undefined = $state();

	function update(allowed: boolean) {
		if (!allowed) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDUsersGet(parameters)
			.then((v: Array<Identity.UserRead>) => (users = v))
			.catch((e: Error) => Clients.error(e));
	}

	$effect.pre(() => {
		update(allowed);
	});

	const ticker = setInterval(() => update(allowed), 5000);
	onDestroy(() => clearInterval(ticker));

	function remove(resource: Identity.UserRead) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing user "${resource.spec.subject}" and revoke access token.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organizationID: organizationInfo.id,
					userID: resource.metadata.id
				};

				Clients.identity(toastStore, at)
					.apiV1OrganizationsOrganizationIDUsersUserIDDelete(parameters)
					.then(() => update(allowed))
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
				return 'mdi:wanring-outline';
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

<ShellPage {settings}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/identity/users/create" />
	{/snippet}

	<Protected {organizationScopes} bind:allowed>
		<ShellList>
			{#each users || [] as resource}
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
	</Protected>
</ShellPage>
