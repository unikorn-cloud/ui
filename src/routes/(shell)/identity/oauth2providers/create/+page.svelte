<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import TextInput from '$lib/forms/TextInput.svelte';
	import * as Validation from '$lib/validation';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create OAuth2 Provider',
		description: 'Create a new oauth2 provider.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';
	import * as Stores from '$lib/stores';

	let at: InternalToken;
	let organizationInfo: Stores.OrganizationInfo;
	let providers: Array<Identity.Oauth2ProviderRead>;

	let resource: Identity.Oauth2ProviderWrite = {
		metadata: {
			name: ''
		},
		spec: {
			issuer: '',
			clientID: ''
		}
	};

	Stores.organizationStore.subscribe(
		(value: Stores.OrganizationInfo) => (organizationInfo = value)
	);

	token.subscribe((token: InternalToken) => {
		/* Setup the token on load */
		if (!token || !organizationInfo) return;

		at = token;

		/* Get top-level resources required for the first step */
		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDOauth2providersGet(parameters)
			.then((v: Array<Identity.Oauth2ProviderRead>) => (providers = v))
			.catch((e: Error) => Clients.error(e));
	});

	$: names = (providers || []).map((x) => x.metadata.name);

	let metadataValid = false;
	let issuerValid: boolean = false;
	let clientIdValid: boolean = false;
	let clientSecretValid: boolean = false;

	$: valid = metadataValid && issuerValid && clientIdValid && clientSecretValid;

	function submit() {
		const parameters = {
			organizationID: organizationInfo.id,
			oauth2ProviderWrite: resource
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDOauth2providersPost(parameters)
			.then(() => window.location.assign('/identity/oauth2providers'))
			.catch((e: Error) => Clients.error(e));
	}

	var callback: string = browser
		? window.location.protocol + '://' + window.location.hostname + '/oauth2/callback'
		: '';

	import { browser } from '$app/environment';
	import { clipboard } from '@skeletonlabs/skeleton';
</script>

<ShellPage {settings}>
	<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

	<ShellSection title="OAuth2 Settings">
		<label for="callback"
			>Oauth2 callback address. This is used to configure your OIDC application with before
			continuing with the following fields.</label
		>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<input
				class="input overflow-hidden text-ellipsis whitespace-nowrap"
				data-clipboard="callback"
				value={callback}
				disabled
			/>
			<button class="variant-filled-primary" use:clipboard={{ input: 'callback' }}>
				<iconify-icon icon="mdi:clipboard-outline" />
			</button>
		</div>

		<TextInput
			id="issuer"
			label="Issuer address"
			validators={[Validation.stringSet]}
			placeholder="https://identity.domain.com"
			bind:value={resource.spec.issuer}
			bind:valid={issuerValid}
		/>
		<TextInput
			id="client-id"
			label="Client ID"
			validators={[Validation.stringSet]}
			placeholder="73458e95-1d2c-481b-81e8-7225fd089060"
			bind:value={resource.spec.clientID}
			bind:valid={clientIdValid}
		/>
		<TextInput
			id="client-secret"
			label="Client secret"
			validators={[Validation.stringSet]}
			placeholder="ooHovOvanogyisAvChuOvbyctoffOdloidKuAlsyemgosJias3twanechorjIdCo"
			bind:value={resource.spec.clientSecret}
			bind:valid={clientSecretValid}
		/>
	</ShellSection>

	<button
		class="btn variant-filled-primary flex gap-2 items-center"
		disabled={!valid}
		on:click={submit}
		on:keypress={submit}
	>
		Create
	</button>
</ShellPage>
