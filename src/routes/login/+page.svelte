<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import * as Identity from '$lib/openapi/identity';
	import Logo from '$lib/logos/Logo.svelte';

	function login(provider: Identity.Oauth2ProviderType) {
		const providerInput = document.getElementById('provider') as HTMLInputElement;
		if (providerInput) {
			providerInput.value = provider;
		}

		const form = document.getElementById('login_form') as HTMLFormElement;
		if (form) {
			form.submit();
		}
	}
</script>

<div class="grid grid-cols-[1fr_max-content_1fr] grid-rows-[1fr_max-content_1fr] w-full h-screen">
	<div class="col-start-2 row-start-2 flex flex-col gap-8 items-center">
		<header class="h-16 w-auto">
			<Logo class="h-16 w-auto" />
		</header>

		<main class="flex flex-col gap-4 items-center">
			<form id="login_form" class="flex flex-col gap-8" method="post" action={data.callback}>
				<input name="state" type="hidden" value={data.state} />
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
					{#if data.providers.includes(Identity.Oauth2ProviderType.Google)}
						<button
							class="btn preset-tonal-surface border border-surface-500 shadow-lg flex align-center"
							onclick={() => login(Identity.Oauth2ProviderType.Google)}
							onkeypress={() => login(Identity.Oauth2ProviderType.Google)}
							aria-label="Google"
						>
							<iconify-icon icon="logos:google-icon"></iconify-icon>
						</button>
					{/if}
					{#if data.providers.includes(Identity.Oauth2ProviderType.Microsoft)}
						<button
							class="btn preset-tonal-surface border border-surface-500 shadow-lg flex align-center"
							onclick={() => login(Identity.Oauth2ProviderType.Microsoft)}
							onkeypress={() => login(Identity.Oauth2ProviderType.Microsoft)}
							aria-label="Mircosoft"
						>
							<iconify-icon icon="logos:microsoft-icon"></iconify-icon>
						</button>
					{/if}
					{#if data.providers.includes(Identity.Oauth2ProviderType.Github)}
						<button
							class="btn preset-tonal-surface border border-surface-500 shadow-lg flex align-center"
							onclick={() => login(Identity.Oauth2ProviderType.Github)}
							onkeypress={() => login(Identity.Oauth2ProviderType.Github)}
							aria-label="GitHub"
						>
							<iconify-icon icon="logos:github-icon"></iconify-icon>
						</button>
					{/if}
				</div>
			</section>
		</main>
	</div>
</div>
