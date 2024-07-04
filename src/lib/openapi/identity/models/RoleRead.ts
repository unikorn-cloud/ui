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
import type { ResourceReadMetadata } from './ResourceReadMetadata';
import {
    ResourceReadMetadataFromJSON,
    ResourceReadMetadataFromJSONTyped,
    ResourceReadMetadataToJSON,
} from './ResourceReadMetadata';

/**
 * A role.
 * @export
 * @interface RoleRead
 */
export interface RoleRead {
    /**
     * 
     * @type {ResourceReadMetadata}
     * @memberof RoleRead
     */
    metadata: ResourceReadMetadata;
}

/**
 * Check if a given object implements the RoleRead interface.
 */
export function instanceOfRoleRead(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;

    return isInstance;
}

export function RoleReadFromJSON(json: any): RoleRead {
    return RoleReadFromJSONTyped(json, false);
}

export function RoleReadFromJSONTyped(json: any, ignoreDiscriminator: boolean): RoleRead {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': ResourceReadMetadataFromJSON(json['metadata']),
    };
}

export function RoleReadToJSON(value?: RoleRead | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ResourceReadMetadataToJSON(value.metadata),
    };
}

