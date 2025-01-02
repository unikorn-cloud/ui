<script lang="ts">
	import { run } from 'svelte/legacy';

	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Identity from '$lib/openapi/identity';
	import * as Formatters from '$lib/formatters';
	import * as Status from '$lib/status';
	import ShellMetadataItem from '$lib/layouts/ShellMetadataItem.svelte';
	import Badge from '$lib/layouts/Badge.svelte';

	import type { Snippet } from 'svelte';

	interface Props {
		metadata: Kubernetes.ResourceReadMetadata;
		projects?: Array<Identity.ProjectRead>;
		badges?: Snippet;
		tray?: Snippet;
		extraMetadata?: Snippet;
		content?: Snippet;
	}

	let { metadata, projects, badges, tray, extraMetadata, content }: Props = $props();

	function lookupProject(id: string): string {
		if (projects) {
			const project = projects.find((x) => x.metadata.id == id);
			if (project) {
				return project.metadata.name;
			}
		}

		return id;
	}

	let scope: string | undefined = $state();

	function updateScope(
		metadata: Kubernetes.ResourceReadMetadata,
		projects: Array<Identity.ProjectRead> | undefined
	) {
		if ('projectId' in metadata) {
			const projectMeta = metadata as Kubernetes.ProjectScopedResourceReadMetadata;
			scope = lookupProject(projectMeta.projectId);
		}
	}

	run(() => {
		updateScope(metadata, projects);
	});
</script>

<div
	class="card bg-surface-50-900-token border border-surface-300-600-token shadow-sm flex flex-col p-4"
>
	<div class="flex flex-col gap-3 w-full">
		<div class="flex justify-between">
			<div class="flex gap-2 items-center">
				<Badge icon={Status.icon(metadata)} iconcolor={Status.color(metadata)}>
					{metadata.provisioningStatus}
				</Badge>

				{@render badges?.()}
			</div>

			{#if tray}
				<div class="flex gap-2 items-center">
					{@render tray?.()}
				</div>
			{/if}
		</div>

		<div class="flex flex-col gap-1">
			<div class="font-bold">
				{#if scope}
					{scope}/{metadata.name}
				{:else}
					{metadata.name}
				{/if}
			</div>

			{#if metadata.description}
				<div class="text-sm italic text-surface-600-300-token">{metadata.description}</div>
			{/if}
		</div>

		<div class="flex flex-col gap-1 text-sm">
			<ShellMetadataItem icon="mdi:clock-time-five-outline">
				{Formatters.ageFormatter(metadata.creationTime)}
			</ShellMetadataItem>

			{#if metadata.createdBy}
				<ShellMetadataItem icon="mdi:user-outline">
					{metadata.createdBy}
				</ShellMetadataItem>
			{/if}

			{@render extraMetadata?.()}
		</div>
	</div>

	{@render content?.()}
</div>
