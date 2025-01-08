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
		icon: string;
		metadata: Kubernetes.ResourceReadMetadata;
		projects?: Array<Identity.ProjectRead>;
		badges?: Snippet;
		tray?: Snippet;
		extraMetadata?: Snippet;
		content?: Snippet;
		href?: string;
	}

	let { icon, metadata, projects, badges, tray, extraMetadata, content, href }: Props = $props();

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

{#snippet meta()}
	<div class="flex flex-col gap-1">
		<div class="flex gap-2 items-center">
			<div class="h5 font-bold">
				{#if scope}
					{scope}/{metadata.name}
				{:else}
					{metadata.name}
				{/if}
			</div>
		</div>

		{#if metadata.description}
			<div class="text-sm italic text-surface-600-300-token">{metadata.description}</div>
		{/if}
	</div>
{/snippet}

<article
	class="flex flex-col gap-2 lg:gap-x-8 lg:gap-y-4 lg:col-span-full lg:grid lg:grid-cols-subgrid lg:items-center card bg-surface-50-900-token shadow-lg p-4"
>
	<iconify-icon {icon} class="col-start-1 text-5xl text-primary-600-300-token"></iconify-icon>

	<div class="col-start-2">
		{#if href}
			<a class="grow" {href}>
				{@render meta()}
			</a>
		{:else}
			{@render meta()}
		{/if}
	</div>

	<div class="col-start-3 flex gap-2 items-center">
		<Badge icon={Status.icon(metadata)} iconcolor={Status.color(metadata)}>
			{metadata.provisioningStatus}
		</Badge>

		{@render badges?.()}
	</div>

	<div class="col-start-4 flex flex-col gap-1 text-sm">
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

	<div class="col-start-5">
		{@render tray?.()}
	</div>
</article>
