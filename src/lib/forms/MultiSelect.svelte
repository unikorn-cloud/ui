<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { AutocompleteOption, PopupSettings } from '@skeletonlabs/skeleton';
	import { Autocomplete, popup } from '@skeletonlabs/skeleton';

	import type { SizeOptions } from '@floating-ui/dom';

	interface Props {
		// Unique element ID.
		id: string;
		// Value to bind to.
		value: Array<string>;
		// Label to attach describing the input.
		label: string;
		// Formatting hint.
		hint?: string;
		// List of all possible options.
		options: Array<AutocompleteOption<string>>;
		// Member addition callback.
		add: (value: string) => void;
		// Member remove callback.
		remove: (index: number) => void;
		// Rendering snippet for a selected item.
		selected: Snippet<[string]>;
	}

	let { id, value, label, hint = '', options, add, remove, selected }: Props = $props();

	let svalue = $state();

	const sizeOptions: SizeOptions = {
		apply({ rects, elements }) {
			Object.assign(elements.floating.style, {
				minWidth: `${rects.reference.width}px`
			});
		}
	};

	const popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete-' + id,
		placement: 'bottom-start',
		middleware: {
			size: sizeOptions
		}
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label for={id}>{label}</label>

		{#if hint}
			<div class="text-xs italic text-surface-500">{hint}</div>
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		{#each value as v, i}
			<div class="card shadow-lg bg-surface-50-900-token flex justify-between items-center p-3">
				{@render selected(v)}
				<button onclick={() => remove(i)} onkeypress={() => remove(i)} aria-label="Remove item">
					<iconify-icon icon="mdi:trash-can-outline" class="text-xl text-primary-500"
					></iconify-icon>
				</button>
			</div>
		{/each}
	</div>

	<div class="inline-flex flex-col">
		<input
			class="input"
			type="search"
			name={id}
			bind:value={svalue}
			placeholder="Search..."
			use:popup={popupSettings}
		/>

		<div class="card p-2 shadow-lg max-h-32 overflow-y-auto" data-popup={'popupAutocomplete-' + id}>
			<Autocomplete
				bind:input={svalue}
				{options}
				denylist={value}
				on:selection={(event: CustomEvent<AutocompleteOption<string>>) => add(event.detail.value)}
			/>
		</div>
	</div>
</div>
