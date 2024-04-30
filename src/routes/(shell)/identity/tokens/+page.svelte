<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Tokens',
		description: 'Issue access tokens for command line and automation tools.'
	};

	import * as Login from '$lib/login';

	// create starts a new oauth2 flow to get a new access and refresh token.
	function create() {
		Login.loginWithType(Login.LoginType.PAT);
	}

	import { pat, unsetPAT } from '$lib/credentials';

	let patJSON: string;

	// If there is a PAT in storage, only show it the one time, and remore it
	// immediately.
	pat.subscribe((x: string) => {
		console.log(pat);
		console.log(x);
		if (x) {
			patJSON = x;
			unsetPAT();
		}
	});

	$: console.log(patJSON);
</script>

<ShellPage {settings}>
	<button
		class="btn variant-ghost-primary flex gap-2 items-center"
		on:click={create}
		on:keypress={create}
	>
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</button>

	{#if patJSON}
		<h3 class="h3">Your Personal Access Token</h3>
		<p>
			<em>This token will only be shown once, so make a copy and keep it secure.</em>
		</p>
		<code>
			{patJSON}
		</code>
	{/if}
</ShellPage>
