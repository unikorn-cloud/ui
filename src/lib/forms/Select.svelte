<script lang="ts">
	// Unique element ID.
	export let id: string;

	// Value to bind to.
	export let value: string | undefined;

	// Label to attach describing the input.
	export let label: string;

	// Formatting hint.
	export let hint: string = '';
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label for={id}>{label}</label>

		{#if hint}
			<div class="text-xs italic text-surface-500">{hint}</div>
		{/if}
	</div>

	<select {id} class="select" bind:value>
		<slot />
	</select>
</div>
