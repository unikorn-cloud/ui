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
import type { KubernetesClusterMetadata } from './KubernetesClusterMetadata';
import {
    KubernetesClusterMetadataFromJSON,
    KubernetesClusterMetadataFromJSONTyped,
    KubernetesClusterMetadataToJSON,
} from './KubernetesClusterMetadata';
import type { KubernetesClusterSpec } from './KubernetesClusterSpec';
import {
    KubernetesClusterSpecFromJSON,
    KubernetesClusterSpecFromJSONTyped,
    KubernetesClusterSpecToJSON,
} from './KubernetesClusterSpec';

/**
 * Kubernetes cluster read.
 * @export
 * @interface KubernetesCluster
 */
export interface KubernetesCluster {
    /**
     * 
     * @type {KubernetesClusterMetadata}
     * @memberof KubernetesCluster
     */
    metadata: KubernetesClusterMetadata;
    /**
     * 
     * @type {KubernetesClusterSpec}
     * @memberof KubernetesCluster
     */
    spec: KubernetesClusterSpec;
}

/**
 * Check if a given object implements the KubernetesCluster interface.
 */
export function instanceOfKubernetesCluster(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "spec" in value;

    return isInstance;
}

export function KubernetesClusterFromJSON(json: any): KubernetesCluster {
    return KubernetesClusterFromJSONTyped(json, false);
}

export function KubernetesClusterFromJSONTyped(json: any, ignoreDiscriminator: boolean): KubernetesCluster {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': KubernetesClusterMetadataFromJSON(json['metadata']),
        'spec': KubernetesClusterSpecFromJSON(json['spec']),
    };
}

export function KubernetesClusterToJSON(value?: KubernetesCluster | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': KubernetesClusterMetadataToJSON(value.metadata),
        'spec': KubernetesClusterSpecToJSON(value.spec),
    };
}

