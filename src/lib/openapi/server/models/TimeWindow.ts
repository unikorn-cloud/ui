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
/**
 * A time window that wraps into the next day if required.
 * @export
 * @interface TimeWindow
 */
export interface TimeWindow {
    /**
     * An hour of the day in UTC.
     * @type {number}
     * @memberof TimeWindow
     */
    start: number;
    /**
     * An hour of the day in UTC.
     * @type {number}
     * @memberof TimeWindow
     */
    end: number;
}

/**
 * Check if a given object implements the TimeWindow interface.
 */
export function instanceOfTimeWindow(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "start" in value;
    isInstance = isInstance && "end" in value;

    return isInstance;
}

export function TimeWindowFromJSON(json: any): TimeWindow {
    return TimeWindowFromJSONTyped(json, false);
}

export function TimeWindowFromJSONTyped(json: any, ignoreDiscriminator: boolean): TimeWindow {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'start': json['start'],
        'end': json['end'],
    };
}

export function TimeWindowToJSON(value?: TimeWindow | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'start': value.start,
        'end': value.end,
    };
}
