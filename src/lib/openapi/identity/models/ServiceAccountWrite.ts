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
import type { ResourceWriteMetadata } from './ResourceWriteMetadata';
import {
    ResourceWriteMetadataFromJSON,
    ResourceWriteMetadataFromJSONTyped,
    ResourceWriteMetadataToJSON,
} from './ResourceWriteMetadata';
import type { ServiceAccountSpec } from './ServiceAccountSpec';
import {
    ServiceAccountSpecFromJSON,
    ServiceAccountSpecFromJSONTyped,
    ServiceAccountSpecToJSON,
} from './ServiceAccountSpec';

/**
 * A service account creation request.
 * @export
 * @interface ServiceAccountWrite
 */
export interface ServiceAccountWrite {
    /**
     * 
     * @type {ResourceWriteMetadata}
     * @memberof ServiceAccountWrite
     */
    metadata: ResourceWriteMetadata;
    /**
     * 
     * @type {ServiceAccountSpec}
     * @memberof ServiceAccountWrite
     */
    spec: ServiceAccountSpec;
}

/**
 * Check if a given object implements the ServiceAccountWrite interface.
 */
export function instanceOfServiceAccountWrite(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "spec" in value;

    return isInstance;
}

export function ServiceAccountWriteFromJSON(json: any): ServiceAccountWrite {
    return ServiceAccountWriteFromJSONTyped(json, false);
}

export function ServiceAccountWriteFromJSONTyped(json: any, ignoreDiscriminator: boolean): ServiceAccountWrite {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': ResourceWriteMetadataFromJSON(json['metadata']),
        'spec': ServiceAccountSpecFromJSON(json['spec']),
    };
}

export function ServiceAccountWriteToJSON(value?: ServiceAccountWrite | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ResourceWriteMetadataToJSON(value.metadata),
        'spec': ServiceAccountSpecToJSON(value.spec),
    };
}

