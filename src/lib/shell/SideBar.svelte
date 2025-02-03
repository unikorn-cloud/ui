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
	import * as RBAC from '$lib/rbac';

	interface Props {
		token: InternalToken;
		organizations: Array<Identity.OrganizationRead>;
		organizationID: string;
		acl: Identity.Acl;
		[key: string]: any;
	}

	let { token, organizations, organizationID, acl, ...props }: Props = $props();
	const drawerStore = getDrawerStore();

	type NavItems = Array<{ label: string; href: string; rbac?: Array<RBAC.OrganizationScope> }>;
	type Nav = Array<{ base: string; title: string; icon: string; items: NavItems }>;

	const navStatic: Array<{ href: string; title: string; icon: string }> = [
		{
			href: '/',
			title: 'Dashboard',
			icon: 'mdi:gauge'
		}
	];

	const nav: Nav = $derived.by(() => {
		const nav = [
			{
				base: '/identity',
				title: 'Identity',
				icon: 'mdi:perm-identity',
				items: [
					{
						label: 'Organization',
						href: 'organizations',
						rbac: [
							{
								endpoint: 'identity:organizations',
								operations: [Identity.AclOperation.Update]
							}
						]
					},
					{
						label: 'OAuth2 Providers',
						href: 'oauth2providers',
						rbac: [
							{
								endpoint: 'identity:oauth2providers',
								operations: [Identity.AclOperation.Read]
							}
						]
					},
					{
						label: 'Quotas',
						href: 'quotas',
						rbac: [
							{
								endpoint: 'identity:quotas',
								operations: [Identity.AclOperation.Update]
							}
						]
					},
					{
						label: 'Users',
						href: 'users',
						rbac: [
							{
								endpoint: 'identity:users',
								operations: [Identity.AclOperation.Read]
							}
						]
					},
					{
						label: 'Service Accounts',
						href: 'serviceaccounts',
						rbac: [
							{
								endpoint: 'identity:serviceaccounts',
								operations: [Identity.AclOperation.Read]
							}
						]
					},
					{
						label: 'Groups',
						href: 'groups',
						rbac: [
							{
								endpoint: 'identity:groups',
								operations: [Identity.AclOperation.Read]
							}
						]
					},
					{
						label: 'Projects',
						href: 'projects',
						rbac: [
							{
								endpoint: 'identity:projects',
								operations: [Identity.AclOperation.Read]
							}
						]
					}
				]
			},
			{
				base: '/compute',
				title: 'Compute',
				icon: 'mdi:computer',
				items: [
					{
						label: 'Clusters',
						href: 'clusters'
					}
				]
			},
			{
				base: '/kubernetes',
				title: 'Kubernetes',
				icon: 'mdi:kubernetes',
				items: [
					{
						label: 'Clusters',
						href: 'clusters'
					},
					{
						label: 'Cluster Managers',
						href: 'clustermanagers',
						rbac: [
							{
								endpoint: 'kubernetes:clustermanagers',
								operations: [Identity.AclOperation.Read]
							}
						]
					}
				]
			},
			{
				base: '/regions',
				title: 'Regions',
				icon: 'mdi:web',
				items: [
					{
						label: 'Identities',
						href: 'identities',
						rbac: [
							{
								endpoint: 'region:identities',
								operations: [Identity.AclOperation.Read]
							}
						]
					},
					{
						label: 'Networks',
						href: 'networks',
						rbac: [
							{
								endpoint: 'region:networks',
								operations: [Identity.AclOperation.Read]
							}
						]
					}
				]
			}
		];

		let filteredNav: Nav = [];

		for (const item of nav) {
			const filtered = item.items.filter(
				(x) => !x.rbac || RBAC.organizationScopesAllowed(acl, organizationID, x.rbac)
			);
			if (!filtered.length) continue;

			filteredNav.push({
				base: item.base,
				title: item.title,
				icon: item.icon,
				items: filtered
			});
		}

		return filteredNav;
	});

	let activeCategory = $derived(nav.find((x) => $page.url.pathname.startsWith(x.base)));
	let activeItem = $derived(
		activeCategory?.items?.find((x) =>
			$page.url.pathname.startsWith(activeCategory.base + '/' + x.href)
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
	<div class="flex flex-col">
		<!-- Oragnization -->
		<div class="p-4 flex flex-col gap-4 text-sm">
			<div class="font-bold">Organization</div>

			<div class="input-group input-group-divider grid-cols-[auto_1fr] shadow-lg">
				<div class="input-group-shim">
					<iconify-icon icon="mdi:office-building-outline" class="text-lg text-primary-500"
					></iconify-icon>
				</div>
				<select bind:value={selectedOrganizationID}>
					{#each organizations || [] as organization}
						<option value={organization.metadata.id}>{organization.metadata.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="flex flex-col">
			<div class="p-4 font-bold text-sm">Main Menu</div>

			{#each navStatic as entry}
				<a href={entry.href} class="flex gap-4 hover:bg-primary-hover-token p-2 px-4">
					<iconify-icon icon={entry.icon} class="text-2xl text-primary-500 align-middle"
					></iconify-icon>
					{entry.title}
				</a>
			{/each}

			<Accordion autocollapse rounded="none">
				{#each nav as entry}
					<AccordionItem open={entry == activeCategory}>
						{#snippet lead()}
							<iconify-icon icon={entry.icon} class="text-2xl text-primary-500 align-middle"
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
