<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import Button from '$lib/forms/Button.svelte';
	import Clipboard from '$lib/forms/Clipboard.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'View/Update Service Account',
		description: 'Manage your service account.'
	};

	let serviceAccount = $derived.by(() => {
		let serviceAccount = $state(data.serviceAccount);
		return serviceAccount;
	});

	$effect.pre(() => {
		if (!serviceAccount.spec) serviceAccount.spec = {};
		if (!serviceAccount.spec.groupIDs) serviceAccount.spec.groupIDs = [];
	});

	function submit() {
		const parameters = {
			organizationID: data.organizationID,
			serviceAccountID: $page.params.id,
			serviceAccountWrite: serviceAccount
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDServiceaccountsServiceAccountIDPut(parameters)
			.then(() => window.location.assign('/identity/serviceaccounts'))
			.catch((e: Error) => Clients.error(e));
	}

	let newServiceAccount: Identity.ServiceAccountCreate | undefined = $state();

	function rotate() {
		const parameters = {
			organizationID: data.organizationID,
			serviceAccountID: $page.params.id
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDServiceaccountsServiceAccountIDRotatePost(parameters)
			.then((v: Identity.ServiceAccountCreate) => (newServiceAccount = v))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings} allowed={data.allowed}>
	{#if newServiceAccount}
		<ShellViewHeader metadata={newServiceAccount.metadata}>
			{#snippet extraMetadata()}
				<ShellMetadataItem
					icon="mdi:key-outline"
					label="Expiry"
					value={newServiceAccount?.status.expiry.toUTCString()}
				/>
			{/snippet}
		</ShellViewHeader>

		<ShellSection title="Access Token">
			<p>
				<em>This token will only be shown once, so make a copy and keep it secure.</em>
			</p>
			<Clipboard id="access-token" value={newServiceAccount.status.accessToken || ''} />
		</ShellSection>

		<div class="flex">
			<Button
				icon="mdi:tick"
				label="Done"
				class="variant-filled-primary"
				href="/identity/serviceaccounts"
			/>
		</div>
	{:else}
		<ShellViewHeader metadata={serviceAccount.metadata}>
			{#snippet extraMetadata()}
				<ShellMetadataItem
					icon="mdi:key-outline"
					label="Expiry"
					value={serviceAccount?.status.expiry.toUTCString()}
				/>
			{/snippet}
		</ShellViewHeader>

		<!-- Token subjects are bound to the user name, so names are immutable -->
		<ShellMetadataSection metadata={serviceAccount.metadata} nameMutable={false} />

		<ShellSection title="Access Control">
			{#if serviceAccount.spec?.groupIDs}
				<MultiSelect
					id="sa-groups"
					label="Groups"
					hint="Select any groups that the service account should be a member of."
					bind:value={serviceAccount.spec.groupIDs}
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
				href="/identity/serviceaccounts"
			/>
			<Button
				icon="mdi:refresh"
				label="Refresh Access Token"
				class="variant-outline-primary"
				clicked={rotate}
			/>

			<Button icon="mdi:tick" label="Update" class="variant-filled-primary" clicked={submit} />
		</div>
	{/if}
</ShellPage>
