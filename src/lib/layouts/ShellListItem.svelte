<script lang="ts">
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Identity from '$lib/openapi/identity';
	import StatusIcon from '$lib/StatusIcon.svelte';

	export let metadata: Kubernetes.ResourceReadMetadata;
	export let projects: Array<Identity.ProjectRead> = [];
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

	function age(metadata: Kubernetes.ResourceReadMetadata): string {
		// Get age of the instance in seconds.
		const now = Date.now();

		let age = Math.round((now - metadata.creationTime.valueOf()) / 1000);

		const seconds = age % 60;
		age = Math.round(age / 60);

		if (!age) return `${seconds}s`;

		const minutes = age % 60;
		age = Math.round(age / 60);

		if (!age) return `${minutes}m ${seconds}s`;

		const hours = age % 24;
		age = Math.round(age / 24);

		if (!age) return `${hours}h ${minutes}m ${seconds}s`;

		return `${age}d ${hours}h ${minutes}m ${seconds}s`;
	}
</script>

<div class="flex flex-col lg:flex-row gap-4 items-top justify-between variant-glass rounded-lg p-4">
	<div class="flex flex-col gap-4">
		<div class="flex gap-4 items-center">
			<StatusIcon {metadata} />
			<div class="badge variant-soft">
				{metadata.provisioningStatus}
			</div>
		</div>

		<div class="flex gap-4 items-center">
			{#if scope}
				<a class="font-bold" {href}>{scope}/{metadata.name}</a>
			{:else}
				<a class="font-bold" {href}>{metadata.name}</a>
			{/if}
		</div>
		{#if metadata.description}
			<em>{metadata.description}</em>
		{/if}

		<div class="flex flex-col gap-2 text-sm">
			<div class="flex gap-2 items-center text-sm">
				<iconify-icon icon="mdi:clock-time-five-outline"></iconify-icon>
				{age(metadata)}
			</div>

			{#if metadata.createdBy}
				<div class="flex gap-2 items-center">
					<iconify-icon icon="mdi:user-outline"></iconify-icon>
					{metadata.createdBy}
				</div>
			{/if}
		</div>
	</div>

	<slot />
</div>
