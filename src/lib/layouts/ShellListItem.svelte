<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		main: Snippet;
		trail?: Snippet;
		children?: Snippet;
	}

	let { icon, main, trail, children }: Props = $props();
</script>

<article
	class="flex gap-2 lg:gap-4 lg:col-span-full lg:grid lg:grid-cols-subgrid lg:items-center card shadow-md p-4 border border-surface-200-800"
>
	<div class="flex flex-col gap-4 lg:contents overflow-hidden">
		<div class="flex items-center gap-4 lg:contents overflow-hidden">
			<iconify-icon {icon} class="text-4xl text-primary-500"></iconify-icon>

			<div class="overflow-hidden text-ellipsis">
				{@render main()}
			</div>
		</div>

		{@render children?.()}
	</div>

	<div
		class="ml-auto lg:justify-self-end lg:col-start-[-1] flex flex-col lg:flex-row gap-2 items-center"
	>
		{@render trail?.()}
	</div>
</article>
