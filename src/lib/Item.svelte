<script>
	import { createEventDispatcher } from 'svelte';

	export let selected = false;

	const dispatch = createEventDispatcher();

	function click() {
		dispatch('message', {});
	}
</script>

<article on:click={click} on:keypress={click} class:selected>
	<header>
		<slot name="header" />
	</header>
	<main class:selected>
		<slot name="main" />
	</main>
</article>

<style>
	article {
		cursor: pointer;
		border-radius: var(--radius);
		background-color: var(--overlay);
		backdrop-filter: blur(var(--radius));
		box-shadow: 0 0 var(--radius) var(--shadow);
	}
	article.selected {
		background-color: var(--overlay-highlight);
	}
	header {
		transition: all 0.3s ease-in-out;
		padding: var(--padding);
	}
	main {
		padding: var(--padding);
	}
</style>
