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


/**
 * The GPU vendor.
 * @export
 */
export const GpuVendor = {
    Nvidia: 'NVIDIA',
    Amd: 'AMD'
} as const;
export type GpuVendor = typeof GpuVendor[keyof typeof GpuVendor];


export function GpuVendorFromJSON(json: any): GpuVendor {
    return GpuVendorFromJSONTyped(json, false);
}

export function GpuVendorFromJSONTyped(json: any, ignoreDiscriminator: boolean): GpuVendor {
    return json as GpuVendor;
}

export function GpuVendorToJSON(value?: GpuVendor | null): any {
    return value as any;
}

