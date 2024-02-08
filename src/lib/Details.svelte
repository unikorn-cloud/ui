<script>
	export let summary;

	export let icon;

	export let color;
</script>

<details>
	<summary>
		<iconify-icon {icon} style:color />
		{summary}
	</summary>

	<section>
		<slot />
	</section>
</details>

<style>
	details {
		box-shadow: 0 0 var(--radius) var(--shadow);
	}
	details[open] {
		width: 100%;
	}
	details[open] > summary {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	summary {
		transition: all 0.3s ease-in-out;
		background-color: var(--input);
		border-radius: var(--radius);
		list-style-type: none;
		cursor: pointer;
		display: flex;
		gap: var(--padding);
		align-items: center;
		padding: var(--padding-small);
		color: white;
	}
	summary:hover {
		background-color: var(--input-selected);
	}
	section {
		display: flex;
		flex-direction: column;
		gap: var(--padding);
		padding: var(--padding);
		background-color: var(--overlay);
		border-bottom-left-radius: var(--radius);
		border-bottom-right-radius: var(--radius);
	}
</style>
