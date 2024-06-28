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
 * This metadata is for resources that just exist, and don't require
 * any provisioning and health status, but benefit from a standarized
 * metadata format.
 * 
 * @export
 * @interface StaticResourceMetadata
 */
export interface StaticResourceMetadata {
    /**
     * A valid Kubenetes label value, typically used for resource names that can be
     * indexed in the database.
     * @type {string}
     * @memberof StaticResourceMetadata
     */
    name: string;
    /**
     * The resource description, this optionally augments the name with more context.
     * @type {string}
     * @memberof StaticResourceMetadata
     */
    description?: string;
    /**
     * The unique resource ID.
     * @type {string}
     * @memberof StaticResourceMetadata
     */
    id: string;
    /**
     * The time the resource was created.
     * @type {Date}
     * @memberof StaticResourceMetadata
     */
    creationTime: Date;
}

/**
 * Check if a given object implements the StaticResourceMetadata interface.
 */
export function instanceOfStaticResourceMetadata(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "creationTime" in value;

    return isInstance;
}

export function StaticResourceMetadataFromJSON(json: any): StaticResourceMetadata {
    return StaticResourceMetadataFromJSONTyped(json, false);
}

export function StaticResourceMetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): StaticResourceMetadata {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'id': json['id'],
        'creationTime': (new Date(json['creationTime'])),
    };
}

export function StaticResourceMetadataToJSON(value?: StaticResourceMetadata | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'description': value.description,
        'id': value.id,
        'creationTime': (value.creationTime.toISOString()),
    };
}
