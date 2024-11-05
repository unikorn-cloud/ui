/* tslint:disable */
/* eslint-disable */
/**
 * Application Service API
 * The application service is a layer that sits on top of the Kubernetes service and allows the provisioning of applications onto managed Kubernetes clusters. This yields a higher level PaaS solution.
 *
 * The version of the OpenAPI document: 0.2.0
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
    /**
     * The user who created the resource.
     * @type {string}
     * @memberof StaticResourceMetadata
     */
    createdBy?: string;
    /**
     * The time a resource was updated.
     * @type {Date}
     * @memberof StaticResourceMetadata
     */
    modifiedTime?: Date;
    /**
     * The user who updated the resource.
     * @type {string}
     * @memberof StaticResourceMetadata
     */
    modifiedBy?: string;
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
        'createdBy': !exists(json, 'createdBy') ? undefined : json['createdBy'],
        'modifiedTime': !exists(json, 'modifiedTime') ? undefined : (new Date(json['modifiedTime'])),
        'modifiedBy': !exists(json, 'modifiedBy') ? undefined : json['modifiedBy'],
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
        'createdBy': value.createdBy,
        'modifiedTime': value.modifiedTime === undefined ? undefined : (value.modifiedTime.toISOString()),
        'modifiedBy': value.modifiedBy,
    };
}

