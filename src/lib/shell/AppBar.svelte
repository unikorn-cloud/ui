<script lang="ts">
	import * as OIDC from '$lib/oidc';

	interface Props {
		profile: OIDC.IDToken;
	}

	let { profile }: Props = $props();

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
	import { logout } from '$lib/credentials';

	let email = $derived(profile.email);
	let initials = $derived((profile.given_name?.[0] || '?') + (profile.family_name?.[0] || '?'));
	let picture = $derived(profile.picture);

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
			<Avatar
				src={picture}
				{initials}
				class="!w-10 !h-10"
				fontSize={180}
				fill="fill-on-primary-token"
				background="bg-primary-500-400-token"
			/>
		</button>

		<div data-popup="user">
			<div class="card shadow p-4 flex flex-col gap-4">
				<section class="flex gap-2 items-center">
					<iconify-icon icon="mdi:perm-identity" class="text-2xl text-primary-500-400-token"
					></iconify-icon>
					{email}
				</section>

				<hr class="!border-t-2" />

				<section class="flex gap-2 items-center">
					<iconify-icon icon="mdi:theme-light-dark" class="text-2xl text-primary-500-400-token"
					></iconify-icon>
					<div class="flex gap-2 w-full justify-between">
						<h6 class="h6">Color Scheme</h6>
						<LightSwitch />
					</div>
				</section>

				<section class="flex gap-2 items-center">
					<iconify-icon icon="material-symbols:logout" class="text-2xl text-primary-500-400-token"
					></iconify-icon>
					<button class="btn p-0" onclick={doLogout} onkeypress={doLogout}> Logout </button>
				</section>
			</div>
		</div>
	{/snippet}
</AppBar>
