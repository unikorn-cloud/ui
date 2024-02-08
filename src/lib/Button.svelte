<script>
	import { createEventDispatcher } from 'svelte';

	export let text;

	export let icon;

	export let disabled = false;

	const dispatch = createEventDispatcher();

	function click() {
		dispatch('message', {});
	}
</script>

<button on:click={click} {disabled}>
	<iconify-icon {icon} />
	{text}
</button>

<style>
	button {
		padding: var(--padding-small);
		font-size: 1rem;
		transition: all 0.2s ease-in;
		display: inline-flex;
		align-items: center;
		gap: var(--padding);
		cursor: pointer;
		color: white;
		background-color: var(--input);
		border-radius: var(--radius);
		border-style: none;
		box-shadow: 0 0 var(--radius) var(--shadow);
	}
	button:hover {
		background-color: var(--input-selected);
	}
	button:disabled {
		cursor: not-allowed;
		background-color: var(--mid-grey);
	}
</style>
