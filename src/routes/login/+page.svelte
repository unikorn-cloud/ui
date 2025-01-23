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

	function github() {
		login('github');
	}
</script>

<div class="grid grid-cols-[1fr_max-content_1fr] grid-rows-[1fr_max-content_1fr] w-full h-screen">
	<div class="col-start-2 row-start-2 flex flex-col gap-8 items-center">
		<header class="h-16 w-auto">
			<Logo class="h-16 w-auto" />
		</header>

		<main class="flex flex-col gap-4 items-center">
			<form id="login_form" class="flex flex-col gap-8" method="post" action={callback}>
				<input name="state" type="hidden" value={serverState} />
				<input id="provider" name="provider" type="hidden" />

				<section class="flex flex-col gap-4 items-center">
					<p>Enter your email address</p>

					<input
						class="input shadow-lg"
						name="email"
						type="email"
						placeholder="jane.doe@acme.com"
						autocomplete="email"
						required
					/>
				</section>
			</form>

			<em class="text-surface-400">or</em>

			<section class="flex flex-col gap-4">
				<p>Choose a generic provider</p>

				<div class="flex justify-center gap-4">
					<button
						class="btn variant-ghost-surface shadow-lg flex align-center"
						onclick={google}
						onkeypress={google}
						aria-label="Google"
					>
						<iconify-icon icon="logos:google-icon"></iconify-icon>
					</button>
					<button
						class="btn variant-ghost-surface shadow-lg flex align-center"
						onclick={microsoft}
						onkeypress={microsoft}
						aria-label="Mircosoft"
					>
						<iconify-icon icon="logos:microsoft-icon"></iconify-icon>
					</button>
					<button
						class="btn variant-ghost-surface shadow-lg flex align-center"
						onclick={github}
						onkeypress={github}
						aria-label="GitHub"
					>
						<iconify-icon icon="logos:github-icon"></iconify-icon>
					</button>
				</div>
			</section>
		</main>
	</div>
</div>
