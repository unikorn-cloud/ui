<script lang="ts">
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
	import * as Kubernetes from '$lib/openapi/kubernetes';

	import { organizationStore } from '$lib/stores';

	let organizationID: string;

	organizationStore.subscribe((value: string) => {
		organizationID = value;
	});

	let at: InternalToken;

	token.subscribe((token: InternalToken): void => {
		at = token;
	});

	let applications: Array<Kubernetes.ApplicationRead>;

	function updateApplications(at: InternalToken, organizationID: string) {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDApplicationsGet(parameters)
			.then((v: Array<Kubernetes.ApplicationRead>) => (applications = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: updateApplications(at, organizationID);
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
							{#each application.spec.tags || [] as tag}
								<div class="badge variant-soft">{tag}</div>
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
