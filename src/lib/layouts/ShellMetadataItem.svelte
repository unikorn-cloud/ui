<script lang="ts">
	interface Props {
		icon: string;
		label: string;
		value?: string;
		children?: import('svelte').Snippet;
	}

	let { icon, label, value, children }: Props = $props();
</script>

<iconify-icon class="text-lg text-primary-600-300-token" {icon}></iconify-icon>

<div class="font-bold">
	{label}
</div>

{#if value}
	<div>
		{value}
	</div>
{:else if children}
	{@render children()}
{/if}
