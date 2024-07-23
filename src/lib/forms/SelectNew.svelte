<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import { ListBox } from '@skeletonlabs/skeleton';

	// Unique element ID.
	export let id: string;

	// Label to attach describing the input.
	export let label: string;

	// Formatting hint.
	export let hint: string = '';
</script>

<div class="flex flex-col gap-1">
	<div>{label}</div>

	{#if hint}
		<div class="text-xs italic text-surface-500">{hint}</div>
	{/if}
</div>

<button
	class="btn variant-ghost w-full justify-between"
	use:popup={{ event: 'click', target: `select-${id}`, closeQuery: '.listbox-item' }}
>
	<slot name="selected_body" />
	<iconify-icon icon="ph:caret-down-bold" />
</button>

<div class="w-full py-2i z-10" data-popup={`select-${id}`}>
	<div class="card shadow-xl mx-4">
		<ListBox>
			<slot />
		</ListBox>
	</div>
</div>
