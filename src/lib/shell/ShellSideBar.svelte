<script lang="ts">
	import { page } from '$app/stores';

	import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';
	interface Props {
		[key: string]: any;
	}

	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

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
				{ label: 'Service Accounts', href: '/identity/serviceaccounts' },
				{ label: 'Groups', href: '/identity/groups' },
				{ label: 'Projects', href: '/identity/projects' }
			]
		},
		{
			base: '/applications',
			title: 'Applications',
			icon: 'mdi:application-outline',
			items: [{ label: 'Catalog', href: '/applications/catalog' }]
		},
		{
			base: '/infrastructure',
			title: 'Infrastucture',
			icon: 'mdi:cloud-outline',
			items: [
				{ label: 'Kubernetes Clusters', href: '/infrastructure/clusters' },
				{ label: 'Kubernetes Cluster Managers', href: '/infrastructure/clustermanagers' },
				{ label: 'Compute Clusters', href: '/infrastructure/computeclusters' }
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
</script>

<div class="h-full bg-surface-50-900-token lg:w-[320px] overflow-hidden {props.class || ''}">
	<Accordion autocollapse rounded="none">
		{#each nav as entry}
			<AccordionItem open={entry.title == category}>
				{#snippet lead()}
					<iconify-icon icon={entry.icon} class="text-2xl"></iconify-icon>
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
