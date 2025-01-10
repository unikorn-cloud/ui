<script lang="ts">
	import * as Identity from '$lib/openapi/identity';
	import * as Kubernetes from '$lib/openapi/kubernetes';

	interface Props {
		// This is the simple interface for non-unikorn reosurces.
		title?: string;
		// This is the interface for unikorn resources.
		metadata?: Kubernetes.ResourceReadMetadata;
		projects?: Array<Identity.ProjectRead>;
		// This causes the header to bcome a hyperlink.
		href?: string;
	}

	let { title, metadata, projects, href }: Props = $props();

	let scope = $derived.by(() => {
		if (!metadata || !projects || !('projectId' in metadata)) return;

		const projectMetadata = metadata as Kubernetes.ProjectScopedResourceReadMetadata;

		const project = projects.find(
			(x: Identity.ProjectRead) => x.metadata.id == projectMetadata.projectId
		);
		if (!project) return projectMetadata.projectId;

		return project.metadata.name;
	});
</script>

{#snippet header()}
	<header class="flex flex-col gap-1">
		<div class="h5 font-bold">
			{#if title}
				{title}
			{:else if metadata}
				{#if scope}
					{scope}/{metadata.name}
				{:else}
					{metadata.name}
				{/if}
			{/if}
		</div>

		{#if metadata?.description}
			<div class="text-sm italic text-surface-600-300-token">
				{metadata.description}
			</div>
		{/if}
	</header>
{/snippet}

{#if href}
	<a {href}>
		{@render header()}
	</a>
{:else}
	{@render header()}
{/if}
