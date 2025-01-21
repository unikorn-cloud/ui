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
	<iconify-icon {icon}></iconify-icon>
{/snippet}

{#if href}
	{#if disabled}
		<div class="text-surface-500">
			{@render content()}
		</div>
	{:else}
		<a {href} class="text-primary-500-400-token">
			{@render content()}
		</a>
	{/if}
{:else if clicked}
	<button
		class={disabled ? 'text-surface-300-600-token' : 'text-primary-500-400-token'}
		class:text-surface-500-600-token={disabled}
		{disabled}
		onclick={clicked}
		onkeypress={clicked}
	>
		{@render content()}
	</button>
{/if}
