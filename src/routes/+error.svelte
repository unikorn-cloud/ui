<script lang="ts">
	import { page } from '$app/state';

	import Logo from '$lib/logos/Logo.svelte';
</script>

<div class="grid grid-cols-3 grid-rows-3 w-full h-screen">
	<div class="col-start-2 row-start-2 flex flex-col gap-8 items-center">
		<div class="h-16 w-auto">
			<Logo class="h-16 w-auto" />
		</div>

		<div class="h2">Oops, we encountered an error!</div>

		<div class="grid grid-cols-2 gap-2">
			<div class="font-bold">Status</div>
			{page.status}
			<div class="font-bold">Message</div>
			{page.error?.message}
		</div>
	</div>
</div>
