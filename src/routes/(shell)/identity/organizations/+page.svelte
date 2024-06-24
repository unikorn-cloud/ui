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
	import * as Identity from '$lib/openapi/identity';

	let organizations: Array<Identity.OrganizationRead>;

	token.subscribe((at: InternalToken) => {
		if (!at) return;

		Clients.identity(toastStore, at)
			.apiV1OrganizationsGet()
			.then((v: Array<Identity.OrganizationRead>) => (organizations = v))
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
