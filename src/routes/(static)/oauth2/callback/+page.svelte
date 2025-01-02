<script lang="ts">
	// The key to security here is to not import anything that could
	// potentially compromise the code or tokens with a supply chain attack,
	// so keep imports deliberately sparse please!
	import { browser } from '$app/environment';

	/* Required for configuration */
	import * as OIDC from '$lib/oidc';
	import type { InternalToken, Token } from '$lib/oauth2';

	/* Required for verification */
	import { createRemoteJWKSet, jwtVerify } from 'jose';
	import Base64url from 'crypto-js/enc-base64url';
	import SHA256 from 'crypto-js/sha256';

	import { setCredentials, pat } from '$lib/credentials';
	import * as Login from '$lib/login';

	let error: string | undefined = $state();
	let description: string | undefined = $state();

	async function handleCallback() {
		if (!browser) {
			return;
		}

		const location = new URL(window.location.href);

		const nonce = window.sessionStorage.getItem('oidc_nonce');
		window.sessionStorage.removeItem('oidc_nonce');

		const code_verifier = window.sessionStorage.getItem('oauth2_code_challenge_verifier');
		window.sessionStorage.removeItem('oauth2_code_challenge_verifier');

		if (!nonce) {
			error = 'client_error';
			description = 'nonce not present in session storage, possibly a replay attack';
			return;
		}

		if (!code_verifier) {
			error = 'client_error';
			description = 'code verifier not present in session storage, possibly a replay attack';
			return;
		}

		if (location.searchParams.has('error')) {
			error = location.searchParams.get('error') || 'server_error';
			description = location.searchParams.get('error_description') || 'no description provided';
			return;
		}

		if (!location.searchParams.has('code')) {
			error = 'server_error';
			description = 'authorization code parameter not specified';
			return;
		}

		if (!location.searchParams.has('state')) {
			error = 'server_error';
			description = 'state parameter not specified';
			return;
		}

		const code = location.searchParams.get('code') || '';

		const stateJSON = location.searchParams.get('state') || '';

		const state: Login.Oauth2State = JSON.parse(stateJSON);

		const discovery = await OIDC.discovery();

		const form = new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: OIDC.clientID,
			redirect_uri: `${window.location.protocol}//${window.location.host}/oauth2/callback`,
			code: code,
			code_verifier: code_verifier
		});

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: form.toString()
		};

		const response = await fetch(discovery.token_endpoint, options);

		const result = await response.json();

		if (!response.ok) {
			error = result.error;
			description = result.error_description;
			return;
		}

		const jwks = createRemoteJWKSet(new URL(discovery.jwks_uri));

		const jwt = await jwtVerify(result.id_token, jwks, {
			issuer: discovery.issuer,
			audience: OIDC.clientID
		});

		const id_token = jwt.payload as OIDC.IDToken;

		if (id_token.nonce != SHA256(nonce).toString(Base64url)) {
			error = 'client_error';
			description = 'id_token nonce does not match, replay attack detected';
			return;
		}

		try {
			OIDC.compareAccessTokenHash(jwt, result.access_token);
		} catch (err) {
			error = 'client_error';

			if (err instanceof Error) {
				description = err.message;
				return;
			}

			description = String(err);
			return;
		}

		if (state.type == Login.LoginType.Normal) {
			const token = result as InternalToken;

			// Set the expiry time so we know when to perform a rotation.
			// Add a little wiggle room in there to account for any latency.
			const expiry = new Date(Date.now());

			expiry.setSeconds(expiry.getSeconds() + token.expires_in - 60);
			token.expiry = expiry.toJSON();

			setCredentials(token, id_token);
		} else if (state.type == Login.LoginType.PAT) {
			pat.set(result as Token);
		}

		window.location.assign(window.sessionStorage.getItem('oauth2_location') || '/');
	}

	handleCallback();
</script>

{#if error}
	<h1 class="h1">An Error Occurred</h1>
	<dl>
		<dt>Error</dt>
		<dd>{error}</dd>

		<dt>Description</dt>
		<dd>{description}</dd>
	</dl>
{:else}
	<h1 class="h1">Exchanging Credentials: Just a Moment...</h1>
{/if}
