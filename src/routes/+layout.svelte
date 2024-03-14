<script lang="ts">
	/* Required for styling */
	import '../app.postcss';

	/* Required for agent specific behaviour */
	import { browser } from '$app/environment';

	/* Required for configuration */
	import { oidcClientID, oidcDiscovery } from '$lib/oidc.ts';
	import type { OIDCDiscovery } from '$lib/oidc.ts';

	/* Required for OpenTelemetry */
	import { Resource } from '@opentelemetry/resources';
	import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
	import { BasicTracerProvider } from '@opentelemetry/sdk-trace-base';

	const provider = new BasicTracerProvider({
		resource: new Resource({
			[SemanticResourceAttributes.SERVICE_NAME]: 'unikorn-ui'
		})
	});
	provider.register();

	/* Required for drawers and modals */
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';
	initializeStores();

	/* Required for toasts */
	import { Toast } from '@skeletonlabs/skeleton';

	/* Required for popups */
	import { storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	/* Shell components */
	import { AppShell } from '@skeletonlabs/skeleton';
	import ShellAppBar from '$lib/shell/ShellAppBar.svelte';
	import ShellSideBar from '$lib/shell/ShellSideBar.svelte';
	import ShellDrawer from '$lib/shell/ShellDrawer.svelte';

	/* Authentication */
	import Base64url from 'crypto-js/enc-base64url';
	import SHA256 from 'crypto-js/sha256';
	import { profile, token } from '$lib/credentials.js';

	let claims;

	// Get the ID token first, as we can use it, if it exists to aid login below...
	profile.subscribe((value) => {
		if (!value) {
			claims = null;
			return;
		}

		claims = JSON.parse(value);
	});

	token.subscribe(async (token) => {
		/* When a token isn't set, and its on the browser, do authentication */
		if (token || !browser) {
			return;
		}

		/* Unless it's the oauth2 callback */
		if (window.location.pathname.startsWith('/oauth2/')) {
			return;
		}

		const oidc: OIDCDiscovery = await oidcDiscovery();

		/* Kck off the oauth2/oidc authentication code flow */
		/* TODO: it may be better to use Passport */
		let codeChallengeVerifierBytes = new Uint8Array(32);

		crypto.getRandomValues(codeChallengeVerifierBytes);

		const codeChallengeVerifier = btoa(codeChallengeVerifierBytes);
		const codeChallenge = SHA256(codeChallengeVerifier).toString(Base64url);

		window.sessionStorage.setItem('oauth2_code_challenge_verifier', codeChallengeVerifier);
		window.sessionStorage.setItem('oauth2_location', window.location.pathname);

		// TODO: set a nonce
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: oidcClientID,
			redirect_uri: `${window.location.protocol}//${window.location.host}/oauth2/callback`,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge,
			scope: 'openid email profile'
		});

		// Set the login hint if we can as that avoids the login prompt.
		if (claims) {
			query.set('login_hint', claims.email);
		}

		const url = new URL(oidc.authorization_endpoint);
		url.search = query.toString();

		document.location = url.toString();
	});
</script>

<svelte:head>
	<title>Unikorn Dashboard</title>
	<script src="/js/iconify-icon-1.0.5.min.js"></script>
	<script src="/js/svg-inject.min.js"></script>
</svelte:head>

<Modal />
<Toast />
<ShellDrawer />

<AppShell class="h-screen">
	<svelte:fragment slot="header">
		<ShellAppBar />
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<ShellSideBar class="hidden lg:grid" />
	</svelte:fragment>

	<slot />
</AppShell>
