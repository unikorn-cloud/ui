<script lang="ts">
	import MD5 from 'crypto-js/md5';

	import { AppBar, Avatar, LightSwitch, popup } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();

	import { organizationStore } from '$lib/stores';

	function showSideMenu(): void {
		const settings: DrawerSettings = { id: 'sidebar' };
		drawerStore.open(settings);
	}

	import Logo from '$lib/logos/Logo.svelte';

	import { profile, token, logout } from '$lib/credentials';
	import { identityClient, error } from '$lib/clients';
	import * as Models from '$lib/openapi/identity/models';

	let emailAddress: string;

	profile.subscribe((value: string) => {
		if (!value) return;

		const claims = JSON.parse(value);
		emailAddress = claims.email;
	});

	let organizations: Models.Organizations;
	let organization: string;

	token.subscribe((at: string) => {
		if (!at) return;

		identityClient(toastStore, at)
			.apiV1OrganizationsGet()
			.then((v: Models.Organizations) => {
				organizations = v;
				organization = organizations[0].name;
			})
			.catch((e: Error) => error(e));
	});

	$: organizationStore.set(organization);

	function doLogout(): void {
		logout();
	}
</script>

<AppBar shadow="shadow-2xl">
	<svelte:fragment slot="lead">
		<div class="flex items-center gap-4">
			<!-- Hamburger menu -->
			<button on:click={showSideMenu} class="btn-icon btn-icon-sm text-2xl lg:!hidden">
				<iconify-icon icon="material-symbols:menu" />
			</button>

			<!-- Logo, crop to just the icon in responsive mode -->
			<div class="w-8 lg:w-auto overflow-hidden">
				<Logo class="h-8 w-auto" />
			</div>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<!-- Oragnization -->
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<div class="input-group-shim">
				<iconify-icon icon="mdi:office-building-outline" />
			</div>
			<select bind:value={organization}>
				{#each organizations || [] as organization}
					<option value={organization.name}>{organization.name}</option>
				{/each}
			</select>
		</div>

		<!-- User drop down -->
		<button class="btn p-0" use:popup={{ event: 'click', target: 'user' }}>
			<Avatar src="https://www.gravatar.com/avatar/{MD5(emailAddress)}" initials="SM" class="w-8" />
		</button>

		<div class="card p-4 w-60 shadow-x1" data-popup="user">
			<div class="space-y-4">
				<section class="flex justify-between items-center">
					<h6 class="h6">Color Scheme</h6>
					<LightSwitch />
				</section>

				<section class="flex justify-between items-center">
					<h6 class="h6">Logout</h6>
					<button class="btn p-0 text-2xl" on:click={doLogout} on:keypress={doLogout}>
						<iconify-icon icon="material-symbols:logout" />
					</button>
				</section>
			</div>
		</div>
	</svelte:fragment>
</AppBar>
