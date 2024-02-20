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
import type { KubernetesClusterWorkloadPool } from './KubernetesClusterWorkloadPool';
import {
    KubernetesClusterWorkloadPoolFromJSON,
    KubernetesClusterWorkloadPoolFromJSONTyped,
    KubernetesClusterWorkloadPoolToJSON,
} from './KubernetesClusterWorkloadPool';

/**
 * A list of Kubernetes cluster workload pools.
 * @export
 * @interface KubernetesClusterWorkloadPools
 */
export interface KubernetesClusterWorkloadPools extends Array<KubernetesClusterWorkloadPool> {
}

/**
 * Check if a given object implements the KubernetesClusterWorkloadPools interface.
 */
export function instanceOfKubernetesClusterWorkloadPools(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function KubernetesClusterWorkloadPoolsFromJSON(json: any): KubernetesClusterWorkloadPools {
    return KubernetesClusterWorkloadPoolsFromJSONTyped(json, false);
}

export function KubernetesClusterWorkloadPoolsFromJSONTyped(json: any, ignoreDiscriminator: boolean): KubernetesClusterWorkloadPools {
    return json;
}

export function KubernetesClusterWorkloadPoolsToJSON(value?: KubernetesClusterWorkloadPools | null): any {
    return value;
}

