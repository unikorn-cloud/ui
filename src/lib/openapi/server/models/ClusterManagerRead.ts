/* tslint:disable */
/* eslint-disable */
/**
 * Kubernetes Service API
 * The Kubernetes Service API provides services that allows provisioning and life cycle management of Kubernetes clusters. The API is logically composed of authentication services, platform provider specific calls to get a set of resource types that can be then used by abstract Kubernetes Service resources to create and manage Kubernetes clusters. Requests must specify the HTML content type header.
 *
 * The version of the OpenAPI document: 0.2.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { ProjectScopedResourceReadMetadata } from './ProjectScopedResourceReadMetadata';
import {
    ProjectScopedResourceReadMetadataFromJSON,
    ProjectScopedResourceReadMetadataFromJSONTyped,
    ProjectScopedResourceReadMetadataToJSON,
} from './ProjectScopedResourceReadMetadata';

/**
 * A cluster manager.
 * @export
 * @interface ClusterManagerRead
 */
export interface ClusterManagerRead {
    /**
     * 
     * @type {ProjectScopedResourceReadMetadata}
     * @memberof ClusterManagerRead
     */
    metadata: ProjectScopedResourceReadMetadata;
}

/**
 * Check if a given object implements the ClusterManagerRead interface.
 */
export function instanceOfClusterManagerRead(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;

    return isInstance;
}

export function ClusterManagerReadFromJSON(json: any): ClusterManagerRead {
    return ClusterManagerReadFromJSONTyped(json, false);
}

export function ClusterManagerReadFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClusterManagerRead {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': ProjectScopedResourceReadMetadataFromJSON(json['metadata']),
    };
}

export function ClusterManagerReadToJSON(value?: ClusterManagerRead | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ProjectScopedResourceReadMetadataToJSON(value.metadata),
    };
}

