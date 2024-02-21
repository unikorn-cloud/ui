<script>
	export let id;
	export let value;
</script>

{#if value}
	<div>
		<label for={id}>{@html value}</label>
		<slot />
	</div>
{:else}
	<slot />
{/if}

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--padding-small);
		width: 100%;
	}
	label {
		display: block;
		font-size: 0.75rem;
	}
	label > :global(em) {
		font-weight: bold;
	}
</style>
