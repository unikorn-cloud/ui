<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import { ListBox } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import type { SizeOptions } from '@floating-ui/dom';

	// Unique element ID.
	export let id: string;

	// Label to attach describing the input.
	export let label: string;

	// Formatting hint.
	export let hint: string = '';

	let sizeOptions: SizeOptions = {
		apply({ rects, elements }) {
			Object.assign(elements.floating.style, {
				width: `${rects.reference.width}px`
			});
		}
	};

	let settings: PopupSettings = {
		event: 'click',
		target: `select-${id}`,
		closeQuery: '.listbox-item',
		middleware: {
			size: sizeOptions
		}
	};
</script>

<div class="flex flex-col gap-1">
	<div>{label}</div>

	{#if hint}
		<div class="text-xs italic text-surface-500">{hint}</div>
	{/if}
</div>

<button class="btn variant-ghost w-full justify-between" use:popup={settings}>
	<slot name="selected_body" />
	<iconify-icon icon="ph:caret-down-bold" />
</button>

<div class="z-10" data-popup={`select-${id}`}>
	<div class="card shadow-xl">
		<ListBox>
			<slot />
		</ListBox>
	</div>
</div>
