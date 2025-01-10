<script lang="ts">
	interface Props {
		icon: string;
		label: string;
		disabled?: boolean;
		href?: string;
		clicked?: () => void;
		variant?: string;
	}

	let {
		icon,
		label,
		disabled = $bindable(),
		href,
		clicked,
		variant = 'variant-outline-primary'
	}: Props = $props();
</script>

{#snippet content()}
	<iconify-icon {icon}></iconify-icon>
	<div>{label}</div>
{/snippet}

{#if href}
	<a {href}>
		<div class="btn {variant} shadow flex gap-2 items-center">
			{@render content()}
		</div>
	</a>
{:else if clicked}
	<button
		class="btn {variant} flex gap-2 items-center"
		{disabled}
		onclick={clicked}
		onkeypress={clicked}
	>
		{@render content()}
	</button>
{/if}
