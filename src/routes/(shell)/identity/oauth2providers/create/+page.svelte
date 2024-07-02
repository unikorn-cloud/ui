<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Create OAuth2 Provider',
		description: 'Create a new oauth2 provider.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { Stepper, Step } from '@skeletonlabs/skeleton';

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Identity from '$lib/openapi/identity';

	let at: InternalToken;
	let organizationID: string;
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

	organizationStore.subscribe((value: string) => (organizationID = value));

	token.subscribe((token: InternalToken) => {
		/* Setup the token on load */
		if (!token || !organizationID) return;

		at = token;

		/* Get top-level resources required for the first step */
		const parameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDOauth2providersGet(parameters)
			.then((v: Array<Identity.Oauth2ProviderRead>) => (providers = v))
			.catch((e: Error) => Clients.error(e));
	});

	$: names = (providers || []).map((x) => x.metadata.name);

	let metadataValid = false;

	/* Cluster name must be valid, and it must be unique */
	$: step1Valid = metadataValid && resource.spec.issuer && resource.spec.clientID;

	function complete() {
		const parameters = {
			organizationID: organizationID,
			oauth2ProviderWrite: resource
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDOauth2providersPost(parameters)
			.then(() => window.location.assign('/identity/oauth2providers'))
			.catch((e: Error) => Clients.error(e));
	}

	import { browser } from '$app/environment';
	import { clipboard } from '@skeletonlabs/skeleton';
</script>

<ShellPage {settings}>
	<Stepper on:complete={complete}>
		<Step locked={!step1Valid}>
			<svelte:fragment slot="header">Let's Get Started!</svelte:fragment>

			<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

			<ShellSection title="OAuth2 Settings">
				<label for="callback"
					>Oauth2 callback address. This is used to configure your OIDC application with before
					continuing with the following fields.</label
				>
				<div id="callback" class="flex gap-4 items-center">
					<div
						data-clipboard="callback"
						class="p-2 overflow-hidden textarea text-ellipsis whitespace-nowrap"
					>
						{browser
							? window.location.protocol + '://' + window.location.hostname + '/oauth2/callback'
							: ''}
					</div>
					<button
						use:clipboard={{ element: 'callback' }}
						class="btn variant-filled-tertiary flex items-center"
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
					bind:value={resource.spec.issuer}
				/>

				<label for="client-id">Client Identifier</label>
				<input
					id="client-id"
					class="input"
					type="text"
					placeholder="73458e95-1d2c-481b-81e8-7225fd089060"
					required
					bind:value={resource.spec.clientID}
				/>

				<label for="client-secret">Client Secret</label>
				<input
					id="client-secret"
					class="input"
					type="text"
					placeholder="ooHovOvanogyisAvChuOvbyctoffOdloidKuAlsyemgosJias3twanechorjIdCo"
					required
					bind:value={resource.spec.clientSecret}
				/>
			</ShellSection>
		</Step>
		<Step>
			<svelte:fragment slot="header">Confirmation</svelte:fragment>

			<p>Create provider "{resource.metadata.name}"?</p>
		</Step>
	</Stepper>
</ShellPage>
