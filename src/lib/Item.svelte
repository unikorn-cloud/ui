<script>
	import { createEventDispatcher } from 'svelte';

	export let selected = false;

	const dispatch = createEventDispatcher();

	function click() {
		dispatch('message', {});
	}
</script>

<article on:click={click} on:keypress={click} class="widget" class:widget-selected={selected}>
	<header>
		<slot name="header" />
	</header>
	<main>
		<slot name="main" />
	</main>
</article>

<style>
	header {
		transition: all 0.3s ease-in-out;
		padding: var(--padding);
	}
	main {
		padding: var(--padding);
	}
</style>
