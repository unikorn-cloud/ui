<script lang="ts">
	import { page } from '$app/stores';

	import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';
	interface Props {
		[key: string]: any;
	}

	let { ...props }: Props = $props();
	const drawerStore = getDrawerStore();

	type NavItems = Array<{ label: string; href: string }>;

	const nav: Record<string, Array<{ title: string; items: NavItems }>> = {
		'/identity': [
			{
				title: 'Identity',
				items: [
					{ label: 'Organization', href: '/identity/organizations' },
					{ label: 'OAuth2 Providers', href: '/identity/oauth2providers' },
					{ label: 'Groups', href: '/identity/groups' },
					{ label: 'Projects', href: '/identity/projects' },
					{ label: 'Tokens', href: '/identity/tokens' }
				]
			}
		],
		'/applications': [
			{
				title: 'Applications',
				items: [{ label: 'Catalog', href: '/applications/catalog' }]
			}
		],
		'/infrastructure': [
			{
				title: 'Infrastucture',
				items: [
					{ label: 'Kubernetes Clusters', href: '/infrastructure/clusters' },
					{ label: 'Kubernetes Cluster Managers', href: '/infrastructure/clustermanagers' },
					{ label: 'Compute Clusters', href: '/infrastructure/computeclusters' }
				]
			}
		],
		'/regions': [
			{
				title: 'Regions',
				items: [
					{ label: 'Identities', href: '/regions/identities' },
					{ label: 'Networks', href: '/regions/networks' }
				]
			}
		]
	};

	let railCategory: string | undefined = $state();

	page.subscribe((page) => {
		const base: string = page.url.pathname.split('/')[1];
		if (!base) return;

		if (base === 'identity') railCategory = '/identity';
		if (base === 'applications') railCategory = '/applications';
		if (base === 'infrastructure') railCategory = '/infrastructure';
	});

	let submenu = $derived(nav[railCategory ?? '/identity']);
	let itemActive = $derived((href: string) =>
		$page.url.pathname?.includes(href) ? 'bg-primary-active-token' : ''
	);
</script>

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 lg:w-[360px] overflow-hidden {props.class ||
		''}"
>
	<AppRail background="bg-transparent" border="border-r border-surface-500/30">
		<AppRailAnchor href="/">
			{#snippet lead()}
				<iconify-icon icon="mdi:home-outline" class="text-2xl"></iconify-icon>
			{/snippet}
			<span>Home</span>
		</AppRailAnchor>
		<AppRailTile bind:group={railCategory} name="identity" value={'/identity'}>
			{#snippet lead()}
				<iconify-icon icon="mdi:perm-identity" class="text-2xl"></iconify-icon>
			{/snippet}
			<span>Identity</span>
		</AppRailTile>
		<AppRailTile bind:group={railCategory} name="applications" value={'/applications'}>
			{#snippet lead()}
				<iconify-icon icon="mdi:application-outline" class="text-2xl"></iconify-icon>
			{/snippet}
			<span>Apps</span>
		</AppRailTile>
		<AppRailTile bind:group={railCategory} name="infrastructure" value={'/infrastructure'}>
			{#snippet lead()}
				<iconify-icon icon="mdi:cloud-outline" class="text-2xl"></iconify-icon>
			{/snippet}
			<span>Infra</span>
		</AppRailTile>
		<AppRailTile bind:group={railCategory} name="regions" value={'/regions'}>
			{#snippet lead()}
				<iconify-icon icon="mdi:web" class="text-2xl"></iconify-icon>
			{/snippet}
			<span>Regions</span>
		</AppRailTile>
		<!-- Make this configurable -->
		<AppRailAnchor href="https://github.com/unikorn-cloud">
			{#snippet lead()}
				<iconify-icon icon="mdi:book-open-blank-variant" class="text-2xl"></iconify-icon>
			{/snippet}
			<span>Docs</span>
		</AppRailAnchor>
	</AppRail>

	<section class="p-4 pb-20 space-y-4 overflow-y-auto">
		{#each submenu as segment, i}
			<p class="font-bold pl-4 text-2xl">{segment.title}</p>

			<nav class="list-nav">
				<ul>
					{#each segment.items as { label, href }}
						<a
							{href}
							class={itemActive(href)}
							data-sveltekit-preload-data="hover"
							onkeypress={drawerStore.close}
							onclick={drawerStore.close}
						>
							<li>
								<span class="flex-auto">{label}</span>
							</li>
						</a>
					{/each}
				</ul>
			</nav>

			{#if i < Object.keys(nav).length - 1}
				<hr class="!my-6 opacity-50" />
			{/if}
		{/each}
	</section>
</div>
