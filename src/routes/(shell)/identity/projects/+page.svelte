<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Projects',
		description: 'Manage your resources.'
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

	let resources: Models.Projects;

	function update(): void {
		if (!at || !organization) return;

		const parameters = {
			organization: organization
		};

		Clients.identityClient(toastStore, at)
			.apiV1OrganizationsOrganizationProjectsGet(parameters)
			.then((v: Models.Projects) => (resources = v))
			.catch((e: Error) => Clients.error(e));
	}

	function remove(resource: Models.Project): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing project "${resource.spec.name}" will also remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organization: organization,
					project: resource.spec.name
				};

				Clients.identityClient(toastStore, at)
					.apiV1OrganizationsOrganizationProjectsProjectDelete(parameters)
					.catch((e: Error) => Clients.error(e));
			}
		};

		modalStore.trigger(modal);
	}

	import StatusIcon from '$lib/StatusIcon.svelte';
</script>

<ShellPage {settings}>
	<a href="/identity/projects/create" class="btn variant-ghost-primary flex gap-2 items-center">
		<iconify-icon icon="material-symbols:add" />
		<span>Create</span>
	</a>

	{#each resources || [] as resource}
		<article class="bg-surface-50-900-token rounded-lg p-4 flex items-center justify-between gap-8">
			<header class="flex items-center gap-4">
				<StatusIcon metadata={resource.metadata} />
				<h6 class="h6">{resource.spec.name}</h6>
			</header>

			<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
				<iconify-icon icon="mdi:close" />
			</button>
		</article>
	{/each}
</ShellPage>
