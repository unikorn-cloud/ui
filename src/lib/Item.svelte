<script>
	import { createEventDispatcher } from 'svelte';

	export let selected = false;

	const dispatch = createEventDispatcher();

	function click() {
		dispatch('message', {});
	}
</script>

<article on:click={click} on:keypress={click}>
	<header class:selected>
		<slot name="header" />
	</header>
	<main class:selected>
		<slot name="main" />
	</main>
</article>

<style>
	article {
		cursor: pointer;
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}
	header {
		transition: all 0.3s ease-in-out;
		color: white;
		background-color: var(--input);
		padding: var(--padding-small);
		border-top-right-radius: var(--radius);
		border-top-left-radius: var(--radius);
	}
	header:hover {
		background-color: var(--input-selected);
	}
	header.selected {
		background-color: var(--input-selected);
	}

	main {
		background-color: var(--overlay);
		padding: var(--padding-small);
		border-bottom-right-radius: var(--radius);
		border-bottom-left-radius: var(--radius);
	}
	main.selected {
		background-color: var(--overlay-highlight);
	}

	@media (prefers-color-scheme: dark) {
		header {
			color: white;
		}
		main {
			background-color: var(--overlay);
		}
	}
</style>
