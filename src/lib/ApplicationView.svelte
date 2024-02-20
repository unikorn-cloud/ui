<script>
	import { onDestroy } from 'svelte';
	import { token, removeCredentials } from '$lib/credentials.js';
	import { client } from '$lib/client.js';

	import View from '$lib/View.svelte';
	import ItemView from '$lib/ItemView.svelte';
	import Hint from '$lib/Hint.svelte';
	import Details from '$lib/Details.svelte';

	let accessToken;

	let applications = [];

	const tokenUnsubscribe = token.subscribe(changeToken);

	const ticker = setInterval(() => updateApplictions(accessToken), 10000);

	onDestroy(() => {
		clearInterval(ticker);
		tokenUnsubscribe();
	});

	function changeToken(value) {
		applications = [];

		accessToken = value;
	}

	async function updateApplictions(accessToken) {
		if (accessToken == null) {
			applications = [];
			return;
		}

		try {
			applications = await client(accessToken).apiV1ApplicationsGet();
		} catch (error) {
			console.log(error);

			if (error.response.status == 401) {
				removeCredentials();
			}
		}
	}

	$: updateApplictions(accessToken);
</script>

<View>
	<h1>Applications</h1>
	<p>Deploy applications on exiting or dynamically provisioned clusters.</p>

	<Hint>Select an application for more details.</Hint>

	<ItemView items={applications}>
		<svelte:fragment slot="header" let:item>
			<h5>{item.humanReadableName}</h5>
		</svelte:fragment>

		<svelte:fragment slot="main" let:item>
			<div class="image-wrapper">
				{@html atob(item.icon)}
			</div>
		</svelte:fragment>

		<svelte:fragment slot="detail" let:item>
			<dl>
				<dt>Description</dt>
				<dd>{item.description}</dd>
				<dt>Documentation</dt>
				<dd><a href={item.documentation}>{item.documentation}</a></dd>
				<dt>License</dt>
				<dd>{item.license}</dd>
				<dt>Tags</dt>
				<dd>{item.tags.join(', ')}</dd>
				<dt>Versions</dt>
				<dd>
					{#each item.versions as version}
						<Details summary={version.version} icon="mdi:cogs">
							<dl>
								{#if version.dependencies}
									<dt>Dependencies</dt>
									<dd>{version.dependencies.map((x) => x.name).join(', ')}</dd>
								{/if}
								{#if version.recommends}
									<dt>Recommends</dt>
									<dd>{version.recommends.map((x) => x.name).join(', ')}</dd>
								{/if}
							</dl>
						</Details>
					{/each}
				</dd>
			</dl>
		</svelte:fragment>
	</ItemView>
</View>

<style>
	h5 {
		text-align: center;
	}
	div.image-wrapper {
		height: 5rem;
	}
	div.image-wrapper > :global(svg) {
		max-width: 10rem;
		max-height: 5rem;
		display: block;
		margin: auto;
	}
</style>
