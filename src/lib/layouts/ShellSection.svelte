<script lang="ts">
	export let title: string;
</script>

<div class="flex flex-col gap-4 variant-glass rounded-lg p-4">
	<h4 class="h4">{title}</h4>

	<slot />
</div>
