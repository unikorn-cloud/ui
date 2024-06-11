/* tslint:disable */
/* eslint-disable */
/**
 * Kubernetes Region Service API
 * Cloud region discovery and routing service.
 *
 * The version of the OpenAPI document: 0.1.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * Resource metadata valid for all API resource reads and writes.
 * @export
 * @interface ResourceMetadata
 */
export interface ResourceMetadata {
    /**
     * A valid Kubenetes label value, typically used for resource names that can be
     * indexed in the database.
     * @type {string}
     * @memberof ResourceMetadata
     */
    name: string;
    /**
     * The resource description, this optionally augments the name with more context.
     * @type {string}
     * @memberof ResourceMetadata
     */
    description?: string;
}

/**
 * Check if a given object implements the ResourceMetadata interface.
 */
export function instanceOfResourceMetadata(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function ResourceMetadataFromJSON(json: any): ResourceMetadata {
    return ResourceMetadataFromJSONTyped(json, false);
}

export function ResourceMetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResourceMetadata {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
    };
}

export function ResourceMetadataToJSON(value?: ResourceMetadata | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'description': value.description,
    };
}

