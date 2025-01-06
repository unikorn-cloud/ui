<script lang="ts">
	interface Props {
		icon: string;
		href?: string | null;
		children?: import('svelte').Snippet;
		clicked?: () => void;
	}

	let { icon, href = null, children, clicked }: Props = $props();
</script>

<li>
	<a class="flex gap-4 items-center" {href} onclick={clicked} onkeypress={clicked}>
		<iconify-icon {icon}></iconify-icon>
		{@render children?.()}
	</a>
</li>
