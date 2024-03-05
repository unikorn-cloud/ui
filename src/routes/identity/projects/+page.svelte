<script lang="ts">
	import { ShellPageSettings } from '$lib/layouts/types.ts';

	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Projects',
		description: 'Manage your projects.'
	};

	import { getModalStore, ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	/* Client setup */
	import { client, error } from '$lib/client.ts';
	import { token } from '$lib/credentials.js';
	import * as Models from '$lib/openapi/server/models';
	import * as Api from '$lib/openapi/server/apis';

	let at: string;

	let projects: Models.Projects;

	function update(): void {
		client(at)
			.apiV1ProjectsGet()
			.then((v) => (projects = v))
			.catch((e: Error) => error(e));
	}

	token.subscribe(async (token: string) => {
		/* Setup the token on load */
		if (!token) return;
		at = token;

		update();
		setInterval(update, 5000);
	});

	function remove(name: string): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing project "${name}" will also remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters: Api.ApiV1ProjectsProjectNameDeleteRequest = {
					projectName: name
				};

				client(at)
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

	{#each projects || [] as project}
		<article class="bg-surface-50-900-token rounded-lg p-4 flex items-center justify-between gap-8">
			<header class="flex items-center gap-4">
				<StatusIcon status={project.status.status} />
				<h6 class="h6">{project.name}</h6>
			</header>

			<button on:click={() => remove(project.name)} on:keypress={() => remove(project.name)}>
				<iconify-icon icon="mdi:close" />
			</button>
		</article>
	{/each}
</ShellPage>
