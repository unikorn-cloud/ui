<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import TextInput from '$lib/forms/TextInput.svelte';
	import Select from '$lib/forms/Select.svelte';
	import * as Validation from '$lib/validation';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'View/Update Organization',
		description: 'Manage your organization.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';

	let at: InternalToken;

	token.subscribe((token: InternalToken) => (at = token));

	import { organizationStore } from '$lib/stores';

	let organizationID: string;

	organizationStore.subscribe((value: string) => (organizationID = value));

	let organization: Identity.OrganizationRead;

	let providers: Array<Identity.Oauth2ProviderRead>;

	let organizationProviders: Array<Identity.Oauth2ProviderRead>;

	function update(at: InternalToken, organizationID: string) {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDGet(parameters)
			.then((v: Identity.OrganizationRead) => (organization = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1Oauth2providersGet()
			.then((v: Array<Identity.Oauth2ProviderRead>) => (providers = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDOauth2providersGet(parameters)
			.then((v: Array<Identity.Oauth2ProviderRead>) => (organizationProviders = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at, organizationID);

	function submit() {
		// Update the organization.
		// TODO: input validation!
		const parameters = {
			organizationID: organizationID,
			organizationWrite: organization
		};

		// TODO: may want to raise a toast here as we don't redirect.
		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDPut(parameters)
			.catch((e: Error) => Clients.error(e));
	}

	function getOauth2ProviderType(
		providers: Array<Identity.Oauth2ProviderRead>,
		organization: Identity.OrganizationRead
	): Identity.Oauth2ProviderType | undefined {
		if (!providers || !organization) return undefined;

		const provider = providers.find((x) => x.metadata.id == organization.spec.providerID);
		if (!provider) return undefined;

		return provider.spec.type;
	}

	let metadataValid: boolean = false;
	let domainValid: boolean = false;

	let valid: boolean = false;

	$: valid =
		metadataValid && organization.spec.organizationType == Identity.OrganizationType.Domain
			? domainValid
			: true;

	$: oauth2ProviderType = getOauth2ProviderType(providers, organization);
</script>

<ShellPage {settings}>
	{#if organization}
		<ShellViewHeader metadata={organization.metadata} />
		<ShellMetadataSection metadata={organization.metadata} names={[]} bind:valid={metadataValid} />

		<ShellSection title="Authentication Type">
			<Select
				id="organization-type"
				label="Select your organization type."
				hint="When domain authentication is selected, users will
                                login with an email address, and be routed to the correct identity provider for your
                                organization. Using this option allows the use of custom OIDC servers for authentication,
                                and mapping of groups from your identity provider to native RBAC groups. When adhoc
                                authentication is selected, users will login by selected their generic provider explicitly e.g.
				Google or Microsoft, and must be manually added to groups."
				bind:value={organization.spec.organizationType}
			>
				{#each Object.entries(Identity.OrganizationType) as [symbol, value]}
					<option {value}>{symbol}</option>
				{/each}
			</Select>
		</ShellSection>

		{#if organization.spec.organizationType == Identity.OrganizationType.Domain}
			<ShellSection title="Email Domain">
				<TextInput
					id="domain"
					label="Your email domain."
					hint="To ensure you own the domain we require you to update
					your DNS server with a TXT record unikorn-site-verification to your root domain."
					placeholder="acme.corp"
					validators={[Validation.stringSet]}
					bind:value={organization.spec.domain}
					bind:valid={domainValid}
				/>
			</ShellSection>

			<ShellSection title="Identity Provider">
				<Select
					id="idp-scope"
					label="Identity provider type."
					hint="Selecting global enables the use of predefined globally
                                        available identity providers such as Google or Microsoft. Selecting organization allows
					you to define your own identity provider for the organization."
					bind:value={organization.spec.providerScope}
				>
					{#each Object.entries(Identity.ProviderScope) as [symbol, value]}
						<option {value}>{symbol}</option>
					{/each}
				</Select>

				{#if organization.spec.providerScope == Identity.ProviderScope.Global}
					<Select
						id="global-idp"
						label="Identity provider to use."
						bind:value={organization.spec.providerID}
					>
						{#each providers || [] as p}
							<option value={p.metadata.id}>{p.metadata.description}</option>
						{/each}
					</Select>

					{#if oauth2ProviderType == Identity.Oauth2ProviderType.Google}
						<TextInput
							id="google-cluster-id"
							label="Your Google customer ID."
							hint="This can be obtained from the Google admin console."
							placeholder="x83hRso7"
							bind:value={organization.spec.googleCustomerID}
						/>
					{/if}
				{:else}
					<!-- TODO: allow inline creation for better UX -->
					<label for="global-idp">Identity provider to use.</label>
					<select class="select" bind:value={organization.spec.providerID}>
						{#each organizationProviders || [] as p}
							<option value={p.metadata.id}>{p.metadata.name}</option>
						{/each}
					</select>
				{/if}
			</ShellSection>
		{/if}

		<button
			class="btn variant-filled-tertiary flex gap-2 items-center self-end"
			disabled={!valid}
			on:click={submit}
			on:keypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
