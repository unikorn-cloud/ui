<script lang="ts">
	import { page } from '$app/stores';

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

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as Stores from '$lib/stores';

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

	// Get root resources from the API.
	let serviceAccounts: Array<Identity.ServiceAccountRead> | undefined = $state();
	let groups: Array<Identity.GroupRead> | undefined = $state();

	$effect.pre(() => {
		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDServiceaccountsGet(parameters)
			.then((v: Array<Identity.ServiceAccountRead>) => (serviceAccounts = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGroupsGet(parameters)
			.then((v: Array<Identity.GroupRead>) => (groups = v))
			.catch((e: Error) => Clients.error(e));
	});

	// Once we know the service accounts, select the one we are viewing.
	let serviceAccount = $derived.by(() => {
		if (!serviceAccounts) return;

		// Find our group based on ID.
		const serviceAccount = serviceAccounts.find((x) => x.metadata.id == $page.params.id);
		if (!serviceAccount) return;

		// Add stuff to bind to...
		if (!serviceAccount.spec) serviceAccount.spec = {};
		if (!serviceAccount.spec.groupIDs) serviceAccount.spec.groupIDs = [];

		return serviceAccount;
	});

	function submit() {
		if (!at || !organizationInfo || !serviceAccount) return;

		const parameters = {
			organizationID: organizationInfo.id,
			serviceAccountID: $page.params.id,
			serviceAccountWrite: serviceAccount
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDServiceaccountsServiceAccountIDPut(parameters)
			.then(() => window.location.assign('/identity/serviceaccounts'))
			.catch((e: Error) => Clients.error(e));
	}

	let newServiceAccount: Identity.ServiceAccountCreate | undefined = $state();

	function rotate() {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id,
			serviceAccountID: $page.params.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDServiceaccountsServiceAccountIDRotatePost(parameters)
			.then((v: Identity.ServiceAccountCreate) => (newServiceAccount = v))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
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
	{:else if serviceAccount}
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
					{#each groups || [] as group}
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
