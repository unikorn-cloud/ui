<script>
	import LabeledInput from '$lib/LabeledInput.svelte';

	// ID of the field, for linking label text.
	export let id;

	// value of the field, for setting initally and binding to for updates.
	export let value;

	// options that can be selector.
	export let options;

	// whether we provide a null/unset option.
	export let nullable = false;

	// formatter allow values to be formatted.
	export let formatter = null;

	// help text.
	export let help;

	// icon to display beside the select.
	export let icon;
</script>

<LabeledInput {id} value={help}>
	<div>
		<iconify-icon {icon} />
		<select {id} bind:value>
			{#if nullable}
				<option value={null}>(None)</option>
			{/if}
			{#each options as o}
				{#if formatter}
					<option value={o}>{@html formatter(o)}</option>
				{:else}
					<option value={o}>{o}</option>
				{/if}
			{/each}
		</select>
	</div>
</LabeledInput>

<style>
	div {
		display: flex;
		justify-content: stretch;
		gap: 1px;
	}
	iconify-icon {
		color: white;
		background-color: var(--brand);
		padding: var(--padding-small);
		border-top-left-radius: var(--radius);
		border-bottom-left-radius: var(--radius);
	}
	select {
		color: white;
		background-color: var(--brand);
		border-bottom: none;
		border-top-right-radius: var(--radius);
		border-bottom-right-radius: var(--radius);
	}
</style>
