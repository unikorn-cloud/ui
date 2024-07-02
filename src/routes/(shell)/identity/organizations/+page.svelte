<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellViewHeader from '$lib/layouts/ShellViewHeader.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

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

	$: oauth2ProviderType = getOauth2ProviderType(providers, organization);
</script>

<ShellPage {settings}>
	{#if organization}
		<ShellViewHeader metadata={organization.metadata} />
		<ShellMetadataSection metadata={organization.metadata} names={[]} />

		<ShellSection title="Authentication Type">
			<label for="organization-type"
				>Select authentication type. When <em>domain</em> authentication is selected, users will
				login with an email address, and be routed to the correct identity provider for your
				organization. Using this option allows the use of custom OIDC servers for authentication,
				and mapping of groups from your identity provider to native RBAC groups. When <em>adhoc</em>
				authentication is selected, users will login by selected their generic provider explicitly e.g.
				Google or Microsoft, and must be manually added to groups.
			</label>
			<select id="organization-type" class="select" bind:value={organization.spec.organizationType}>
				{#each Object.entries(Identity.OrganizationType) as [symbol, value]}
					<option {value}>{symbol}</option>
				{/each}
			</select>
		</ShellSection>

		{#if organization.spec.organizationType == Identity.OrganizationType.Domain}
			<ShellSection title="Email Domain">
				<label for="domain"
					>Domain name you are registering. To ensure you own the domain we require you to update
					your DNS server with a TXT record <em>unikorn-site-verification</em> to your root domain.</label
				>
				<input
					id="domain"
					class="input"
					placeholder="acme.corp"
					required
					bind:value={organization.spec.domain}
				/>
			</ShellSection>

			<ShellSection title="Identity Provider">
				<label for="idp-scope">
					Provider type to use. Selecting <em>global</em> enables the use of predefined globally
					available identity providers such as Google or Microsoft. Selecting <em>organization</em> allows
					you to define your own identity provider for the organization.
				</label>
				<select class="select" bind:value={organization.spec.providerScope}>
					{#each Object.entries(Identity.ProviderScope) as [symbol, value]}
						<option {value}>{symbol}</option>
					{/each}
				</select>

				{#if organization.spec.providerScope == Identity.ProviderScope.Global}
					<label for="global-idp">Identity provider to use.</label>
					<select class="select" bind:value={organization.spec.providerID}>
						{#each providers || [] as p}
							<option value={p.metadata.id}>{p.metadata.name}</option>
						{/each}
					</select>

					{#if oauth2ProviderType == Identity.Oauth2ProviderType.Google}
						<label for="customer-id">
							Your Google customer ID. This can be obtained from the <a
								href="https://admin.google.com">Google admin console</a
							>. This field is optional, providing a customer ID will allow the identity service to
							discover organization groups that can be used to control RBAC.
						</label>
						<input
							id="customer-id"
							class="input"
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
			on:click={submit}
			on:keypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
