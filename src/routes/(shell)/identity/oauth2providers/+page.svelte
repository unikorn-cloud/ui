<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'OAuth2 Providers',
		description: 'Manage your OAuth2 providers.'
	};

	import { onDestroy } from 'svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/identity/models';

	let at: InternalToken;

	let organization: string;

	token.subscribe((token: InternalToken) => {
		at = token;
		update();

		const ticker = setInterval(update, 5000);
		onDestroy(() => clearInterval(ticker));
	});

	organizationStore.subscribe((value: string) => {
		organization = value;
		update();
	});

	let resources: Models.Oauth2Providers;

	function update(): void {
		if (!at || !organization) return;

		const parameters = {
			organization: organization
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationOauth2providersGet(parameters)
			.then((v: Models.Oauth2Providers) => (resources = v))
			.catch((e: Error) => Clients.error(e));
	}

	function remove(resource: Models.Oauth2Provider): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organization: organization,
					provider: resource.name
				};

				Clients.identityClient(toastStore, at)
					.apiV1OrganizationsOrganizationOauth2providersProviderDelete(parameters)
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}
</script>

<ShellPage {settings}>
	<a
		href="/identity/oauth2providers/create"
		class="btn variant-ghost-primary flex gap-2 items-center"
	>
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</a>

	<ShellList>
		{#each resources || [] as resource}
			<ShellListItem>
				<header class="flex items-center gap-4">
					<a class="font-bold" href="/identity/oauth2providers/view/{resource.name}"
						>{resource.name}</a
					>
					<em>{resource.displayName}</em>
				</header>

				<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
					<iconify-icon icon="mdi:close" />
				</button>
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
