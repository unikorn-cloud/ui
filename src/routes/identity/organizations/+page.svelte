<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Organizations',
		description: 'Manage your organizations.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import { identityClient, error } from '$lib/client.ts';
	import { token } from '$lib/credentials.js';
	import * as Models from '$lib/openapi/identity/models';

	let organizations: Models.Organizations;

	token.subscribe((at: string) => {
		identityClient(toastStore, at)
			.apiV1OrganizationsGet()
			.then((v) => (organizations = v))
			.catch((e: Error) => error(e));
	});

	function providerIcon(provider: string): string {
		if (provider == 'google-identity') return 'logos:google-icon';
		if (provider == 'microsoft-entra') return 'logos:microsoft-icon';
		return '';
	}
</script>

<ShellPage {settings}>
	<section class="flex flex-col gap-4">
		{#each organizations || [] as resource}
			<article
				class="bg-surface-50-900-token rounded-lg p-4 flex items-center justify-between gap-8"
			>
				<header class="flex items-center gap-4">
					<iconify-icon icon={providerIcon(resource.providerName)} />
					<h6 class="h6">{resource.name}</h6>
					{resource.domain}
				</header>
			</article>
		{/each}
	</section>
</ShellPage>
