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
/**
 * The port range to allow traffic.
 * @export
 * @interface FirewallRulePortRange
 */
export interface FirewallRulePortRange {
    /**
     * The start of the port range.
     * @type {number}
     * @memberof FirewallRulePortRange
     */
    start: number;
    /**
     * The end of the port range.
     * @type {number}
     * @memberof FirewallRulePortRange
     */
    end: number;
}

/**
 * Check if a given object implements the FirewallRulePortRange interface.
 */
export function instanceOfFirewallRulePortRange(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "start" in value;
    isInstance = isInstance && "end" in value;

    return isInstance;
}

export function FirewallRulePortRangeFromJSON(json: any): FirewallRulePortRange {
    return FirewallRulePortRangeFromJSONTyped(json, false);
}

export function FirewallRulePortRangeFromJSONTyped(json: any, ignoreDiscriminator: boolean): FirewallRulePortRange {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'start': json['start'],
        'end': json['end'],
    };
}

export function FirewallRulePortRangeToJSON(value?: FirewallRulePortRange | null): any {
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
