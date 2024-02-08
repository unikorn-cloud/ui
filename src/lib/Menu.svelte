<script>
	import { selected } from '$lib/menu.js';

	export let menu = null;

	let highlight = null;

	selected.subscribe((id) => {
		highlight = id;
	});

	function select(id) {
		selected.set(id);
	}
</script>

<section>
	{#each menu as item}
		{#if item.link}
			<!-- TODO: use a snippet -->
			<a href={item.link} target="_blank">
				<div>
					<iconify-icon icon={item.icon} />
					{item.value}
				</div>
			</a>
		{:else}
			<div
				class:highlight={item.id == highlight}
				on:click={select(item.id)}
				on:keypress={select(item.id)}
			>
				<iconify-icon icon={item.icon} />
				{item.value}
			</div>
		{/if}
	{/each}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: var(--padding-small);
	}
	div {
		color: var(--mid-grey);
		padding: var(--padding);
		display: flex;
		gap: var(--padding);
		align-items: center;
		transition: all 0.3s ease-in-out;
		border-radius: var(--radius);
		cursor: pointer;
	}
	div:hover {
		color: white;
		background-color: var(--brand);
	}
	div.highlight {
		color: white;
		background-color: var(--brand);
	}
	iconify-icon {
		font-size: var(--icon-size);
	}
	a {
		text-decoration: none;
	}
</style>
