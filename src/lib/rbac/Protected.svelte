<script lang="ts">
	import * as Identity from '$lib/openapi/identity';
	import * as RBAC from '$lib/rbac';
	import * as Stores from '$lib/stores';

	// All protected content must have at least one scope, and they all must pass
	// to show the content.
	export let organizationScopes: Array<RBAC.OrganizationScope> | null = null;
	export let projectScopes: Array<RBAC.ProjectScope> | null = null;

	// Users can bind to this as a trigger to dispatch any async API calls
	// once the RBAC checks have succeeded.
	export let allowed: boolean = false;

	// Need an organization ID and  ACL.
	let organizationInfo: Stores.OrganizationInfo;

	Stores.organizationStore.subscribe((v: Stores.OrganizationInfo) => {
		organizationInfo = v;

		update(organizationScopes, projectScopes);
	});

	function organizationScopesAllowed(scopes: Array<RBAC.OrganizationScope> | null): boolean {
		return (scopes || []).every((scope: RBAC.OrganizationScope) =>
			RBAC.organizationOperationAllowed(
				organizationInfo?.acl,
				organizationInfo?.id,
				scope.endpoint,
				scope.operation
			)
		);
	}

	function projectScopesAllowed(scopes: Array<RBAC.ProjectScope> | null): boolean {
		return (scopes || []).every((scope: RBAC.ProjectScope) =>
			RBAC.projectOperationAllowed(
				organizationInfo?.acl,
				organizationInfo?.id,
				scope.projectID,
				scope.endpoint,
				scope.operation
			)
		);
	}

	function update(
		organizationScopes: Array<RBAC.OrganizationScope> | null,
		projectScopes: Array<RBAC.ProjectScope> | null
	) {
		if (!organizationScopes && !projectScopes) {
			allowed = false;
			return;
		}

		allowed = organizationScopesAllowed(organizationScopes) && projectScopesAllowed(projectScopes);
	}

	$: update(organizationScopes, projectScopes);
</script>

{#if allowed}
	<slot />
{:else}
	<aside class="alert variant-filled-error shadow-lg">
		<iconify-icon class="text-7xl" icon="mdi:shield-alert-outline" />

		<div class="alert-message">
			<h3 class="h3">Access Denied</h3>
			<p>
				You are not permitted to view this content. Contact an administrator from your organization
				to be granted access.
			</p>
		</div>
	</aside>
{/if}
