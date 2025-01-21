<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';

	import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	import type { InternalToken } from '$lib/oauth2';
	import { logout } from '$lib/credentials';
	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';
	import * as OIDC from '$lib/oidc';
	import * as Stores from '$lib/stores';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	interface Props {
		token: InternalToken;
		organizations: Array<Identity.OrganizationRead>;
		organizationID: string;
		[key: string]: any;
	}

	let { token, organizations, organizationID, ...props }: Props = $props();
	const drawerStore = getDrawerStore();

	type NavItems = Array<{ label: string; href: string }>;

	const nav: Array<{ base: string; title: string; icon: string; items: NavItems }> = [
		{
			base: '/dashboard/identity',
			title: 'Identity',
			icon: 'mdi:perm-identity',
			items: [
				{ label: 'Organization', href: 'organizations' },
				{ label: 'OAuth2 Providers', href: 'oauth2providers' },
				{ label: 'Users', href: 'users' },
				{ label: 'Service Accounts', href: 'serviceaccounts' },
				{ label: 'Groups', href: 'groups' },
				{ label: 'Projects', href: 'projects' }
			]
		},
		{
			base: '/dashboard/compute',
			title: 'Compute',
			icon: 'mdi:computer',
			items: [{ label: 'Clusters', href: 'clusters' }]
		},
		{
			base: '/dashboard/kubernetes',
			title: 'Kubernetes',
			icon: 'mdi:kubernetes',
			items: [
				{ label: 'Clusters', href: 'clusters' },
				{ label: 'Cluster Managers', href: 'clustermanagers' }
			]
		},
		{
			base: '/dashboard/regions',
			title: 'Regions',
			icon: 'mdi:web',
			items: [
				{ label: 'Identities', href: 'identities' },
				{ label: 'Networks', href: 'networks' }
			]
		}
	];

	let activeCategory = $derived(nav.find((x) => $page.route.id?.startsWith(x.base)));
	let activeItem = $derived(
		activeCategory?.items.find((x) =>
			$page.route.id?.startsWith(activeCategory.base + '/' + x.href)
		)
	);

	let selectedOrganizationID = $state(organizationID);

	$effect.pre(() => {
		if (!browser) return;

		if (selectedOrganizationID != organizationID) {
			window.localStorage.setItem('organization_id', selectedOrganizationID);

			invalidate('app:organization_id');
		}
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
						class="text-lg text-primary-500-400-token"
					></iconify-icon>
				</div>
				<select bind:value={selectedOrganizationID}>
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
					<AccordionItem open={entry == activeCategory}>
						{#snippet lead()}
							<iconify-icon
								icon={entry.icon}
								class="text-2xl text-primary-500-400-token align-middle"
							></iconify-icon>
						{/snippet}
						{#snippet summary()}
							{entry.title}
						{/snippet}
						{#snippet content()}
							<ul class="list-nav text-sm ml-6">
								{#each entry.items as item}
									<a
										href={entry.base + '/' + item.href}
										class={item == activeItem ? 'variant-glass-primary' : ''}
									>
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
