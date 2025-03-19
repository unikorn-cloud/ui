<script lang="ts">
	interface Props {
		icon: string;
		disabled?: boolean;
		href?: string;
		clicked?: () => void;
	}

	let { icon, disabled = $bindable(), href, clicked }: Props = $props();
</script>

{#snippet content()}
	<iconify-icon {icon} class="text-2xl"></iconify-icon>
{/snippet}

{#if href}
	{#if disabled}
		<div class="text-surface-300-700">
			{@render content()}
		</div>
	{:else}
		<a {href} class="text-primary-600-400">
			{@render content()}
		</a>
	{/if}
{:else if clicked}
	<button
		class="btn"
		class:text-surface-700-300={disabled}
		{disabled}
		onclick={clicked}
		onkeypress={clicked}
	>
		{@render content()}
	</button>
{/if}
