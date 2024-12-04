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
import type { ComputeClusterSpec } from './ComputeClusterSpec';
import {
    ComputeClusterSpecFromJSON,
    ComputeClusterSpecFromJSONTyped,
    ComputeClusterSpecToJSON,
} from './ComputeClusterSpec';
import type { ResourceWriteMetadata } from './ResourceWriteMetadata';
import {
    ResourceWriteMetadataFromJSON,
    ResourceWriteMetadataFromJSONTyped,
    ResourceWriteMetadataToJSON,
} from './ResourceWriteMetadata';

/**
 * Compute cluster create or update.
 * @export
 * @interface ComputeClusterWrite
 */
export interface ComputeClusterWrite {
    /**
     * 
     * @type {ResourceWriteMetadata}
     * @memberof ComputeClusterWrite
     */
    metadata: ResourceWriteMetadata;
    /**
     * 
     * @type {ComputeClusterSpec}
     * @memberof ComputeClusterWrite
     */
    spec: ComputeClusterSpec;
}

/**
 * Check if a given object implements the ComputeClusterWrite interface.
 */
export function instanceOfComputeClusterWrite(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "spec" in value;

    return isInstance;
}

export function ComputeClusterWriteFromJSON(json: any): ComputeClusterWrite {
    return ComputeClusterWriteFromJSONTyped(json, false);
}

export function ComputeClusterWriteFromJSONTyped(json: any, ignoreDiscriminator: boolean): ComputeClusterWrite {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': ResourceWriteMetadataFromJSON(json['metadata']),
        'spec': ComputeClusterSpecFromJSON(json['spec']),
    };
}

export function ComputeClusterWriteToJSON(value?: ComputeClusterWrite | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ResourceWriteMetadataToJSON(value.metadata),
        'spec': ComputeClusterSpecToJSON(value.spec),
    };
}
