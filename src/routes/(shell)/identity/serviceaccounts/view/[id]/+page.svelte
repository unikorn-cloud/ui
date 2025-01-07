<script lang="ts">
	import { run } from 'svelte/legacy';
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import { clipboard } from '@skeletonlabs/skeleton';

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

	function update(at: InternalToken, organizationInfo: Stores.OrganizationInfo) {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDServiceaccountsGet(parameters)
			.then((v: Array<Identity.ServiceAccountRead>) => (serviceAccounts = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		update(at, organizationInfo);
	});

	// Once we know the service accounts, select the one we are viewing.
	let serviceAccount: Identity.ServiceAccountRead | undefined = $state();

	function updateServiceAccount(serviceAccounts: Array<Identity.ServiceAccountRead> | undefined) {
		if (!serviceAccounts) return;

		// Find our group based on ID.
		const temp = serviceAccounts.find((x) => x.metadata.id == $page.params.id);
		if (!temp) return;

		serviceAccount = temp;
	}

	run(() => {
		updateServiceAccount(serviceAccounts);
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
				<ShellMetadataItem icon="mdi:key-outline">
					{newServiceAccount?.spec.expiry}
				</ShellMetadataItem>
			{/snippet}
		</ShellViewHeader>

		<ShellSection title="Access Token">
			<p>
				<em>This token will only be shown once, so make a copy and keep it secure.</em>
			</p>
			<div class="flex gap-4 items-center">
				<div
					data-clipboard="pat"
					class="p-2 overflow-hidden textarea text-ellipsis whitespace-nowrap"
				>
					{newServiceAccount.status.accessToken}
				</div>
				<button
					use:clipboard={{ element: 'pat' }}
					class="btn variant-filled-primary flex items-center"
				>
					<iconify-icon icon="mdi:clipboard-outline"></iconify-icon>
					<span>Copy</span>
				</button>
			</div>
		</ShellSection>
	{:else if serviceAccount}
		<ShellViewHeader metadata={serviceAccount.metadata}>
			{#snippet extraMetadata()}
				<ShellMetadataItem icon="mdi:key-outline">
					{serviceAccount?.spec.expiry}
				</ShellMetadataItem>
			{/snippet}
		</ShellViewHeader>

		<!-- Token subjects are bound to the user name, so names are immutable -->
		<ShellMetadataSection metadata={serviceAccount.metadata} nameMutable={false} />

		<div class="flex gap-4">
			<button
				class="btn variant-filled-primary flex gap-2 items-center"
				onclick={rotate}
				onkeypress={rotate}
			>
				Rotate Access Token
			</button>

			<button
				class="btn variant-filled-primary flex gap-2 items-center"
				onclick={submit}
				onkeypress={submit}
			>
				Update
			</button>
		</div>
	{/if}
</ShellPage>
