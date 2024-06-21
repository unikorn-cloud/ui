<script lang="ts">
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Identity from '$lib/openapi/identity';
	import StatusIcon from '$lib/StatusIcon.svelte';

	export let metadata: Kubernetes.ResourceReadMetadata;
	export let projects: Identity.Projects = [];
	export let href: string;

	function lookupProject(id: string): string {
		if (projects) {
			const project = projects.find((x) => x.metadata.id == id);
			if (project) {
				return project.metadata.name;
			}
		}

		return id;
	}

	let scope: string;

	if ('projectId' in metadata) {
		const projectMeta = metadata as Kubernetes.ProjectScopedResourceReadMetadata;
		scope = lookupProject(projectMeta.projectId);
	}
</script>

<div class="flex gap-4 items-center justify-between variant-glass rounded-lg p-4">
	<header class="flex items-center gap-4">
		<StatusIcon {metadata} />
		{#if scope}
			<a class="font-bold" {href}>{scope}/{metadata.name}</a>
		{:else}
			<a class="font-bold" {href}>{metadata.name}</a>
		{/if}
		{#if metadata.description}
			<em>{metadata.description}</em>
		{/if}
	</header>

	<slot />
</div>
