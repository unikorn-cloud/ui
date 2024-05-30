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
import type { RegionRead } from './RegionRead';
import {
    RegionReadFromJSON,
    RegionReadFromJSONTyped,
    RegionReadToJSON,
} from './RegionRead';

/**
 * A list of regions.
 * @export
 * @interface Regions
 */
export interface Regions extends Array<RegionRead> {
}

/**
 * Check if a given object implements the Regions interface.
 */
export function instanceOfRegions(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RegionsFromJSON(json: any): Regions {
    return RegionsFromJSONTyped(json, false);
}

export function RegionsFromJSONTyped(json: any, ignoreDiscriminator: boolean): Regions {
    return json;
}

export function RegionsToJSON(value?: Regions | null): any {
    return value;
}

