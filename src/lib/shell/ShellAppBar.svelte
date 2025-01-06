<script lang="ts">
	import { run } from 'svelte/legacy';

	import { browser } from '$app/environment';
	import MD5 from 'crypto-js/md5';

	import { AppBar, Avatar, LightSwitch, popup } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();

	import * as Stores from '$lib/stores';

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

	let organizations: Array<Identity.OrganizationRead> | undefined = $state();
	let organizationID: string | undefined = $state();

	let currentOrganizationInfo: Stores.OrganizationInfo;

	// Grab the organization out of session storage first.
	// TODO: make persistent storage!
	Stores.organizationStore.subscribe((o: Stores.OrganizationInfo) => {
		currentOrganizationInfo = o;
	});

	// Grab the acces token.
	let at = $state() as InternalToken;

	token.subscribe((token: InternalToken): void => {
		at = token;
	});

	function updateToken(at: InternalToken) {
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
	}

	run(() => {
		updateToken(at);
	});

	function updateOrganization(at: InternalToken, organizationID: string | undefined) {
		if (!organizationID || !at) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.identity(toastStore, at)
			.apiV1OrganizationsOrganizationIDAclGet(parameters)
			.then((v: Identity.Acl) => {
				Stores.organizationStore.set({
					id: organizationID,
					acl: v
				});
			})
			.catch((e: Error) => Clients.error(e));
	}

	run(() => {
		updateOrganization(at, organizationID);
	});

	function doLogout(): void {
		logout();
	}
</script>

<AppBar shadow="shadow-lg">
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
			<div class="w-8 lg:w-auto overflow-hidden">
				<Logo class="h-8 w-auto" />
			</div>
		</div>
	{/snippet}

	{#snippet trail()}
		<!-- Oragnization -->
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<div class="input-group-shim">
				<iconify-icon icon="mdi:office-building-outline"></iconify-icon>
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
