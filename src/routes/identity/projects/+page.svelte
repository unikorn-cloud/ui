<script lang="ts">
	import { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Projects',
		description: 'Manage your resources.'
	};

	import { onDestroy } from 'svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { getModalStore, ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	/* Client setup */
	import { client, error } from '$lib/client.ts';
	import { token } from '$lib/credentials.js';
	import * as Models from '$lib/openapi/server/models';
	import * as Api from '$lib/openapi/server/apis';

	let at: string;

	let resources: Models.Projects;

	function update(): void {
		client(toastStore, at)
			.apiV1ProjectsGet()
			.then((v) => (resources = v))
			.catch((e: Error) => error(e));
	}

	token.subscribe((token: string) => {
		/* Setup the token on load */
		if (!token) return;
		at = token;

		update();

		const ticker = setInterval(update, 5000);
		onDestroy(() => clearInterval(ticker));
	});

	function remove(resource: Models.Project): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing project "${resource.name}" will also remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters: Api.ApiV1ProjectsProjectNameDeleteRequest = {
					projectName: resource.name
				};

				client(toastStore, at)
					.apiV1ProjectsProjectNameDelete(parameters)
					.catch((e: Error) => error(e));
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
				<h6 class="h6">{resource.name}</h6>
			</header>

			<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
				<iconify-icon icon="mdi:close" />
			</button>
		</article>
	{/each}
</ShellPage>
