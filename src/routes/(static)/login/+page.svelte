<script lang="ts">
	import { browser } from '$app/environment';

	import Logo from '$lib/logos/Logo.svelte';

	// POST address from the authention server.
	let callback: string = $state('#');
	// State from the authentication server.
	let serverState: string = $state('undefined');

	// Get state from the authentication server.
	if (browser) {
		const location = new URL(window.location.href);

		if (location.searchParams.has('callback')) {
			callback = location.searchParams.get('callback') || 'undefined';
		}

		if (location.searchParams.has('state')) {
			serverState = location.searchParams.get('state') || 'undefined';
		}
	}

	function login(provider: string) {
		const providerInput = document.getElementById('provider') as HTMLInputElement;
		if (providerInput) {
			providerInput.value = provider;
		}

		const form = document.getElementById('login_form') as HTMLFormElement;
		if (form) {
			form.submit();
		}
	}

	function google() {
		login('google');
	}

	function microsoft() {
		login('microsoft');
	}
</script>

<div class="w-screen h-screen lg:w-96 p-8 flex flex-col gap-8 rounded bg-surface-100-800-token">
	<header id="login-header">
		<Logo />
	</header>
	<main>
		<form id="login_form" class="flex flex-col gap-8" method="post" action={callback}>
			<input name="state" type="hidden" value={serverState} />
			<input id="provider" name="provider" type="hidden" />

			<section class="flex flex-col gap-4">
				<p>enter your email address if your organization requires a domain login</p>
				<input
					class="input"
					name="email"
					type="email"
					placeholder="jane.doe@acme.com"
					autocomplete="email"
				/>
				<input class="btn variant-filled-primary" type="submit" value="Login" />
			</section>

			<section class="flex flex-col gap-4">
				<p>or login with your chosen provider</p>
				<button
					class="btn variant-filled-primary flex align-center"
					onclick={google}
					onkeypress={google}
				>
					<iconify-icon icon="logos:google-icon"></iconify-icon>
					<span>Google</span>
				</button>
				<button
					class="btn variant-filled-primary flex align-center"
					onclick={microsoft}
					onkeypress={microsoft}
				>
					<iconify-icon icon="logos:microsoft-icon"></iconify-icon>
					<span>Microsoft</span>
				</button>
			</section>
		</form>
	</main>
</div>

<style>
	#login-header > :global(svg) {
		height: 2em;
		width: auto;
	}
</style>
