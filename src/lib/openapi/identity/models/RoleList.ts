/* tslint:disable */
/* eslint-disable */
/**
 * Unikorn Identity API
 * The Unikorn Identity API provides an OIDC compliant interface for use with all Unikorn services and proxies.  As it\'s intended use is for multi-tenant cloud deployments it acts as an aggregation layer for other 3rd party OIDC services, dispatching login requests to the required OIDC backend.
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
 * A list of roles.
 * @export
 * @interface RoleList
 */
export interface RoleList extends Array<string> {
}

/**
 * Check if a given object implements the RoleList interface.
 */
export function instanceOfRoleList(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RoleListFromJSON(json: any): RoleList {
    return RoleListFromJSONTyped(json, false);
}

export function RoleListFromJSONTyped(json: any, ignoreDiscriminator: boolean): RoleList {
    return json;
}

export function RoleListToJSON(value?: RoleList | null): any {
    return value;
}
