<script lang="ts">
	import { browser } from '$app/environment';
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

	import type { InternalToken } from '$lib/oauth2';
	import { profile, token, logout } from '$lib/credentials';
	import * as Clients from '$lib/clients';
	import * as Identity from '$lib/openapi/identity';
	import * as OIDC from '$lib/oidc';

	let initials: string;
	let picture: string;

	profile.subscribe((value: OIDC.IDToken) => {
		if (!value) return;

		const givenName = value.given_name || '?';
		const familyName = value.family_name || '?';

		initials = givenName[0] + familyName[0];

		if (value.picture) {
			picture = value.picture;
		}
	});

	let organizations: Array<Identity.OrganizationRead>;
	let organizationID: string;

	let currentOrganizationID: string;

	// Grab the organization out of session storage first.
	organizationStore.subscribe((o: string) => {
		currentOrganizationID = o;
	});

	token.subscribe((at: InternalToken) => {
		if (!at) return;

		Clients.identity(toastStore, at)
			.apiV1OrganizationsGet()
			.then((v: Array<Identity.OrganizationRead>) => {
				organizations = v;

				// Try reuse the current organization if we can.
				const existingOrganization = v.find((o) => o.metadata.id == currentOrganizationID);

				organizationID = existingOrganization
					? currentOrganizationID
					: organizations[0].metadata.id;
			})
			.catch((e: Error) => Clients.error(e));
	});

	$: if (organizationID) organizationStore.set(organizationID);

	function doLogout(): void {
		logout();
	}
</script>

<AppBar shadow="shadow-lg">
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
			<select bind:value={organizationID}>
				{#each organizations || [] as organization}
					<option value={organization.metadata.id}>{organization.metadata.name}</option>
				{/each}
			</select>
		</div>

		<!-- User drop down -->
		<button class="btn p-0" use:popup={{ event: 'click', target: 'user' }}>
			<Avatar src={picture} {initials} class="!w-10 !h-10" />
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
