<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		trail?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let { icon, trail, footer, children }: Props = $props();
</script>

<article
	class="flex flex-col lg:gap-x-6 lg:col-span-full lg:grid lg:grid-cols-subgrid lg:items-center card bg-surface-50-900-token shadow-lg p-4"
>
	<iconify-icon {icon} class="text-5xl text-primary-500"></iconify-icon>

	{@render children?.()}

	<div class="col-start-[-1]">
		{@render trail?.()}
	</div>

	{#if footer}
		<div class="col-span-full">
			<details>
				<summary class="list-none flex justify-center">
					<div class="bg-surface-200-700-token rounded shadow h-1 w-16"></div>
				</summary>

				{@render footer()}
			</details>
		</div>
	{/if}
</article>
