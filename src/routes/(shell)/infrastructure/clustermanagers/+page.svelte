<script lang="ts">
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellList from '$lib/layouts/ShellList.svelte';
	import ShellListItem from '$lib/layouts/ShellListItem.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'Cluster Managers',
		description: 'Manage your cluster life-cycle managers.'
	};

	import { onDestroy } from 'svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import { client, error } from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Models from '$lib/openapi/server/models';

	let at: InternalToken;

	let resources: Models.ClusterManagers;

	let organization: string;

	organizationStore.subscribe((value: string) => {
		organization = value;
		update();
	});

	token.subscribe((token: InternalToken): void => {
		at = token;
		update();

		const ticker = setInterval(update, 5000);
		onDestroy(() => clearInterval(ticker));
	});

	function update(): void {
		if (!at || !organization) return;

		const parameters = {
			organization: organization
		};

		client(toastStore, at)
			.apiV1OrganizationsOrganizationClustermanagersGet(parameters)
			.then((v: Models.ClusterManagers) => (resources = v))
			.catch((e: Error) => error(e));
	}

	function remove(resource: Models.ClusterManager): void {
		const modal: ModalSettings = {
			type: 'confirm',
			title: `Are you sure?`,
			body: `Removing control plane "${resource.spec.name}" will remove all resources owned by it.`,
			response: (ok: boolean) => {
				if (!ok) return;

				const parameters = {
					organization: organization,
					project: resource.metadata.project,
					clusterManager: resource.spec.name
				};

				client(toastStore, at)
					.apiV1OrganizationsOrganizationProjectsProjectClustermanagersClusterManagerDelete(
						parameters
					)
					.catch((e: Error) => error(e));
			}
		};

		modalStore.trigger(modal);
	}

	import StatusIcon from '$lib/StatusIcon.svelte';
</script>

<ShellPage {settings}>
	<ShellList>
		{#each resources || [] as resource}
			<ShellListItem>
				<header class="flex items-center gap-4">
					<StatusIcon metadata={resource.metadata} />
					<h6 class="h6">{resource.spec.name}</h6>
				</header>

				<button on:click={() => remove(resource)} on:keypress={() => remove(resource)}>
					<iconify-icon icon="mdi:close" />
				</button>
			</ShellListItem>
		{/each}
	</ShellList>
</ShellPage>
