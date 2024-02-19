<article class="widget widget-selected">
	<slot />
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: var(--padding);
		grid-column: 1 / -1;
		padding: var(--padding);
	}
</style>
