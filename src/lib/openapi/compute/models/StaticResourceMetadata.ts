/* tslint:disable */
/* eslint-disable */
/**
 * Compute Service API
 * The Compute Service API provides services that allows provisioning and life cycle management of Compute clusters. Requests must specify the HTML content type header.
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { Tag } from './Tag';
import {
    TagFromJSON,
    TagFromJSONTyped,
    TagToJSON,
} from './Tag';

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
     * A list of tags.
     * @type {Array<Tag>}
     * @memberof StaticResourceMetadata
     */
    tags?: Array<Tag>;
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
        'tags': !exists(json, 'tags') ? undefined : ((json['tags'] as Array<any>).map(TagFromJSON)),
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
        'tags': value.tags === undefined ? undefined : ((value.tags as Array<any>).map(TagToJSON)),
        'id': value.id,
        'creationTime': (value.creationTime.toISOString()),
        'createdBy': value.createdBy,
        'modifiedTime': value.modifiedTime === undefined ? undefined : (value.modifiedTime.toISOString()),
        'modifiedBy': value.modifiedBy,
    };
}
