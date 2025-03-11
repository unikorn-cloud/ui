<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon: string;
		title: string;
		children?: Snippet;
		confirm: () => void;
	}

	let { icon, title, children, confirm }: Props = $props();

	import { Modal } from '@skeletonlabs/skeleton-svelte';

	let open = $state(false);

	function close() {
		open = false;
	}

	function confirmAndClose() {
		confirm();
		close();
	}
</script>

<Modal
	{open}
	onOpenChange={(e) => (open = e.open)}
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
	triggerBase="btn flex items-center"
>
	{#snippet trigger()}
		<iconify-icon {icon} class="text-2xl"></iconify-icon>
	{/snippet}

	{#snippet content()}
		<header class="h2">
			{title}
		</header>

		<main>
			{@render children?.()}
		</main>

		<footer class="flex justify-between">
			<button type="button" class="btn preset-tonal" onclick={close}>Cancel</button>
			<button type="button" class="btn preset-filled" onclick={confirmAndClose}>Confirm</button>
		</footer>
	{/snippet}
</Modal>
