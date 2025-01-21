<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import { ListBox } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import type { SizeOptions } from '@floating-ui/dom';

	interface Props {
		// Unique element ID.
		id: string;
		// Label to attach describing the input.
		label: string;
		// Formatting hint.
		hint?: string;
		selected_body?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { id, label, hint = '', selected_body, children }: Props = $props();

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

<button class="btn variant-ghost shadow-lg w-full justify-between" use:popup={settings}>
	{@render selected_body?.()}
	<iconify-icon icon="ph:caret-down-bold"></iconify-icon>
</button>

<div class="z-10" data-popup={`select-${id}`}>
	<div class="card shadow-xl">
		<ListBox>
			{@render children?.()}
		</ListBox>
	</div>
</div>
