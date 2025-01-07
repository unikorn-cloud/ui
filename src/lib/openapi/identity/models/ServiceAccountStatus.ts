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
 * A service account status.
 * @export
 * @interface ServiceAccountStatus
 */
export interface ServiceAccountStatus {
    /**
     * A long lived acccess token that can be exchanged for an API access token.
     * @type {string}
     * @memberof ServiceAccountStatus
     */
    accessToken: string;
}

/**
 * Check if a given object implements the ServiceAccountStatus interface.
 */
export function instanceOfServiceAccountStatus(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "accessToken" in value;

    return isInstance;
}

export function ServiceAccountStatusFromJSON(json: any): ServiceAccountStatus {
    return ServiceAccountStatusFromJSONTyped(json, false);
}

export function ServiceAccountStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): ServiceAccountStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'accessToken': json['accessToken'],
    };
}

export function ServiceAccountStatusToJSON(value?: ServiceAccountStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'accessToken': value.accessToken,
    };
}

