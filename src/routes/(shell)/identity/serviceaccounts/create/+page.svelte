<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import MultiSelect from '$lib/forms/MultiSelect.svelte';
	import Button from '$lib/forms/Button.svelte';
	import Clipboard from '$lib/forms/Clipboard.svelte';

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

	let names = $derived((serviceAccounts || []).map((x) => x.metadata.name));

	let resource: Identity.ServiceAccountWrite = $state({
		metadata: {
			name: ''
		},
		spec: {
			groupIDs: []
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
			<Clipboard id="access-token" value={serviceAccount.status.accessToken || ''} />
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
		<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

		<ShellSection title="Access Control">
			{#if resource.spec?.groupIDs}
				<MultiSelect
					id="sa-groups"
					label="Groups"
					hint="Select any groups that the service account should be a member of."
					bind:value={resource.spec.groupIDs}
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
				icon="mdi:tick"
				label="Create"
				class="variant-filled-primary"
				clicked={submit}
				disabled={!valid}
			/>
		</div>
	{/if}
</ShellPage>
