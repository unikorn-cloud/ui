/* tslint:disable */
/* eslint-disable */
/**
 * Unikorn Identity API
 * The Unikorn Identity API provides an OIDC compliant interface for use with all Unikorn services and proxies.  As it\'s intended use is for multi-tenant cloud deployments it acts as an aggregation layer for other 3rd party OIDC services, dispatching login requests to the required OIDC backend.
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * The provisioning state of a resource.
 * @export
 */
export const ResourceProvisioningStatus = {
    Unknown: 'unknown',
    Provisioning: 'provisioning',
    Provisioned: 'provisioned',
    Deprovisioning: 'deprovisioning',
    Error: 'error'
} as const;
export type ResourceProvisioningStatus = typeof ResourceProvisioningStatus[keyof typeof ResourceProvisioningStatus];


export function ResourceProvisioningStatusFromJSON(json: any): ResourceProvisioningStatus {
    return ResourceProvisioningStatusFromJSONTyped(json, false);
}

export function ResourceProvisioningStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResourceProvisioningStatus {
    return json as ResourceProvisioningStatus;
}

export function ResourceProvisioningStatusToJSON(value?: ResourceProvisioningStatus | null): any {
    return value as any;
}

