import * as Identity from '$lib/openapi/identity';

export type OrganizationScope = {
	endpoint: string;
	operations: Array<Identity.AclOperation>;
};

export type ProjectScope = {
	projectID: string;
	endpoint: string;
	operations: Array<Identity.AclOperation>;
};

// This is the core of RBAC, we can do something if a named endpoint matches with
// the correct operation.
function operationAllowedEndpoint(
	e: Identity.AclEndpoint,
	endpoint: string,
	operations: Array<Identity.AclOperation>
): boolean {
	return e.name == endpoint && operations.every((x) => e.operations.includes(x));
}

// This finds a maching endpoint in a list.
function operationAllowedEndpoints(
	endpoints: Array<Identity.AclEndpoint> | undefined,
	endpoint: string,
	operations: Array<Identity.AclOperation>
): boolean {
	if (!endpoints) return false;

	return endpoints.some((e: Identity.AclEndpoint): boolean =>
		operationAllowedEndpoint(e, endpoint, operations)
	);
}

// This find a matching endpoint if the ID matches.
function operationAllowedScopedEndpoints(
	endpoints: Identity.AclScopedEndpoints | undefined,
	id: string,
	endpoint: string,
	operations: Array<Identity.AclOperation>
): boolean {
	if (!endpoints) return false;

	return id == endpoints.id && operationAllowedEndpoints(endpoints.endpoints, endpoint, operations);
}

// This finds a matching endpoint if the ID exists in a list of scoped endpoints.
function operationAllowedScopedEndpointsList(
	endpoints: Array<Identity.AclScopedEndpoints> | undefined,
	id: string,
	endpoint: string,
	operations: Array<Identity.AclOperation>
): boolean {
	if (!endpoints) return false;

	return endpoints.some((e: Identity.AclScopedEndpoints): boolean =>
		operationAllowedScopedEndpoints(e, id, endpoint, operations)
	);
}

// This is used to see if the ACL is permitted to perform
// an operation on a specific organization scoped endpoint.
function organizationOperationAllowed(
	acl: Identity.Acl,
	organizationID: string,
	endpoint: string,
	operations: Array<Identity.AclOperation>
): boolean {
	return (
		operationAllowedEndpoints(acl.global, endpoint, operations) ||
		operationAllowedScopedEndpoints(acl.organization, organizationID, endpoint, operations)
	);
}

// This is used to see if the ACL is permitted to perform
// an operation on a specific project scoped endpoint.
function projectOperationAllowed(
	acl: Identity.Acl,
	organizationID: string,
	projectID: string,
	endpoint: string,
	operations: Array<Identity.AclOperation>
): boolean {
	return (
		organizationOperationAllowed(acl, organizationID, endpoint, operations) ||
		operationAllowedScopedEndpointsList(acl.projects, projectID, endpoint, operations)
	);
}

export function organizationScopesAllowed(
	acl: Identity.Acl,
	organizationID: string,
	scopes: Array<OrganizationScope>
): boolean {
	return scopes.every((scope) =>
		organizationOperationAllowed(acl, organizationID, scope.endpoint, scope.operations)
	);
}

export function projectScopesAllowed(
	acl: Identity.Acl,
	organizationID: string,
	scopes: Array<ProjectScope>
): boolean {
	return scopes.every((scope) =>
		projectOperationAllowed(acl, organizationID, scope.projectID, scope.endpoint, scope.operations)
	);
}
