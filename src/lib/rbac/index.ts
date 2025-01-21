import * as Identity from '$lib/openapi/identity';

export type OrganizationScope = {
	endpoint: string;
	operation: Identity.AclOperation;
};

export type ProjectScope = {
	projectID: string;
	endpoint: string;
	operation: Identity.AclOperation;
};

// This is the core of RBAC, we can do something if a named endpoint matches with
// the correct operation.
function operationAllowedEndpoint(
	e: Identity.AclEndpoint,
	endpoint: string,
	operation: Identity.AclOperation
): boolean {
	return e.name == endpoint && e.operations.includes(operation);
}

// This finds a maching endpoint in a list.
function operationAllowedEndpoints(
	endpoints: Array<Identity.AclEndpoint> | undefined,
	endpoint: string,
	operation: Identity.AclOperation
): boolean {
	if (!endpoints) return false;

	return endpoints.some((e: Identity.AclEndpoint): boolean =>
		operationAllowedEndpoint(e, endpoint, operation)
	);
}

// This find a matching endpoint if the ID matches.
function operationAllowedScopedEndpoints(
	endpoints: Identity.AclScopedEndpoints | undefined,
	id: string,
	endpoint: string,
	operation: Identity.AclOperation
): boolean {
	if (!endpoints) return false;

	return id == endpoints.id && operationAllowedEndpoints(endpoints.endpoints, endpoint, operation);
}

// This finds a matching endpoint if the ID exists in a list of scoped endpoints.
function operationAllowedScopedEndpointsList(
	endpoints: Array<Identity.AclScopedEndpoints> | undefined,
	id: string,
	endpoint: string,
	operation: Identity.AclOperation
): boolean {
	if (!endpoints) return false;

	return endpoints.some((e: Identity.AclScopedEndpoints): boolean =>
		operationAllowedScopedEndpoints(e, id, endpoint, operation)
	);
}

// This is used to see if the ACL is permitted to perform
// an operation on a specific organization scoped endpoint.
function organizationOperationAllowed(
	acl: Identity.Acl,
	organizationID: string,
	endpoint: string,
	operation: Identity.AclOperation
): boolean {
	if (!acl) return false;

	return (
		operationAllowedEndpoints(acl.global, endpoint, operation) ||
		operationAllowedScopedEndpoints(acl.organization, organizationID, endpoint, operation)
	);
}

// This is used to see if the ACL is permitted to perform
// an operation on a specific project scoped endpoint.
function projectOperationAllowed(
	acl: Identity.Acl,
	organizationID: string,
	projectID: string,
	endpoint: string,
	operation: Identity.AclOperation
): boolean {
	if (!acl) return false;

	return (
		organizationOperationAllowed(acl, organizationID, endpoint, operation) ||
		operationAllowedScopedEndpointsList(acl.projects, projectID, endpoint, operation)
	);
}

export function organizationScopesAllowed(
	acl: Identity.Acl,
	organizationID: string,
	scopes: Array<OrganizationScope>
): boolean {
	return scopes.every((scope) =>
		organizationOperationAllowed(acl, organizationID, scope.endpoint, scope.operation)
	);
}

export function projectScopesAllowed(
	acl: Identity.Acl,
	organizationID: string,
	scopes: Array<ProjectScope>
): boolean {
	return scopes.every((scope) =>
		projectOperationAllowed(acl, organizationID, scope.projectID, scope.endpoint, scope.operation)
	);
}
