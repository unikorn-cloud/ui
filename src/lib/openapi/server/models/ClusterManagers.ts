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
import type { ClusterManager } from './ClusterManager';
import {
    ClusterManagerFromJSON,
    ClusterManagerFromJSONTyped,
    ClusterManagerToJSON,
} from './ClusterManager';

/**
 * A list of cluster managers.
 * @export
 * @interface ClusterManagers
 */
export interface ClusterManagers extends Array<ClusterManager> {
}

/**
 * Check if a given object implements the ClusterManagers interface.
 */
export function instanceOfClusterManagers(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ClusterManagersFromJSON(json: any): ClusterManagers {
    return ClusterManagersFromJSONTyped(json, false);
}

export function ClusterManagersFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClusterManagers {
    return json;
}

export function ClusterManagersToJSON(value?: ClusterManagers | null): any {
    return value;
}

