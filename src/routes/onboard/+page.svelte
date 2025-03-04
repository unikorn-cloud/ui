<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	import { page } from '$app/state';

	import Logo from '$lib/logos/Logo.svelte';

	let who = $derived.by(() => {
		if (page.url.searchParams.has('forename')) {
			return page.url.searchParams.get('forename');
		}

		if (page.url.searchParams.has('username')) {
			return page.url.searchParams.get('username');
		}

		return '';
	});
</script>

<div class="grid grid-cols-[1fr_max-content_1fr] grid-rows-[1fr_max-content_1fr] w-full h-screen">
	<div class="col-start-2 row-start-2 flex flex-col gap-8 items-center">
		<header class="h-16 w-auto">
			<Logo class="h-16 w-auto" />
		</header>

		<div class="h1">Welcome{' ' + who}!</div>
		<div class="h3">Let's Get Started..</div>

		<main class="flex flex-col gap-4 items-center">
			<form id="login_form" class="flex flex-col gap-8" method="post" action={data.callback}>
				<input name="state" type="hidden" value={data.state} />
				<input name="group_name" type="hidden" value="administrators" />
				<input name="group_description" type="hidden" value="Organization administrator users." />

				<section class="flex flex-col gap-4 items-center">
					<p>Choose an organization name</p>

					<input class="input shadow-lg" name="organization_name" placeholder="acme.com" required />
				</section>
			</form>
		</main>
	</div>
</div>
