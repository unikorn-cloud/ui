<script lang="ts">
	interface Props {
		// Unique element ID.
		id: string;
		// Value to bind to.
		value: Array<string>;
		// Label to attach describing the input.
		label: string;
		// Formatting hint.
		hint?: string;
		children?: import('svelte').Snippet;
	}

	let { id, value = $bindable(), label, hint = '', children }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label for={id}>{label}</label>

		{#if hint}
			<div class="text-xs italic text-surface-500">{hint}</div>
		{/if}
	</div>

	<select {id} class="select shadow-lg" multiple bind:value>
		{@render children?.()}
	</select>
</div>
