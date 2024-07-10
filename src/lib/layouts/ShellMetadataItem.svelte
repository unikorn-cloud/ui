<script lang="ts">
	export let icon: string;
</script>

<div class="flex gap-2 items-center">
	<iconify-icon {icon} />

	<slot />
</div>
