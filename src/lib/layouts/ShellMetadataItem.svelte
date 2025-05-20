<script lang="ts">
	interface Props {
		icon: string;
		label: string;
		value: string;
	}

	let { icon, label, value }: Props = $props();
</script>

<div class="col-span-3 grid grid-cols-subgrid items-center text-sm">
	<iconify-icon class="text-lg text-primary-600-400" {icon}></iconify-icon>

	<div class="font-bold">
		{label}
	</div>

	<div>
		{value}
	</div>
</div>
