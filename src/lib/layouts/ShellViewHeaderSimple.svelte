<script lang="ts">
	interface Props {
		name: string;
	}

	let { name }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<h2 class="h2">{name}</h2>
</div>
