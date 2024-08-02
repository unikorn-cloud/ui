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
import type { ResourceProvisioningStatus } from './ResourceProvisioningStatus';
import {
    ResourceProvisioningStatusFromJSON,
    ResourceProvisioningStatusFromJSONTyped,
    ResourceProvisioningStatusToJSON,
} from './ResourceProvisioningStatus';

/**
 * Resource metadata valid for all reads.
 * @export
 * @interface ResourceReadMetadata
 */
export interface ResourceReadMetadata {
    /**
     * A valid Kubenetes label value, typically used for resource names that can be
     * indexed in the database.
     * @type {string}
     * @memberof ResourceReadMetadata
     */
    name: string;
    /**
     * The resource description, this optionally augments the name with more context.
     * @type {string}
     * @memberof ResourceReadMetadata
     */
    description?: string;
    /**
     * The unique resource ID.
     * @type {string}
     * @memberof ResourceReadMetadata
     */
    id: string;
    /**
     * The time the resource was created.
     * @type {Date}
     * @memberof ResourceReadMetadata
     */
    creationTime: Date;
    /**
     * The user who created the resource.
     * @type {string}
     * @memberof ResourceReadMetadata
     */
    createdBy?: string;
    /**
     * The time a resource was updated.
     * @type {Date}
     * @memberof ResourceReadMetadata
     */
    modifiedTime?: Date;
    /**
     * The user who updated the resource.
     * @type {string}
     * @memberof ResourceReadMetadata
     */
    modifiedBy?: string;
    /**
     * The time the resource was deleted.
     * @type {Date}
     * @memberof ResourceReadMetadata
     */
    deletionTime?: Date;
    /**
     * 
     * @type {ResourceProvisioningStatus}
     * @memberof ResourceReadMetadata
     */
    provisioningStatus: ResourceProvisioningStatus;
}

/**
 * Check if a given object implements the ResourceReadMetadata interface.
 */
export function instanceOfResourceReadMetadata(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "creationTime" in value;
    isInstance = isInstance && "provisioningStatus" in value;

    return isInstance;
}

export function ResourceReadMetadataFromJSON(json: any): ResourceReadMetadata {
    return ResourceReadMetadataFromJSONTyped(json, false);
}

export function ResourceReadMetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResourceReadMetadata {
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
    };
}

export function ResourceReadMetadataToJSON(value?: ResourceReadMetadata | null): any {
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
    };
}

