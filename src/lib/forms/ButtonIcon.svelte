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
		<div class="text-surface-300-700">
			{@render content()}
		</div>
	{:else}
		<a {href} class="text-primary-500">
			{@render content()}
		</a>
	{/if}
{:else if clicked}
	<button
		class={disabled ? 'text-surface-300-700' : 'text-primary-500'}
		class:text-surface-700-300={disabled}
		{disabled}
		onclick={clicked}
		onkeypress={clicked}
	>
		{@render content()}
	</button>
{/if}
