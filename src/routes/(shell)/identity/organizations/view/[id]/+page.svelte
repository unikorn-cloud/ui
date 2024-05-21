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
	import * as Models from '$lib/openapi/identity/models';

	let at: InternalToken;

	token.subscribe((token: InternalToken) => (at = token));

	let organization: Models.Organization;

	let providers: Models.Oauth2Providers;

	function update(at: InternalToken) {
		if (!at) return;

		const parameters = {
			organization: $page.params.id
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationGet(parameters)
			.then((v: Models.Organization) => (organization = v))
			.catch((e: Error) => Clients.error(e));

		Clients.identityClient(toastStore, at)
			.apiV1Oauth2providersGet()
			.then((v: Models.Oauth2Providers) => (providers = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: update(at);

	function submit() {
		// Perform any cleanup actions.
		// TODO: Is there a more idiomatic way of doing this?
		if (organization.organizationType == Models.OrganizationType.Adhoc) {
			delete organization['domain'];
			delete organization['providerScope'];
			delete organization['providerName'];
		}

		if (organization.googleCustomerID === '') delete organization['googleCustomerID'];

		const parameters = {
			organization: $page.params.id,
			organization2: organization
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationPut(parameters)
			.then(() => window.location.assign('/identity/organizations'))
			.catch((e: Error) => Clients.error(e));
	}

	import { clipboard } from '@skeletonlabs/skeleton';
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
				{#each Object.entries(Models.OrganizationType) as [symbol, value]}
					<option {value}>{symbol}</option>
				{/each}
			</select>
		</ShellSection>

		{#if organization.organizationType == Models.OrganizationType.Domain}
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
					{#each Object.entries(Models.ProviderScope) as [symbol, value]}
						<option {value}>{symbol}</option>
					{/each}
				</select>

				{#if organization.providerScope == Models.ProviderScope.Global}
					<label for="global-idp"
						>Identity provider to use. Selecting <em>Custom</em> will allow you to use your own OIDC
						compliant identity service.</label
					>
					<select class="select" bind:value={organization.providerName}>
						{#each providers || [] as p}
							<option value={p.name}>{p.displayName}</option>
						{/each}
					</select>

					{#if ((providers || []).find((x) => x.name == organization.providerName) || {}).type == Models.Oauth2ProviderType.Google}
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
					<label for="callback"
						>Oauth2 callback address. This is used to configure your OIDC application with before
						continuing with the following fields.</label
					>
					<div id="callback" class="flex gap-4 items-center">
						<div
							data-clipboard="pat"
							class="p-2 overflow-hidden textarea text-ellipsis whitespace-nowrap"
						>
							{window.location.protocol + '://' + window.location.hostname + '/oauth2/callback'}
						</div>
						<button
							use:clipboard={{ element: 'pat' }}
							class="btn variant-ghost-primary flex items-center"
						>
							<iconify-icon icon="mdi:clipboard-outline" />
							<span>Copy</span>
						</button>
					</div>

					<label for="issuer"
						>Issuer address. This is the base address used to derive the <em
							>/.well-known/openid-configuration</em
						> endpoint</label
					>
					<input
						id="issuer"
						class="input"
						type="url"
						placeholder="https://identity.domain.com"
						required
					/>

					<label for="client-id">Client Identifier</label>
					<input
						id="client-id"
						class="input"
						type="text"
						placeholder="73458e95-1d2c-481b-81e8-7225fd089060"
						required
					/>

					<label for="client-secret">Client Secret</label>
					<input
						id="client-secret"
						class="input"
						type="text"
						placeholder="ooHovOvanogyisAvChuOvbyctoffOdloidKuAlsyemgosJias3twanechorjIdCo"
						required
					/>
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
