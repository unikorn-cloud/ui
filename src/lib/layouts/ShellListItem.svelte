<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		trail?: Snippet;
		children?: Snippet;
	}

	let { icon, trail, children }: Props = $props();
</script>

<article
	class="flex flex-col lg:gap-x-6 lg:col-span-full lg:grid lg:grid-cols-subgrid lg:items-center card bg-surface-50-900-token shadow p-4"
>
	<iconify-icon {icon} class="text-5xl text-primary-600-300-token"></iconify-icon>

	{@render children?.()}

	<div class="col-start-[-1]">
		{@render trail?.()}
	</div>
</article>
