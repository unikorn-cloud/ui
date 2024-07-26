<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';

	export let name: string;
</script>

<button class="text-xl" use:popup={{ event: 'click', target: name }}>
	<iconify-icon icon="mdi:menu" />
</button>

<div class="card w-48 shadow-xl p-2 z-10" data-popup={name}>
	<nav class="list-nav">
		<ul>
			<slot />
		</ul>
	</nav>
	<div class="arrow bg-surface-100-800-token"></div>
</div>
