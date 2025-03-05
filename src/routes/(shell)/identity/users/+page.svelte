<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/state';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';
	import * as Formatters from '$lib/formatters';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';
	import ShellListItemHeader from '$lib/layouts/ShellListItemHeader.svelte';
	import ShellListItemBadges from '$lib/layouts/ShellListItemBadges.svelte';
	import ShellListItemMetadata from '$lib/layouts/ShellListItemMetadata.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';
	import Button from '$lib/forms/Button.svelte';
	import ModalIcon from '$lib/layouts/ModalIcon.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Users',
		description: "Manage your organization's users."
	};

	onMount(() => {
		const interval = setInterval(() => navigating.to || invalidate('layout:users'), 5000);

		return () => clearInterval(interval);
	});

	function confirm(id: string) {
		const parameters = {
			organizationID: data.organizationID,
			userID: id
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDUsersUserIDDelete(parameters)
			.then(() => invalidate('layout:users'))
			.catch((e: Error) => Clients.error(e));
	}

	function userLastActive(user: Identity.UserRead): string {
		return user.status.lastActive ? Formatters.ageFormatter(user.status.lastActive) : 'never';
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

		return 'text-surface-700';
	}
</script>

<ShellPage {settings}>
	{#snippet tools()}
		<Button icon="mdi:add" label="Create" href="/identity/users/create" />
	{/snippet}

	<ShellList>
		{#each data.users || [] as resource}
			<ShellListItem icon="mdi:user-outline">
				{#snippet main()}
					<ShellListItemHeader
						title={resource.spec.subject}
						href="/identity/users/view/{resource.metadata.id}"
					/>
				{/snippet}

				<ShellListItemBadges>
					{#snippet extra()}
						<Badge icon={stateIcon(resource)} iconcolor={stateColor(resource)}
							>{resource.spec.state}</Badge
						>
					{/snippet}
				</ShellListItemBadges>

				<ShellListItemMetadata metadata={resource.metadata} />

				<ShellListItemMetadata>
					<ShellMetadataItem icon="mdi:run" label="Last Active" value={userLastActive(resource)} />
				</ShellListItemMetadata>

				{#snippet trail()}
					<ModalIcon
						icon="mdi:trash-can-outline"
						title="Are you sure?"
						confirm={() => confirm(resource.metadata.id)}
					>
						Removing user "{resource.spec.subject}" will remove their access to this organization.
					</ModalIcon>
				{/snippet}
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
