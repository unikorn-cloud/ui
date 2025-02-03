<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import * as Clients from '$lib/clients';

	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';
	import NumberInput from '$lib/forms/NumberInput.svelte';
	import Button from '$lib/forms/Button.svelte';

	const settings: ShellPageSettings = {
		feature: 'Identity',
		name: 'Manage Quotas',
		description: 'Manage quotas for the organization.'
	};

	let quotas = $derived.by(() => {
		let quotas = $state(data.quotas);
		return quotas;
	});

	function submit() {
		const parameters = {
			organizationID: data.organizationID,
			quotasWrite: quotas
		};

		Clients.identity(data.token)
			.apiV1OrganizationsOrganizationIDQuotasPut(parameters)
			.catch((e: Error) => Clients.error(e));
	}

	type QuotaMetadata = {
		title: string;
		description: string;
	};

	const metadata: Record<string, QuotaMetadata> = {
		clusters: {
			title: 'Clusters',
			description: 'All cluster types e.g. Kubernetes, compute, etc.'
		},
		servers: {
			title: 'Servers',
			description: 'All servers and virtual machines.'
		},
		gpus: {
			title: 'GPUs',
			description: 'General purpose GPUs.'
		}
	};
</script>

<ShellPage {settings}>
	<ShellSection title="Quotas">
		{#each quotas.capacity as quota, i}
			<NumberInput
				id={quota.kind}
				label={metadata[quota.kind].title}
				hint={metadata[quota.kind].description}
				bind:value={quotas.capacity[i].quantity}
			/>
		{/each}
	</ShellSection>

	<div class="flex justify-end">
		<Button icon="mdi:tick" label="Update" class="variant-filled-primary" clicked={submit} />
	</div>
</ShellPage>
