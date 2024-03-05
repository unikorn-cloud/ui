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
import type { TimeWindow } from './TimeWindow';
import {
    TimeWindowFromJSON,
    TimeWindowFromJSONTyped,
    TimeWindowToJSON,
} from './TimeWindow';

/**
 * Days of the week and time windows that permit operations to be performed in.
 * @export
 * @interface AutoUpgradeDaysOfWeek
 */
export interface AutoUpgradeDaysOfWeek {
    /**
     * 
     * @type {TimeWindow}
     * @memberof AutoUpgradeDaysOfWeek
     */
    sunday?: TimeWindow;
    /**
     * 
     * @type {TimeWindow}
     * @memberof AutoUpgradeDaysOfWeek
     */
    monday?: TimeWindow;
    /**
     * 
     * @type {TimeWindow}
     * @memberof AutoUpgradeDaysOfWeek
     */
    tuesday?: TimeWindow;
    /**
     * 
     * @type {TimeWindow}
     * @memberof AutoUpgradeDaysOfWeek
     */
    wednesday?: TimeWindow;
    /**
     * 
     * @type {TimeWindow}
     * @memberof AutoUpgradeDaysOfWeek
     */
    thursday?: TimeWindow;
    /**
     * 
     * @type {TimeWindow}
     * @memberof AutoUpgradeDaysOfWeek
     */
    friday?: TimeWindow;
    /**
     * 
     * @type {TimeWindow}
     * @memberof AutoUpgradeDaysOfWeek
     */
    saturday?: TimeWindow;
}

/**
 * Check if a given object implements the AutoUpgradeDaysOfWeek interface.
 */
export function instanceOfAutoUpgradeDaysOfWeek(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function AutoUpgradeDaysOfWeekFromJSON(json: any): AutoUpgradeDaysOfWeek {
    return AutoUpgradeDaysOfWeekFromJSONTyped(json, false);
}

export function AutoUpgradeDaysOfWeekFromJSONTyped(json: any, ignoreDiscriminator: boolean): AutoUpgradeDaysOfWeek {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'sunday': !exists(json, 'sunday') ? undefined : TimeWindowFromJSON(json['sunday']),
        'monday': !exists(json, 'monday') ? undefined : TimeWindowFromJSON(json['monday']),
        'tuesday': !exists(json, 'tuesday') ? undefined : TimeWindowFromJSON(json['tuesday']),
        'wednesday': !exists(json, 'wednesday') ? undefined : TimeWindowFromJSON(json['wednesday']),
        'thursday': !exists(json, 'thursday') ? undefined : TimeWindowFromJSON(json['thursday']),
        'friday': !exists(json, 'friday') ? undefined : TimeWindowFromJSON(json['friday']),
        'saturday': !exists(json, 'saturday') ? undefined : TimeWindowFromJSON(json['saturday']),
    };
}

export function AutoUpgradeDaysOfWeekToJSON(value?: AutoUpgradeDaysOfWeek | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'sunday': TimeWindowToJSON(value.sunday),
        'monday': TimeWindowToJSON(value.monday),
        'tuesday': TimeWindowToJSON(value.tuesday),
        'wednesday': TimeWindowToJSON(value.wednesday),
        'thursday': TimeWindowToJSON(value.thursday),
        'friday': TimeWindowToJSON(value.friday),
        'saturday': TimeWindowToJSON(value.saturday),
    };
}
