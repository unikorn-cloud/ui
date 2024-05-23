<script lang="ts">
	import { page } from '$app/stores';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';
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

	let organization: Identity.Organization;

	let providers: Identity.Oauth2Providers;

	let organizationProviders: Identity.Oauth2Providers;

	function update(at: InternalToken) {
		if (!at) return;

		const parameters = {
			organization: $page.params.id
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationGet(parameters)
			.then((v: Identity.Organization) => (organization = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identityClient(toastStore, at)
			.apiV1Oauth2providersGet()
			.then((v: Identity.Oauth2Providers) => (providers = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationOauth2providersGet(parameters)
			.then((v: Identity.Oauth2Providers) => (organizationProviders = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at);

	function submit() {
		// Update the organization.
		// TODO: input validation!
		const parameters = {
			organization: $page.params.id,
			organization2: organization
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationPut(parameters)
			.then(() => window.location.assign('/identity/organizations'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#if organization}
		<h2 class="h2">{organization.name}</h2>

		<ShellSection title="Authentication Type">
			<label for="organization-type"
				>Select authentication type. When <em>domain</em> authentication is selected, users will
				login with an email address, and be routed to the correct identity provider for your
				organization. Using this option allows the use of custom OIDC servers for authentication,
				and mapping of groups from your identity provider to native RBAC groups. When <em>adhoc</em>
				authentication is selected, users will login by selected their generic provider explicitly e.g.
				Google or Microsoft, and must be manually added to groups.
			</label>
			<select id="organization-type" class="select" bind:value={organization.organizationType}>
				{#each Object.entries(Identity.OrganizationType) as [symbol, value]}
					<option {value}>{symbol}</option>
				{/each}
			</select>
		</ShellSection>

		{#if organization.organizationType == Identity.OrganizationType.Domain}
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
					bind:value={organization.domain}
				/>
			</ShellSection>

			<ShellSection title="Identity Provider">
				<label for="idp-scope">
					Provider type to use. Selecting <em>global</em> enables the use of predefined globally
					available identity providers such as Google or Microsoft. Selecting <em>organization</em> allows
					you to define your own identity provider for the organization.
				</label>
				<select class="select" bind:value={organization.providerScope}>
					{#each Object.entries(Identity.ProviderScope) as [symbol, value]}
						<option {value}>{symbol}</option>
					{/each}
				</select>

				{#if organization.providerScope == Identity.ProviderScope.Global}
					<label for="global-idp">Identity provider to use.</label>
					<select class="select" bind:value={organization.providerName}>
						{#each providers || [] as p}
							<option value={p.name}>{p.displayName}</option>
						{/each}
					</select>

					{#if ((providers || []).find((x) => x.name == organization.providerName) || {}).type == Identity.Oauth2ProviderType.Google}
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
							bind:value={organization.googleCustomerID}
						/>
					{/if}
				{:else}
					<!-- TODO: allow inline creation for better UX -->
					<label for="global-idp">Identity provider to use.</label>
					<select class="select" bind:value={organization.providerName}>
						{#each organizationProviders || [] as p}
							<option value={p.name}>{p.displayName}</option>
						{/each}
					</select>
				{/if}
			</ShellSection>
		{/if}

		<button
			class="btn variant-ghost-primary flex gap-2 items-center"
			on:click={submit}
			on:keypress={submit}
		>
			Update
		</button>
	{/if}
</ShellPage>
