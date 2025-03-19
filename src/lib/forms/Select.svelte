<script lang="ts">
	interface Props {
		// Value to bind to.
		value: string | undefined;
		// Label to attach describing the input.
		label: string;
		// Formatting hint.
		hint?: string;
		// Whether the input is disabled.
		disabled?: boolean;
		children?: import('svelte').Snippet;
	}

	let { value = $bindable(), label, hint = '', disabled = false, children }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		{label}

		{#if hint}
			<div class="text-xs italic text-surface-700-300">{hint}</div>
		{/if}
	</div>

	<select class="select shadow-lg" {disabled} bind:value>
		{@render children?.()}
	</select>
</div>
