<section>
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
		background: var(--overlay);
		backdrop-filter: blur(var(--radius));
		border-radius: var(--radius);
		padding: var(--padding-small);
		box-shadow: 0 0 var(--radius) var(--shadow);
	}
	iconify-icon {
		color: orange;
	}
</style>
