<script lang="ts">
	import MD5 from 'crypto-js/md5';

	import { DrawerSettings, AppBar, Avatar, LightSwitch, popup } from '@skeletonlabs/skeleton';

	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();

	function showSideMenu(): void {
		const settings: DrawerSettings = { id: 'sidebar' };
		drawerStore.open(settings);
	}

	import { email, removeCredentials } from '$lib/credentials.js';

	let emailAddress: string;

	email.subscribe((email) => {
		emailAddress = email;
	});

	function logout(): void {
		removeCredentials();
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
				<img src="/img/logo.svg" alt="Logo" onload="SVGInject(this)" class="h-8 w-auto" />
			</div>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="trail">
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
					<button class="btn p-0 text-2xl" on:click={logout} on:keypress={logout}>
						<iconify-icon icon="material-symbols:logout" />
					</button>
				</section>
			</div>
		</div>
	</svelte:fragment>
</AppBar>
