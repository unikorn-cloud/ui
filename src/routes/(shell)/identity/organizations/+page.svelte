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
	import * as Clients from '$lib/clients';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/identity/models';

	let organizations: Models.Organizations;

	token.subscribe((at: string) => {
		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsGet()
			.then((v: Models.Organizations) => (organizations = v))
			.catch((e: Error) => Clients.error(e));
	});

	function providerIcon(provider: string): string {
		if (provider == 'google-identity') return 'logos:google-icon';
		if (provider == 'microsoft-entra') return 'logos:microsoft-icon';
		return '';
	}
</script>

<ShellPage {settings}>
	{#each organizations || [] as resource}
		<article class="bg-surface-50-900-token rounded-lg p-4 flex items-center justify-between gap-8">
			<header class="flex items-center gap-4">
				<h6 class="h6">{resource.name}</h6>
				{#if resource.providerName}
					<iconify-icon icon={providerIcon(resource.providerName)} />
					{resource.domain}
				{/if}
			</header>
		</article>
	{/each}
</ShellPage>
