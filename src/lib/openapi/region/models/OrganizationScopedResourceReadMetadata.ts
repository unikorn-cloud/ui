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
import type { ResourceProvisioningStatus } from './ResourceProvisioningStatus';
import {
    ResourceProvisioningStatusFromJSON,
    ResourceProvisioningStatusFromJSONTyped,
    ResourceProvisioningStatusToJSON,
} from './ResourceProvisioningStatus';

/**
 * 
 * @export
 * @interface OrganizationScopedResourceReadMetadata
 */
export interface OrganizationScopedResourceReadMetadata {
    /**
     * A valid Kubenetes label value, typically used for resource names that can be
     * indexed in the database.
     * @type {string}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    name: string;
    /**
     * The resource description, this optionally augments the name with more context.
     * @type {string}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    description?: string;
    /**
     * The unique resource ID.
     * @type {string}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    id: string;
    /**
     * The time the resource was created.
     * @type {Date}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    creationTime: Date;
    /**
     * The user who created the resource.
     * @type {string}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    createdBy?: string;
    /**
     * The time a resource was updated.
     * @type {Date}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    modifiedTime?: Date;
    /**
     * The user who updated the resource.
     * @type {string}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    modifiedBy?: string;
    /**
     * The time the resource was deleted.
     * @type {Date}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    deletionTime?: Date;
    /**
     * 
     * @type {ResourceProvisioningStatus}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    provisioningStatus: ResourceProvisioningStatus;
    /**
     * The organization identifier the resource belongs to.
     * @type {string}
     * @memberof OrganizationScopedResourceReadMetadata
     */
    organizationId: string;
}

/**
 * Check if a given object implements the OrganizationScopedResourceReadMetadata interface.
 */
export function instanceOfOrganizationScopedResourceReadMetadata(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "creationTime" in value;
    isInstance = isInstance && "provisioningStatus" in value;
    isInstance = isInstance && "organizationId" in value;

    return isInstance;
}

export function OrganizationScopedResourceReadMetadataFromJSON(json: any): OrganizationScopedResourceReadMetadata {
    return OrganizationScopedResourceReadMetadataFromJSONTyped(json, false);
}

export function OrganizationScopedResourceReadMetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): OrganizationScopedResourceReadMetadata {
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
        'deletionTime': !exists(json, 'deletionTime') ? undefined : (new Date(json['deletionTime'])),
        'provisioningStatus': ResourceProvisioningStatusFromJSON(json['provisioningStatus']),
        'organizationId': json['organizationId'],
    };
}

export function OrganizationScopedResourceReadMetadataToJSON(value?: OrganizationScopedResourceReadMetadata | null): any {
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
        'deletionTime': value.deletionTime === undefined ? undefined : (value.deletionTime.toISOString()),
        'provisioningStatus': ResourceProvisioningStatusToJSON(value.provisioningStatus),
        'organizationId': value.organizationId,
    };
}

