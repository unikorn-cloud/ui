<script>
	/* Required for styling */
	import '../app.postcss';

	/* Required for agent specific behaviour */
	import { browser } from '$app/environment';

	/* Required for configuration */
	import { env } from '$env/dynamic/public';

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
	import { token } from '$lib/credentials.js';

	token.subscribe((token) => {
		/* When a token isn't set, and its on the browser, do authentication */
		if (token || !browser) {
			return;
		}

		/* Unless it's the oauth2 callback */
		if (window.location.pathname.startsWith('/oauth2/')) {
			return;
		}

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
			client_id: env.PUBLIC_OAUTH2_CLIENT_ID,
			redirect_uri: `https://${window.location.host}/oauth2/callback`,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge,
			scope: 'openid email profile'
		});

		const url = new URL(env.PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT);
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
