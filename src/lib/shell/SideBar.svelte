<script lang="ts">
	import { page } from '$app/stores';

	import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	import type { InternalToken } from '$lib/oauth2';
	import { profile, token, logout } from '$lib/credentials';
	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';
	import * as OIDC from '$lib/oidc';
	import * as Stores from '$lib/stores';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	interface Props {
		[key: string]: any;
	}

	let { ...props }: Props = $props();
	const drawerStore = getDrawerStore();

	type NavItems = Array<{ label: string; href: string }>;

	const nav: Array<{ base: string; title: string; icon: string; items: NavItems }> = [
		{
			base: '/identity',
			title: 'Identity',
			icon: 'mdi:perm-identity',
			items: [
				{ label: 'Organization', href: '/identity/organizations' },
				{ label: 'OAuth2 Providers', href: '/identity/oauth2providers' },
				{ label: 'Users', href: '/identity/users' },
				{ label: 'Service Accounts', href: '/identity/serviceaccounts' },
				{ label: 'Groups', href: '/identity/groups' },
				{ label: 'Projects', href: '/identity/projects' }
			]
		},
		{
			base: '/compute',
			title: 'Compute',
			icon: 'mdi:computer',
			items: [{ label: 'Clusters', href: '/compute/clusters' }]
		},
		{
			base: '/kubernetes',
			title: 'Kubernetes',
			icon: 'mdi:kubernetes',
			items: [
				{ label: 'Clusters', href: '/kubernetes/clusters' },
				{ label: 'Cluster Managers', href: '/kubernetes/clustermanagers' }
			]
		},
		{
			base: '/regions',
			title: 'Regions',
			icon: 'mdi:web',
			items: [
				{ label: 'Identities', href: '/regions/identities' },
				{ label: 'Networks', href: '/regions/networks' }
			]
		}
	];

	let category: string | undefined = $state();
	let active: string | undefined = $state();

	page.subscribe((page) => {
		const base: string = page.url.pathname.split('/')[1];
		if (!base) return;

		const entry = nav.find((x) => x.base == '/' + base);
		if (!entry) return;

		category = entry.title;
	});

	let itemActive = $derived((href: string) =>
		$page.url.pathname?.includes(href) ? 'variant-glass-primary' : ''
	);

	// Grab the access token.
	let at = $state() as InternalToken;

	token.subscribe((token: InternalToken): void => {
		at = token;
	});

	let organizations: Array<Identity.OrganizationRead> | undefined = $state();
	let organizationID: string | undefined = $state();

	let currentOrganizationInfo: Stores.OrganizationInfo;

	// Grab the organization out of session storage first.
	// TODO: make persistent storage!
	Stores.organizationStore.subscribe((o: Stores.OrganizationInfo) => {
		currentOrganizationInfo = o;
	});

	$effect.pre(() => {
		if (!at) return;

		Clients.identity(toastStore, at)
			.apiV1OrganizationsGet()
			.then((v: Array<Identity.OrganizationRead>) => {
				organizations = v;

				// Try reuse the current organization if we can.
				const existingOrganization = v.some((o) => o.metadata.id == currentOrganizationInfo?.id);

				organizationID = existingOrganization
					? currentOrganizationInfo.id
					: organizations[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));
	});

	$effect.pre(() => {
		if (!organizationID || !at) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDAclGet(parameters)
			.then((v: Identity.Acl) => {
				Stores.organizationStore.set({
					id: organizationID || '',
					acl: v
				});
			})
			.catch((e: Error) => Clients.error(e));
	});
</script>

<div class="h-full bg-surface-50-900-token lg:w-[320px] overflow-hidden {props.class || ''}">
	<div class="flex flex-col gap-4">
		<!-- Oragnization -->
		<div class="p-4 flex flex-col gap-4 text-sm">
			<div class="font-bold">Organization</div>

			<div class="input-group input-group-divider grid-cols-[auto_1fr]">
				<div class="input-group-shim">
					<iconify-icon
						icon="mdi:office-building-outline"
						class="text-lg text-primary-600-300-token"
					></iconify-icon>
				</div>
				<select bind:value={organizationID}>
					{#each organizations || [] as organization}
						<option value={organization.metadata.id}>{organization.metadata.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<div class="px-4 font-bold text-sm">Main Menu</div>

			<Accordion autocollapse rounded="none">
				{#each nav as entry}
					<AccordionItem open={entry.title == category}>
						{#snippet lead()}
							<iconify-icon
								icon={entry.icon}
								class="text-2xl text-primary-600-300-token align-middle"
							></iconify-icon>
						{/snippet}
						{#snippet summary()}
							{entry.title}
						{/snippet}
						{#snippet content()}
							<ul class="list-nav text-sm ml-6">
								{#each entry.items as item}
									<a href={item.href} class={itemActive(item.href)}>
										<li>
											{item.label}
										</li>
									</a>
								{/each}
							</ul>
						{/snippet}
					</AccordionItem>
				{/each}
			</Accordion>
		</div>
	</div>
</div>
