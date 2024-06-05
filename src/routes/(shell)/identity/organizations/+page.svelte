<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Organizations',
		description: 'Manage your organizations.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/identity/models';

	let organizations: Models.Organizations;

	token.subscribe((at: InternalToken) => {
		if (!at) return;

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsGet()
			.then((v: Models.Organizations) => (organizations = v))
			.catch((e: Error) => Clients.error(e));
	});
</script>

<ShellPage {settings}>
	<ShellList>
		{#each organizations || [] as resource}
			<ShellListItem
				metadata={resource.metadata}
				href="/identity/organizations/view/{resource.metadata.id}"
			/>
		{/each}
	</ShellList>
</ShellPage>
