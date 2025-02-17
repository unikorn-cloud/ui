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

import { exists, mapValues } from '../runtime';
import type { OrganizationScopedResourceReadMetadata } from './OrganizationScopedResourceReadMetadata';
import {
    OrganizationScopedResourceReadMetadataFromJSON,
    OrganizationScopedResourceReadMetadataFromJSONTyped,
    OrganizationScopedResourceReadMetadataToJSON,
} from './OrganizationScopedResourceReadMetadata';
import type { ServiceAccountSpec } from './ServiceAccountSpec';
import {
    ServiceAccountSpecFromJSON,
    ServiceAccountSpecFromJSONTyped,
    ServiceAccountSpecToJSON,
} from './ServiceAccountSpec';
import type { ServiceAccountStatus } from './ServiceAccountStatus';
import {
    ServiceAccountStatusFromJSON,
    ServiceAccountStatusFromJSONTyped,
    ServiceAccountStatusToJSON,
} from './ServiceAccountStatus';

/**
 * A service account.
 * @export
 * @interface ServiceAccountRead
 */
export interface ServiceAccountRead {
    /**
     * 
     * @type {OrganizationScopedResourceReadMetadata}
     * @memberof ServiceAccountRead
     */
    metadata: OrganizationScopedResourceReadMetadata;
    /**
     * 
     * @type {ServiceAccountSpec}
     * @memberof ServiceAccountRead
     */
    spec: ServiceAccountSpec;
    /**
     * 
     * @type {ServiceAccountStatus}
     * @memberof ServiceAccountRead
     */
    status: ServiceAccountStatus;
}

/**
 * Check if a given object implements the ServiceAccountRead interface.
 */
export function instanceOfServiceAccountRead(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "spec" in value;
    isInstance = isInstance && "status" in value;

    return isInstance;
}

export function ServiceAccountReadFromJSON(json: any): ServiceAccountRead {
    return ServiceAccountReadFromJSONTyped(json, false);
}

export function ServiceAccountReadFromJSONTyped(json: any, ignoreDiscriminator: boolean): ServiceAccountRead {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': OrganizationScopedResourceReadMetadataFromJSON(json['metadata']),
        'spec': ServiceAccountSpecFromJSON(json['spec']),
        'status': ServiceAccountStatusFromJSON(json['status']),
    };
}

export function ServiceAccountReadToJSON(value?: ServiceAccountRead | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': OrganizationScopedResourceReadMetadataToJSON(value.metadata),
        'spec': ServiceAccountSpecToJSON(value.spec),
        'status': ServiceAccountStatusToJSON(value.status),
    };
}

