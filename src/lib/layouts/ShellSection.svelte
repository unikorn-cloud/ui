<script lang="ts">
	interface Props {
		title: string;
		tools?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { title, tools, children }: Props = $props();
</script>

<div
	class="card bg-surface-50-900-token border border-surface-300-600-token shadow-sm flex flex-col gap-6 p-4"
>
	<div class="flex items-center justify-between">
		<h4 class="h4">{title}</h4>

		{@render tools?.()}
	</div>

	{@render children?.()}
</div>
