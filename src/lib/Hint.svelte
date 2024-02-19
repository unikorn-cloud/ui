<section class="admonition">
	<iconify-icon icon="tabler:bulb" />
	<div>
		<slot />
	</div>
</section>

<style>
	section {
		display: flex;
		gap: var(--padding);
		align-items: center;
		padding: var(--padding-small);
	}
	iconify-icon {
		color: orange;
	}
</style>
