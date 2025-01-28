<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		main: Snippet;
		trail?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let { icon, main, trail, footer, children }: Props = $props();
</script>

<article class="flex flex-col gap-4 card bg-surface-50-900-token shadow-lg p-4">
	<div class="flex gap-4 items-center">
		<iconify-icon {icon} class="text-5xl text-primary-500"></iconify-icon>

		<div class="overflow-hidden text-ellipsis">
			{@render main()}
		</div>

		<div class="ml-auto">
			{@render trail?.()}
		</div>
	</div>

	{@render children?.()}

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
