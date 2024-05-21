<script lang="ts">
	import { page } from '$app/stores';

	import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();

	type NavItems = Array<{ label: string; href: string }>;

	const nav: Record<string, Array<{ title: string; items: NavItems }>> = {
		'/identity': [
			{
				title: 'Identity',
				items: [
					{ label: 'Organizations', href: '/identity/organizations' },
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
					{ label: 'Cluster Managers', href: '/infrastructure/clustermanagers' }
				]
			}
		]
	};

	let railCategory: string;

	page.subscribe((page) => {
		const base: string = page.url.pathname.split('/')[1];
		if (!base) return;

		if (base === 'identity') railCategory = '/identity';
		if (base === 'applications') railCategory = '/applications';
		if (base === 'infrastructure') railCategory = '/infrastructure';
	});

	$: submenu = nav[railCategory ?? '/identity'];
	$: itemActive = (href: string) =>
		$page.url.pathname?.includes(href) ? 'bg-primary-active-token' : '';
</script>

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 lg:w-[360px] overflow-hidden {$$props.class ||
		''}"
>
	<AppRail background="bg-transparent" border="border-r border-surface-500/30">
		<AppRailAnchor href="/">
			<svelte:fragment slot="lead">
				<iconify-icon icon="mdi:home-outline" class="text-2xl" />
			</svelte:fragment>
			<span>Home</span>
		</AppRailAnchor>
		<AppRailTile bind:group={railCategory} name="identity" value={'/identity'}>
			<svelte:fragment slot="lead">
				<iconify-icon icon="mdi:perm-identity" class="text-2xl" />
			</svelte:fragment>
			<span>Identity</span>
		</AppRailTile>
		<AppRailTile bind:group={railCategory} name="applications" value={'/applications'}>
			<svelte:fragment slot="lead">
				<iconify-icon icon="mdi:application-outline" class="text-2xl" />
			</svelte:fragment>
			<span>Apps</span>
		</AppRailTile>
		<AppRailTile bind:group={railCategory} name="infrastructure" value={'/infrastructure'}>
			<svelte:fragment slot="lead">
				<iconify-icon icon="mdi:cloud-outline" class="text-2xl" />
			</svelte:fragment>
			<span>Infra</span>
		</AppRailTile>
		<!-- Make this configurable -->
		<AppRailAnchor href="https://github.com/unikorn-cloud">
			<svelte:fragment slot="lead">
				<iconify-icon icon="mdi:book-open-blank-variant" class="text-2xl" />
			</svelte:fragment>
			<span>Docs</span>
		</AppRailAnchor>
	</AppRail>

	<section class="p-4 pb-20 space-y-4 overflow-y-auto">
		{#each submenu as segment, i}
			<p class="font-bold pl-4 text-2xl">{segment.title}</p>

			<nav class="list-nav">
				<ul>
					{#each segment.items as { label, href }}
						<a {href} class={itemActive(href)} data-sveltekit-preload-data="hover">
							<li on:keypress={drawerStore.close} on:click={drawerStore.close}>
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
