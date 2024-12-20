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
import type { ResourceWriteMetadata } from './ResourceWriteMetadata';
import {
    ResourceWriteMetadataFromJSON,
    ResourceWriteMetadataFromJSONTyped,
    ResourceWriteMetadataToJSON,
} from './ResourceWriteMetadata';

/**
 * A security group request.
 * @export
 * @interface SecurityGroupWrite
 */
export interface SecurityGroupWrite {
    /**
     * 
     * @type {ResourceWriteMetadata}
     * @memberof SecurityGroupWrite
     */
    metadata: ResourceWriteMetadata;
    /**
     * A security group's specification.
     * @type {object}
     * @memberof SecurityGroupWrite
     */
    spec?: object;
}

/**
 * Check if a given object implements the SecurityGroupWrite interface.
 */
export function instanceOfSecurityGroupWrite(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;

    return isInstance;
}

export function SecurityGroupWriteFromJSON(json: any): SecurityGroupWrite {
    return SecurityGroupWriteFromJSONTyped(json, false);
}

export function SecurityGroupWriteFromJSONTyped(json: any, ignoreDiscriminator: boolean): SecurityGroupWrite {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': ResourceWriteMetadataFromJSON(json['metadata']),
        'spec': !exists(json, 'spec') ? undefined : json['spec'],
    };
}

export function SecurityGroupWriteToJSON(value?: SecurityGroupWrite | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ResourceWriteMetadataToJSON(value.metadata),
        'spec': value.spec,
    };
}

