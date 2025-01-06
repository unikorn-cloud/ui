<script lang="ts">
	import { run } from 'svelte/legacy';

	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';

	const settings: ShellPageSettings = {
		feature: 'Applications',
		name: 'Application Catalog',
		description: 'View platform applications that can be deployed on your infrastructure.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	/* Client setup */
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Clients from '$lib/clients';
	import * as Application from '$lib/openapi/application';
	import * as Stores from '$lib/stores';

	// Grab the organization scope.
	let organizationInfo = $state() as Stores.OrganizationInfo;

	Stores.organizationStore.subscribe((value: Stores.OrganizationInfo) => {
		organizationInfo = value;
	});

	// Grab the acces token.
	let at = $state() as InternalToken;

	token.subscribe((token: InternalToken): void => {
		at = token;
	});

	let applications: Array<Application.ApplicationRead> | undefined = $state();

	function updateApplications(at: InternalToken, organizationInfo: Stores.OrganizationInfo) {
		if (!at || !organizationInfo) return;

		const parameters = {
			organizationID: organizationInfo.id,
			projectID: 'TODO'
		};

		Clients.application(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDApplicationsGet(parameters)
			.then((v: Array<Application.ApplicationRead>) => (applications = v))
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateApplications(at, organizationInfo);
	});

	function applicationCategories(app: Application.ApplicationRead): Array<string> {
		if (!app.metadata.tags) return [];

		const categories = app.metadata.tags.find(
			(x) => x.name == 'application.unikorn-cloud.org/category'
		);
		if (!categories) return [];

		return categories.value.split(',');
	}
</script>

<ShellPage {settings}>
	<ShellList>
		{#if applications}
			{#each applications as application}
				<div
					class="card bg-surface-50-900-token border border-surface-300-600-token shadow-sm p-4 flex gap-8"
				>
					<div class="w-16">
						<!-- eslint-disable svelte/no-at-html-tags -->
						{@html atob(application.spec.icon)}
					</div>

					<div class="flex flex-col gap-2">
						<div class="flex gap-2">
							{#each applicationCategories(application) as category}
								<div class="badge variant-soft">{category}</div>
							{/each}
						</div>

						<h4 class="h4">{application.metadata.name}</h4>
						<div class="text-xs italic">{application.metadata.description}</div>
					</div>
				</div>
			{/each}
		{/if}
	</ShellList>
</ShellPage>

<style>
	:global(svg) {
		height: 100%;
		width: 100%;
	}
</style>
