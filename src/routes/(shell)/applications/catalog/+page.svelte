<script lang="ts">
	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';

	const settings: ShellPageSettings = {
		feature: 'Applications',
		name: 'Application Catalog',
		description: 'View platform applications that can be deployed on your infrastructure.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import { token } from '$lib/credentials';
	import { client, error } from '$lib/clients';
	import * as Models from '$lib/openapi/server/models';

	let applications: Models.Applications;

	token.subscribe((at: string): void => {
		if (!at) return;

		client(toastStore, at)
			.apiV1ApplicationsGet()
			.then((v: Models.Applications) => (applications = v))
			.catch((e: Error) => error(e));
	});
</script>

<ShellPage {settings}>
	<section class="flex flex-col gap-4">
		{#each applications || [] as application}
			<article class="bg-surface-50-900-token rounded-lg p-8 flex flex-col gap-8">
				<!-- Application metadata -->
				<header class="flex gap-8">
					<!-- Application logo -->
					<div class="w-16">
						<!-- eslint-disable svelte/no-at-html-tags -->
						{@html atob(application.icon)}
					</div>

					<!-- Application title -->
					<div class="flex flex-col gap-2">
						<div class="flex gap-2">
							{#each application.tags || [] as tag}
								<div class="badge variant-soft">{tag}</div>
							{/each}
						</div>

						<h4 class="h4">{application.humanReadableName}</h4>
					</div>
				</header>

				<!-- Application details -->
				<main>
					<h6 class="h6">Description</h6>
					<p>{application.description}</p>
				</main>
			</article>
		{/each}
	</section>
</ShellPage>

<style>
	:global(svg) {
		height: 100%;
		width: 100%;
	}
</style>
