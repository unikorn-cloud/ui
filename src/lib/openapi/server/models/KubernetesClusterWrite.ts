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
import type { KubernetesClusterSpec } from './KubernetesClusterSpec';
import {
    KubernetesClusterSpecFromJSON,
    KubernetesClusterSpecFromJSONTyped,
    KubernetesClusterSpecToJSON,
} from './KubernetesClusterSpec';
import type { ResourceWriteMetadata } from './ResourceWriteMetadata';
import {
    ResourceWriteMetadataFromJSON,
    ResourceWriteMetadataFromJSONTyped,
    ResourceWriteMetadataToJSON,
} from './ResourceWriteMetadata';

/**
 * Kubernetes cluster create or update.
 * @export
 * @interface KubernetesClusterWrite
 */
export interface KubernetesClusterWrite {
    /**
     * 
     * @type {ResourceWriteMetadata}
     * @memberof KubernetesClusterWrite
     */
    metadata: ResourceWriteMetadata;
    /**
     * 
     * @type {KubernetesClusterSpec}
     * @memberof KubernetesClusterWrite
     */
    spec: KubernetesClusterSpec;
}

/**
 * Check if a given object implements the KubernetesClusterWrite interface.
 */
export function instanceOfKubernetesClusterWrite(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "spec" in value;

    return isInstance;
}

export function KubernetesClusterWriteFromJSON(json: any): KubernetesClusterWrite {
    return KubernetesClusterWriteFromJSONTyped(json, false);
}

export function KubernetesClusterWriteFromJSONTyped(json: any, ignoreDiscriminator: boolean): KubernetesClusterWrite {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': ResourceWriteMetadataFromJSON(json['metadata']),
        'spec': KubernetesClusterSpecFromJSON(json['spec']),
    };
}

export function KubernetesClusterWriteToJSON(value?: KubernetesClusterWrite | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ResourceWriteMetadataToJSON(value.metadata),
        'spec': KubernetesClusterSpecToJSON(value.spec),
    };
}

