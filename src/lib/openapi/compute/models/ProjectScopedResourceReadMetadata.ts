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
import type { ResourceProvisioningStatus } from './ResourceProvisioningStatus';
import {
    ResourceProvisioningStatusFromJSON,
    ResourceProvisioningStatusFromJSONTyped,
    ResourceProvisioningStatusToJSON,
} from './ResourceProvisioningStatus';
import type { Tag } from './Tag';
import {
    TagFromJSON,
    TagFromJSONTyped,
    TagToJSON,
} from './Tag';

/**
 * 
 * @export
 * @interface ProjectScopedResourceReadMetadata
 */
export interface ProjectScopedResourceReadMetadata {
    /**
     * A valid Kubenetes label value, typically used for resource names that can be
     * indexed in the database.
     * @type {string}
     * @memberof ProjectScopedResourceReadMetadata
     */
    name: string;
    /**
     * The resource description, this optionally augments the name with more context.
     * @type {string}
     * @memberof ProjectScopedResourceReadMetadata
     */
    description?: string;
    /**
     * A list of tags.
     * @type {Array<Tag>}
     * @memberof ProjectScopedResourceReadMetadata
     */
    tags?: Array<Tag>;
    /**
     * The unique resource ID.
     * @type {string}
     * @memberof ProjectScopedResourceReadMetadata
     */
    id: string;
    /**
     * The time the resource was created.
     * @type {Date}
     * @memberof ProjectScopedResourceReadMetadata
     */
    creationTime: Date;
    /**
     * The user who created the resource.
     * @type {string}
     * @memberof ProjectScopedResourceReadMetadata
     */
    createdBy?: string;
    /**
     * The time a resource was updated.
     * @type {Date}
     * @memberof ProjectScopedResourceReadMetadata
     */
    modifiedTime?: Date;
    /**
     * The user who updated the resource.
     * @type {string}
     * @memberof ProjectScopedResourceReadMetadata
     */
    modifiedBy?: string;
    /**
     * The time the resource was deleted.
     * @type {Date}
     * @memberof ProjectScopedResourceReadMetadata
     */
    deletionTime?: Date;
    /**
     * 
     * @type {ResourceProvisioningStatus}
     * @memberof ProjectScopedResourceReadMetadata
     */
    provisioningStatus: ResourceProvisioningStatus;
    /**
     * The organization identifier the resource belongs to.
     * @type {string}
     * @memberof ProjectScopedResourceReadMetadata
     */
    organizationId: string;
    /**
     * The project identifier the resource belongs to.
     * @type {string}
     * @memberof ProjectScopedResourceReadMetadata
     */
    projectId: string;
}

/**
 * Check if a given object implements the ProjectScopedResourceReadMetadata interface.
 */
export function instanceOfProjectScopedResourceReadMetadata(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "creationTime" in value;
    isInstance = isInstance && "provisioningStatus" in value;
    isInstance = isInstance && "organizationId" in value;
    isInstance = isInstance && "projectId" in value;

    return isInstance;
}

export function ProjectScopedResourceReadMetadataFromJSON(json: any): ProjectScopedResourceReadMetadata {
    return ProjectScopedResourceReadMetadataFromJSONTyped(json, false);
}

export function ProjectScopedResourceReadMetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectScopedResourceReadMetadata {
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
        'deletionTime': !exists(json, 'deletionTime') ? undefined : (new Date(json['deletionTime'])),
        'provisioningStatus': ResourceProvisioningStatusFromJSON(json['provisioningStatus']),
        'organizationId': json['organizationId'],
        'projectId': json['projectId'],
    };
}

export function ProjectScopedResourceReadMetadataToJSON(value?: ProjectScopedResourceReadMetadata | null): any {
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
        'deletionTime': value.deletionTime === undefined ? undefined : (value.deletionTime.toISOString()),
        'provisioningStatus': ResourceProvisioningStatusToJSON(value.provisioningStatus),
        'organizationId': value.organizationId,
        'projectId': value.projectId,
    };
}

