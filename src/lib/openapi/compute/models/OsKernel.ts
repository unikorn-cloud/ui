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


/**
 * A kernel type.
 * @export
 */
export const OsKernel = {
    Linux: 'linux'
} as const;
export type OsKernel = typeof OsKernel[keyof typeof OsKernel];


export function OsKernelFromJSON(json: any): OsKernel {
    return OsKernelFromJSONTyped(json, false);
}

export function OsKernelFromJSONTyped(json: any, ignoreDiscriminator: boolean): OsKernel {
    return json as OsKernel;
}

export function OsKernelToJSON(value?: OsKernel | null): any {
    return value as any;
}
