<script lang="ts">
	import type { Snippet } from 'svelte';

	import { popup } from '@skeletonlabs/skeleton';

	interface Props {
		id: string;
		icon: string;
		label: string;
		disabled?: boolean;
		content: Snippet;
		[key: string]: any;
	}

	let { id, icon, label, disabled = $bindable(), content, ...props }: Props = $props();
</script>

<button
	use:popup={{ event: 'click', target: id, placement: 'bottom-end' }}
	class="btn flex gap-2 items-center {props.class || ''}"
	{disabled}
>
	<iconify-icon {icon}> </iconify-icon>
	{label}
</button>

<div data-popup={id}>
	<div class="card p-4 shadow-lg">
		{@render content()}
	</div>
</div>
