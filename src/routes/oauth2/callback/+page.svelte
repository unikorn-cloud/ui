<script>
	// The key to security here is to not import anything that could
	// potentially compromise the code or tokens with a supply chain attack,
	// so keep imports deliberately sparse please!
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';

	import { createRemoteJWKSet, jwtVerify } from 'jose';

	import { setCredentials } from '$lib/credentials.js';
	import { compareAccessTokenHash } from '$lib/oidc.js';

	let error;
	let description;

	async function handleCallback() {
		if (!browser) {
			return;
		}

		const location = new URL(window.location.href);

		if (location.searchParams.has('error')) {
			error = location.searchParams.get('error');
			description = location.searchParams.get('description');
			return;
		}

		if (!location.searchParams.has('code')) {
			error = 'server_error';
			description = 'authorization code parameter not specified';
			return;
		}

		const code = location.searchParams.get('code');

		const code_verifier = window.sessionStorage.getItem('oauth2_code_challenge_verifier');
		const form = new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: env.PUBLIC_OAUTH2_CLIENT_ID,
			redirect_uri: `https://${window.location.host}/oauth2/callback`,
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

		const response = await fetch(env.PUBLIC_OAUTH2_TOKEN_ENDPOINT, options);

		const result = await response.json();

		console.log(response);
		console.log(result);

		if (!response.ok) {
			error = result.error;
			description = result.error_description;
			return;
		}

		const jwks = createRemoteJWKSet(new URL(env.PUBLIC_OAUTH2_JWKS_ENDPOINT));

		const jwt = await jwtVerify(result.id_token, jwks, {
			issuer: env.PUBLIC_OAUTH2_ISSUER,
			audience: env.PUBLIC_OAUTH2_CLIENT_ID
		});

		try {
			compareAccessTokenHash(jwt, result.access_token);
		} catch (err) {
			error = 'client_error';
			description = err;
			return;
		}

		await setCredentials(result.access_token, jwt.payload.email);

		window.location = window.sessionStorage.getItem('oauth2_location') || '/';
	}

	handleCallback();
</script>

{#if error}
	<h1>An Error Occurred</h1>
	<dl>
		<dt>Error</dt>
		<dd>{error}</dd>

		<dt>Description</dt>
		<dd>{description}</dd>
	</dl>
{:else}
	<h1>Exchanging Credentials: Just a Moment...</h1>
{/if}
