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

	import type { Token } from '$lib/oauth2';
	import { pat } from '$lib/credentials';

	let token: Token;

	// If there is a PAT in storage, only show it the one time, and remore it
	// immediately.
	pat.subscribe((x: Token) => {
		token = x;
		pat.clear();
	});

	import { clipboard } from '@skeletonlabs/skeleton';
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

	{#if token}
		<h3 class="h3">Your Personal Access Token</h3>
		<p>
			<em>This token will only be shown once, so make a copy and keep it secure.</em>
		</p>
		<div class="flex gap-4 items-center">
			<div
				data-clipboard="pat"
				class="p-2 overflow-hidden textarea text-ellipsis whitespace-nowrap"
			>
				{JSON.stringify(token)}
			</div>
			<button
				use:clipboard={{ element: 'pat' }}
				class="btn variant-ghost-primary flex items-center"
			>
				<iconify-icon icon="mdi:clipboard-outline" />
				<span>Copy</span>
			</button>
		</div>
	{/if}
</ShellPage>
