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
import type { KubernetesClusterWorkloadPools } from './KubernetesClusterWorkloadPools';
import {
    KubernetesClusterWorkloadPoolsFromJSON,
    KubernetesClusterWorkloadPoolsFromJSONTyped,
    KubernetesClusterWorkloadPoolsToJSON,
} from './KubernetesClusterWorkloadPools';
import type { ResourceMetadata } from './ResourceMetadata';
import {
    ResourceMetadataFromJSON,
    ResourceMetadataFromJSONTyped,
    ResourceMetadataToJSON,
} from './ResourceMetadata';

/**
 * Kubernetes cluster creation parameters.
 * @export
 * @interface KubernetesClusterSpec
 */
export interface KubernetesClusterSpec {
    /**
     * 
     * @type {ResourceMetadata}
     * @memberof KubernetesClusterSpec
     */
    metadata?: ResourceMetadata;
    /**
     * Cluster name.
     * @type {string}
     * @memberof KubernetesClusterSpec
     */
    name: string;
    /**
     * The region to provision the cluster in.
     * @type {string}
     * @memberof KubernetesClusterSpec
     */
    region: string;
    /**
     * The name of the cluster manager to use, if one is not specified
     * the system will create one for you.
     * @type {string}
     * @memberof KubernetesClusterSpec
     */
    clusterManager?: string;
    /**
     * The Kuebernetes version.  This should be derived from image metadata.
     * @type {string}
     * @memberof KubernetesClusterSpec
     */
    version: string;
    /**
     * 
     * @type {KubernetesClusterWorkloadPools}
     * @memberof KubernetesClusterSpec
     */
    workloadPools: KubernetesClusterWorkloadPools;
}

/**
 * Check if a given object implements the KubernetesClusterSpec interface.
 */
export function instanceOfKubernetesClusterSpec(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "region" in value;
    isInstance = isInstance && "version" in value;
    isInstance = isInstance && "workloadPools" in value;

    return isInstance;
}

export function KubernetesClusterSpecFromJSON(json: any): KubernetesClusterSpec {
    return KubernetesClusterSpecFromJSONTyped(json, false);
}

export function KubernetesClusterSpecFromJSONTyped(json: any, ignoreDiscriminator: boolean): KubernetesClusterSpec {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': !exists(json, 'metadata') ? undefined : ResourceMetadataFromJSON(json['metadata']),
        'name': json['name'],
        'region': json['region'],
        'clusterManager': !exists(json, 'clusterManager') ? undefined : json['clusterManager'],
        'version': json['version'],
        'workloadPools': KubernetesClusterWorkloadPoolsFromJSON(json['workloadPools']),
    };
}

export function KubernetesClusterSpecToJSON(value?: KubernetesClusterSpec | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ResourceMetadataToJSON(value.metadata),
        'name': value.name,
        'region': value.region,
        'clusterManager': value.clusterManager,
        'version': value.version,
        'workloadPools': KubernetesClusterWorkloadPoolsToJSON(value.workloadPools),
    };
}
