<script lang="ts">
	interface Props {
		// Unique element ID.
		id: string;
		// Value to bind to.
		value: number;
		// Label to attach describing the input.
		label: string;
		// Formatting hint.
		hint?: string;
		min?: number;
		max?: number;
	}

	let { id, value = $bindable(), label, hint = '', min = 0, max }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label for={id}>{label}</label>

		{#if hint}
			<div class="text-xs italic text-surface-500">{hint}</div>
		{/if}
	</div>

	<input {id} class="input shadow-lg" type="number" bind:value {min} {max} />
</div>
