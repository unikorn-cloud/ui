<script lang="ts">
	export let icon: string;
	export let href: string | null = null;
</script>

<li>
	<a class="flex gap-4 items-center" {href} on:click on:keypress>
		<iconify-icon {icon} />
		<slot />
	</a>
</li>
