<script lang="ts">
	interface Props {
		title: string;
		tools?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { title, tools, children }: Props = $props();
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<h3 class="h3">{title}</h3>

		{@render tools?.()}
	</div>

	{@render children?.()}
</div>
