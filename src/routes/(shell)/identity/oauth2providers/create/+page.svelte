<script lang="ts">
	import { run } from 'svelte/legacy';
	import { browser } from '$app/environment';

	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import TextInput from '$lib/forms/TextInput.svelte';
	import Clipboard from '$lib/forms/Clipboard.svelte';
	import Button from '$lib/forms/Button.svelte';
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

	let providers: Array<Identity.Oauth2ProviderRead> | undefined = $state();

	function updateProviders() {
		const parameters = {
			organizationID: organizationInfo.id
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDOauth2providersGet(parameters)
			.then((v: Array<Identity.Oauth2ProviderRead>) => (providers = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateProviders();
	});

	let names = $derived((providers || []).map((x) => x.metadata.name));

	let resource: Identity.Oauth2ProviderWrite = $state({
		metadata: {
			name: ''
		},
		spec: {
			issuer: '',
			clientID: ''
		}
	});

	let metadataValid = $state(false);
	let issuerValid: boolean = $state(false);
	let clientIdValid: boolean = $state(false);
	let clientSecretValid: boolean = $state(false);

	let valid = $derived(metadataValid && issuerValid && clientIdValid && clientSecretValid);

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
</script>

<ShellPage {settings}>
	<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

	<ShellSection title="OAuth2 Settings">
		<label for="callback"
			>Oauth2 callback address. This is used to configure your OIDC application with before
			continuing with the following fields.</label
		>
		<Clipboard id="callback" value={callback} />

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

	<div class="flex">
		<Button
			icon="mdi:tick"
			label="Create"
			class="btn variant-filled-primary"
			clicked={submit}
			disabled={!valid}
		/>
	</div>
</ShellPage>
