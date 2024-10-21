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
import type { GpuVendor } from './GpuVendor';
import {
    GpuVendorFromJSON,
    GpuVendorFromJSONTyped,
    GpuVendorToJSON,
} from './GpuVendor';

/**
 * GPU specification.
 * @export
 * @interface GpuSpec
 */
export interface GpuSpec {
    /**
     * 
     * @type {GpuVendor}
     * @memberof GpuSpec
     */
    vendor: GpuVendor;
    /**
     * A GPU model.
     * @type {string}
     * @memberof GpuSpec
     */
    model: string;
    /**
     * GPU memory in GiB.
     * @type {number}
     * @memberof GpuSpec
     */
    memory: number;
    /**
     * The physical number of GPUs (cards) available.
     * @type {number}
     * @memberof GpuSpec
     */
    physicalCount: number;
    /**
     * The logical number of GPUs available as seen in the OS.
     * @type {number}
     * @memberof GpuSpec
     */
    logicalCount: number;
}

/**
 * Check if a given object implements the GpuSpec interface.
 */
export function instanceOfGpuSpec(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "vendor" in value;
    isInstance = isInstance && "model" in value;
    isInstance = isInstance && "memory" in value;
    isInstance = isInstance && "physicalCount" in value;
    isInstance = isInstance && "logicalCount" in value;

    return isInstance;
}

export function GpuSpecFromJSON(json: any): GpuSpec {
    return GpuSpecFromJSONTyped(json, false);
}

export function GpuSpecFromJSONTyped(json: any, ignoreDiscriminator: boolean): GpuSpec {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'vendor': GpuVendorFromJSON(json['vendor']),
        'model': json['model'],
        'memory': json['memory'],
        'physicalCount': json['physicalCount'],
        'logicalCount': json['logicalCount'],
    };
}

export function GpuSpecToJSON(value?: GpuSpec | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'vendor': GpuVendorToJSON(value.vendor),
        'model': value.model,
        'memory': value.memory,
        'physicalCount': value.physicalCount,
        'logicalCount': value.logicalCount,
    };
}

