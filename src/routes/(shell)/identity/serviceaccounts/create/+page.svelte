<script lang="ts">
	import { run } from 'svelte/legacy';

	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import { clipboard } from '@skeletonlabs/skeleton';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create Service Account',
		description: 'Create a new service account in the organization.'
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

	let names = $derived((serviceAccounts || []).map((x) => x.metadata.name));

	let resource: Identity.ServiceAccountWrite = $state({
		metadata: {
			name: ''
		}
	});

	/* Cluster name must be valid, and it must be unique */
	let metadataValid = $state(false);

	let valid = $derived(metadataValid);

	let serviceAccount: Identity.ServiceAccountCreate | undefined = $state();

	function submit() {
		const parameters = {
			organizationID: organizationInfo.id,
			serviceAccountWrite: resource
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDServiceaccountsPost(parameters)
			.then((v: Identity.ServiceAccountCreate) => (serviceAccount = v))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#if serviceAccount}
		<ShellViewHeader metadata={serviceAccount.metadata} />

		<ShellSection title="Access Token">
			<p>
				<em>This token will only be shown once, so make a copy and keep it secure.</em>
			</p>
			<div class="flex gap-4 items-center">
				<div
					data-clipboard="pat"
					class="p-2 overflow-hidden textarea text-ellipsis whitespace-nowrap"
				>
					{serviceAccount.status.accessToken}
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
	{:else}
		<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

		<button
			class="btn variant-filled-primary flex gap-2 items-center"
			disabled={!valid}
			onclick={submit}
			onkeypress={submit}
		>
			Create
		</button>
	{/if}
</ShellPage>
