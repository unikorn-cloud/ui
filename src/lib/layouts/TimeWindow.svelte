<script lang="ts">
	type Props = {
		title: string;
		checked?: boolean;
		start?: number;
		end?: number;
		min?: number;
		max?: number;
		onChange: (checked: boolean, start: number, end: number) => void;
	};

	let { title, checked = false, start = 0, end = 7, min = 0, max = 23, onChange }: Props = $props();

	let checkedState = $state(checked);
	let startState = $state(start);
	let endState = $state(end);

	function notify() {
		onChange(checkedState, startState, endState);
	}
</script>

<input class="checkbox" type="checkbox" bind:checked={checkedState} onchange={notify} />
{title}
<div class="flex gap-2">
	<input
		class="input"
		type="number"
		bind:value={startState}
		{min}
		{max}
		disabled={!checkedState}
		onchange={notify}
	/>
	&mdash;
	<input
		class="input"
		type="number"
		bind:value={endState}
		{min}
		{max}
		disabled={!checkedState}
		onchange={notify}
	/>
</div>
