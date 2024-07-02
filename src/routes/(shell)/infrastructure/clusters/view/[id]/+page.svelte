<script lang="ts">
	import { page } from '$app/stores';

	/* Page setup */
	import type { ShellPageSettings } from '$lib/layouts/types.ts';
	import ShellPage from '$lib/layouts/ShellPage.svelte';
	import ShellMetadataSection from '$lib/layouts/ShellMetadataSection.svelte';
	import ShellSection from '$lib/layouts/ShellSection.svelte';

	const settings: ShellPageSettings = {
		feature: 'Infrastructure',
		name: 'View/update Kubernetes Cluster',
		description: 'Update an existing Kubernetes cluster.'
	};

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { Stepper, Step } from '@skeletonlabs/skeleton';

	import { organizationStore } from '$lib/stores';

	/* Client setup */
	import * as Clients from '$lib/clients';
	import type { InternalToken } from '$lib/oauth2';
	import { token } from '$lib/credentials';
	import * as Kubernetes from '$lib/openapi/kubernetes';
	import * as Region from '$lib/openapi/region';

	let at: InternalToken;
	let organizationID: string;
	let projectID: string;
	let regionID: string;
	let allClusters: Array<Kubernetes.KubernetesClusterRead>;
	let clusters: Array<Kubernetes.KubernetesClusterRead>;
	let resource: Kubernetes.KubernetesClusterRead;
	let images: Array<Region.Image>;
	let flavors: Array<Region.Flavor>;
	let versions: Array<string>;

	let poolValid: Array<boolean> = [];

	organizationStore.subscribe((value: string) => {
		organizationID = value;
	});

	token.subscribe((value: InternalToken) => {
		at = value;
	});

	// Get all clusters in the organization.
	function updateAllClusters(at: InternalToken, organizationID: string): void {
		if (!at || !organizationID) return;

		const parameters = {
			organizationID: organizationID
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDClustersGet(parameters)
			.then((v: Array<Kubernetes.KubernetesClusterRead>) => {
				allClusters = v;
			})
			.catch((e: Error) => Clients.error(e));
	}

	$: updateAllClusters(at, organizationID);

	// Find our cluster.
	function updateCuster(clusters: Array<Kubernetes.KubernetesClusterRead>) {
		if (!clusters) return;

		const temp = clusters.find((x) => x.metadata.id == $page.params.id);
		if (!temp) return;

		resource = temp;

		// Extract immutable data, or stuff that triggers API calls, we don't
		// want them being invoked for ever object update!
		projectID = temp.metadata.projectId;
		regionID = temp.spec.regionId;

		for (let i = 0; i < resource.spec.workloadPools.length; i++) {
			poolValid.push(false);
		}

		poolValid = poolValid;

		const temp2 = allClusters.filter((x) => x.metadata.projectId == temp.metadata.projectId);
		if (!temp2) return;

		clusters = temp2;
	}

	$: updateCuster(allClusters);

	$: names = (clusters || [])
		.filter((x) => x.metadata.id != $page.params.id)
		.map((x) => x.metadata.name);

	let metadataValid = false;

	/* Cluster name must be valid, and it must be unique */
	$: step2Valid = metadataValid;

	/* Once the region has been selected we can poll the images and other resources */
	function updateImages(
		at: InternalToken,
		organizationID: string,
		projectID: string,
		regionID: string
	): void {
		if (!at || !organizationID || !projectID || !regionID) return;

		const parameters = {
			organizationID: organizationID,
			projectID: projectID,
			regionID: regionID
		};

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGet(parameters)
			.then((v: Array<Region.Image>) => (images = v))
			.catch((e: Error) => Clients.error(e));
	}

	function updateFlavors(
		at: InternalToken,
		organizationID: string,
		projectID: string,
		regionID: string
	): void {
		if (!at || !organizationID || !projectID || !regionID) return;

		const parameters = {
			organizationID: organizationID,
			projectID: projectID,
			regionID: regionID
		};

		Clients.region(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGet(parameters)
			.then((v: Array<Region.Flavor>) => (flavors = v))
			.catch((e: Error) => Clients.error(e));
	}

	$: updateImages(at, organizationID, projectID, regionID);
	$: updateFlavors(at, organizationID, projectID, regionID);

	/* From the images, we can get a list of Kubernetes versions */
	function updateVersions(at: InternalToken, images: Array<Region.Image>): void {
		if (!at || !images) return;

		versions = [
			...new Set(
				(images || []).map((x) => {
					if (!x.spec.softwareVersions || !x.spec.softwareVersions.kubernetes) return '';
					return x.spec.softwareVersions.kubernetes;
				})
			)
		].reverse();

		resource.spec.version = versions[0];
	}

	$: updateVersions(at, images);

	function addPool(): void {
		let pool: Kubernetes.KubernetesClusterWorkloadPool = {
			name: '',
			machine: {
				replicas: 3,
				disk: {
					size: 50
				}
			},
			autoscaling: {
				minimumReplicas: 0
			}
		};

		resource.spec.workloadPools.push(pool);
		poolValid.push(false);

		// Array so trigger an update.
		resource.spec.workloadPools = resource.spec.workloadPools;
		poolValid = poolValid;
	}

	function removePool(index: number): void {
		resource.spec.workloadPools.splice(index, 1);
		poolValid.splice(index, 1);

		// Array so trigger an update.
		resource.spec.workloadPools = resource.spec.workloadPools;
		poolValid = poolValid;
	}

	import WorkloadPoolCreate from '$lib/WorkloadPoolCreate.svelte';

	/* There must be at least one workload pool, all of them must be valid and every pool must have a unique name */
	$: step3Valid =
		resource &&
		resource.spec.workloadPools.length > 0 &&
		poolValid.every((x) => x) &&
		[...new Set(resource.spec.workloadPools.map((x) => x.name))].length ==
			resource.spec.workloadPools.length;

	function complete() {
		const parameters = {
			organizationID: organizationID,
			projectID: projectID,
			clusterID: resource.metadata.id,
			kubernetesClusterWrite: resource
		};

		Clients.kubernetes(toastStore, at)
			.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPut(parameters)
			.then(() => window.location.assign('/infrastructure/clusters'))
			.catch((e: Error) => Clients.error(e));
	}
</script>

<ShellPage {settings}>
	{#if resource}
		<Stepper on:complete={complete}>
			<Step locked={!step2Valid}>
				<svelte:fragment slot="header">Basic Cluster Setup</svelte:fragment>

				<ShellMetadataSection metadata={resource.metadata} {names} bind:valid={metadataValid} />

				<ShellSection title="Platform Configuration">
					<label for="kubernetes-version">
						Select a Kubernetes version to provision. Kubernetes provides guarantees backward
						compatibility so choosing the newest is usually the right choice as that provides a rich
						feature set and enhanced security. Certain applications &mdash; e.g. Kubeflow &mdash;
						may require a specific version.
					</label>
					<select id="kubernetes-version" class="select" value={resource.spec.version}>
						{#each versions || [] as version}
							<option value={version}>{version}</option>
						{/each}
					</select>
				</ShellSection>
			</Step>
			<Step locked={!step3Valid}>
				<svelte:fragment slot="header">Worker Setup</svelte:fragment>

				<ShellSection title="Workload Pool Configuration">
					<p>
						Workload pools provide compute resouce for your cluster. You may have as many as
						required for your workload. Each pool has a set of CPU, GPU and memory that can be
						selected from a defined set of flavours. Workload pools support automatic scaling, thus
						reducing overall operational cost when not in use.
					</p>

					{#each resource.spec.workloadPools as pool, i}
						<article class="bg-surface-50-900-token rounded-lg p-8 flex flex-col gap-8">
							<WorkloadPoolCreate {flavors} bind:pool bind:valid={poolValid[i]} />

							<button
								class="btn flex variant-filled-tertiary gap-2 items-center self-start"
								on:click={() => removePool(i)}
								on:keypress={() => removePool(i)}
							>
								<iconify-icon icon="mdi:minus" />
								<span>Remove Pool</span>
							</button>
						</article>
					{/each}

					<button
						class="btn variant-filled-tertiary flex gap-2 items-center"
						on:click={addPool}
						on:keypress={addPool}
					>
						<iconify-icon icon="mdi:add" />
						<span>Add New Pool</span>
					</button>
				</ShellSection>
			</Step>
			<Step>
				<svelte:fragment slot="header">Confirmation</svelte:fragment>

				<p>Insert a summary of what's about to be created...</p>
			</Step>
		</Stepper>
	{/if}
</ShellPage>
