<script lang="ts">
	import type { Snippet } from 'svelte';

	import Button from '$lib/forms/Button.svelte';
	import ButtonIcon from '$lib/forms/ButtonIcon.svelte';

	interface Props {
		// Title of the resource list.
		title: string;
		// Class to apply to the title.
		titleClass?: string;
		// Description of what the list represents.
		description?: Snippet;
		// Number of columns to render per list item.
		columns: number;
		// Items in the list.
		items: Array<any>;
		// Initial item to have expanded.
		initialItem?: number;
		// Normal list element renderer e.g. a summary.
		normal: Snippet<[any, number]>;
		// Expanded list element renderer e.g. an update dialog.
		expanded: Snippet<[any, number]>;
		// Whether or not any item is expanded.
		active: boolean;
		// Whether the expanded item is valid.
		valid?: boolean;
		// Called when a new element wants to be added, as we cannot guarantee
		// where the item will be inserted, this returns the new index.
		add: () => number;
		// Remove is called when an active item is deleted.
		remove: (index: number) => void;
		// Called when an item is activated.
		activate?: (index: number) => void;
		// Called when an item is deactivated.
		deactivate?: (index: number) => void;
	}

	let {
		title,
		titleClass = 'h2',
		description,
		columns,
		items,
		initialItem,
		normal,
		expanded,
		active = $bindable(false),
		valid = true,
		add,
		remove,
		activate,
		deactivate
	}: Props = $props();

	let activeItem: number | null = $state(null);

	// If the initial item is set, then update the active item accordingly,
	// but as a singleton.
	let activeItemInit = false;

	$effect.pre(() => {
		if (activeItemInit) return;

		activeItemInit = true;

		if (initialItem != null && initialItem >= 0 && initialItem < items.length) {
			itemActivate(initialItem);
		}
	});

	// Informa the client that an item is active when an active item index is selected.
	$effect.pre(() => {
		active = activeItem != null;
	});

	function itemActivate(index: number) {
		activeItem = index;
		activate?.(index);
	}

	function itemDeactivate(index: number) {
		activeItem = null;
		deactivate?.(index);
	}

	function itemAdd() {
		itemActivate(add());
	}

	function itemRemove(index: number) {
		itemDeactivate(index);
		remove(index);
	}

	let style = $derived('grid-template-columns:' + ' max-content'.repeat(columns) + ' 1fr;');
</script>

<div class="flex justify-between items-center">
	<div class={titleClass}>{title}</div>
	<Button icon="mdi:add" label="Add" clicked={itemAdd} disabled={active} />
</div>

{@render description?.()}

<div class="grid gap-x-6 gap-y-2" {style}>
	{#each items as item, index}
		{#if activeItem == index}
			<div
				class="col-span-full flex flex-col gap-4 p-4 grid card bg-surface-50-900-token shadow-sm"
			>
				{@render expanded(item, index)}

				<div class="flex justify-between">
					<Button
						icon="mdi-trash-can-outline"
						label="Delete"
						class="variant-outline-error"
						clicked={() => itemRemove(index)}
					/>
					<Button
						icon="mdi:check"
						label="Update"
						class="variant-filled-primary"
						clicked={() => itemDeactivate(index)}
						disabled={!valid}
					/>
				</div>
			</div>
		{:else}
			<div
				class="col-span-full grid grid-cols-subgrid items-center card bg-surface-50-900-token shadow-sm p-4"
			>
				{@render normal(item, index)}

				<div class="text-2xl flex gap-2 text-primary-500-400-token justify-self-end">
					<ButtonIcon
						icon="mdi:edit-outline"
						clicked={() => itemActivate(index)}
						disabled={active}
					/>
					<ButtonIcon
						icon="mdi:trash-can-outline"
						clicked={() => itemRemove(index)}
						disabled={active}
					/>
				</div>
			</div>
		{/if}
	{/each}
</div>
