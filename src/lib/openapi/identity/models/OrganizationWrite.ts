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
import type { OrganizationSpec } from './OrganizationSpec';
import {
    OrganizationSpecFromJSON,
    OrganizationSpecFromJSONTyped,
    OrganizationSpecToJSON,
} from './OrganizationSpec';
import type { ResourceWriteMetadata } from './ResourceWriteMetadata';
import {
    ResourceWriteMetadataFromJSON,
    ResourceWriteMetadataFromJSONTyped,
    ResourceWriteMetadataToJSON,
} from './ResourceWriteMetadata';

/**
 * An organization when created or updated.
 * @export
 * @interface OrganizationWrite
 */
export interface OrganizationWrite {
    /**
     * 
     * @type {ResourceWriteMetadata}
     * @memberof OrganizationWrite
     */
    metadata: ResourceWriteMetadata;
    /**
     * 
     * @type {OrganizationSpec}
     * @memberof OrganizationWrite
     */
    spec: OrganizationSpec;
}

/**
 * Check if a given object implements the OrganizationWrite interface.
 */
export function instanceOfOrganizationWrite(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "spec" in value;

    return isInstance;
}

export function OrganizationWriteFromJSON(json: any): OrganizationWrite {
    return OrganizationWriteFromJSONTyped(json, false);
}

export function OrganizationWriteFromJSONTyped(json: any, ignoreDiscriminator: boolean): OrganizationWrite {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': ResourceWriteMetadataFromJSON(json['metadata']),
        'spec': OrganizationSpecFromJSON(json['spec']),
    };
}

export function OrganizationWriteToJSON(value?: OrganizationWrite | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ResourceWriteMetadataToJSON(value.metadata),
        'spec': OrganizationSpecToJSON(value.spec),
    };
}

