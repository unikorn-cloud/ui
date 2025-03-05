<script lang="ts">
	interface Props {
		id: string;
		value: string;
	}

	let { id, value }: Props = $props();

	function copyToClipboard() {
		const input = document.getElementById(id) as HTMLInputElement;
		if (!input) return;

		navigator.clipboard.writeText(input.value);
	}
</script>

<div class="input-group input-group-divider grid-cols-[1fr_auto]">
	<input
		{id}
		{value}
		type="text"
		disabled
		class="overflow-hidden text-ellipsis whitespace-nowrap"
	/>
	<button
		class="preset-filled-primary-500 flex items-center gap-2"
		onclick={() => copyToClipboard()}
		onkeypress={() => copyToClipboard()}
	>
		<iconify-icon icon="mdi:clipboard-outline"></iconify-icon>
		<span>Copy</span>
	</button>
</div>
