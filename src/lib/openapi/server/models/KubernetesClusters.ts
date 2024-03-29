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
import type { KubernetesCluster } from './KubernetesCluster';
import {
    KubernetesClusterFromJSON,
    KubernetesClusterFromJSONTyped,
    KubernetesClusterToJSON,
} from './KubernetesCluster';

/**
 * A list of Kubernetes clusters.
 * @export
 * @interface KubernetesClusters
 */
export interface KubernetesClusters extends Array<KubernetesCluster> {
}

/**
 * Check if a given object implements the KubernetesClusters interface.
 */
export function instanceOfKubernetesClusters(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function KubernetesClustersFromJSON(json: any): KubernetesClusters {
    return KubernetesClustersFromJSONTyped(json, false);
}

export function KubernetesClustersFromJSONTyped(json: any, ignoreDiscriminator: boolean): KubernetesClusters {
    return json;
}

export function KubernetesClustersToJSON(value?: KubernetesClusters | null): any {
    return value;
}

