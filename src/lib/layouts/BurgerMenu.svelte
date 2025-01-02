<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';

	interface Props {
		name: string;
		children?: import('svelte').Snippet;
	}

	let { name, children }: Props = $props();
</script>

<button class="text-xl" use:popup={{ event: 'click', target: name }} aria-label="resource menu">
	<iconify-icon icon="mdi:menu"></iconify-icon>
</button>

<div class="card w-48 shadow-xl p-2 z-10" data-popup={name}>
	<nav class="list-nav">
		<ul>
			{@render children?.()}
		</ul>
	</nav>
	<div class="arrow bg-surface-100-800-token"></div>
</div>
