<script lang="ts">
	import { browser } from '$app/environment';
	import MD5 from 'crypto-js/md5';

	import { AppBar, Avatar, LightSwitch, popup } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';

	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();

	function showSideMenu(): void {
		const settings: DrawerSettings = { id: 'sidebar' };
		drawerStore.open(settings);
	}

	import Logo from '$lib/logos/Logo.svelte';

	import { profile, logout } from '$lib/credentials';
	import * as OIDC from '$lib/oidc';

	let email: string | undefined = $state();
	let initials: string | undefined = $state();
	let picture: string | undefined = $state();

	profile.subscribe((value: OIDC.IDToken) => {
		if (!value) return;

		email = value.email;

		const givenName = value.given_name || '?';
		const familyName = value.family_name || '?';

		initials = givenName[0] + familyName[0];

		if (value.picture) {
			picture = value.picture;
		}
	});

	function doLogout(): void {
		logout();
	}
</script>

<AppBar background="bg-surface-50-900-token">
	{#snippet lead()}
		<div class="flex items-center gap-4">
			<!-- Hamburger menu -->
			<button
				onclick={showSideMenu}
				class="btn-icon btn-icon-sm text-2xl lg:!hidden"
				aria-label="resource menu"
			>
				<iconify-icon icon="material-symbols:menu"></iconify-icon>
			</button>

			<!-- Logo, crop to just the icon in responsive mode -->
			<a href="/">
				<div class="w-8 lg:w-auto overflow-hidden">
					<Logo class="h-8 w-auto" />
				</div>
			</a>
		</div>
	{/snippet}

	{#snippet trail()}
		<!-- User drop down -->
		<button class="btn p-0" use:popup={{ event: 'click', target: 'user' }}>
			<Avatar src={picture} {initials} class="!w-10 !h-10" />
		</button>

		<div class="card p-4 shadow-x1" data-popup="user">
			<div class="space-y-4">
				<section class="flex justify-between items-center">
					{email}
				</section>

				<section class="flex justify-between items-center">
					<h6 class="h6">Color Scheme</h6>
					<LightSwitch />
				</section>

				<section class="flex justify-between items-center">
					<h6 class="h6">Logout</h6>
					<button
						class="btn p-0 text-2xl"
						onclick={doLogout}
						onkeypress={doLogout}
						aria-label="logout"
					>
						<iconify-icon icon="material-symbols:logout"></iconify-icon>
					</button>
				</section>
			</div>
		</div>
	{/snippet}
</AppBar>
