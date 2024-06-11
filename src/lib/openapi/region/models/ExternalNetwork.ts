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
/**
 * An Openstack external network.
 * @export
 * @interface ExternalNetwork
 */
export interface ExternalNetwork {
    /**
     * The resource ID.
     * @type {string}
     * @memberof ExternalNetwork
     */
    id: string;
    /**
     * The resource name.
     * @type {string}
     * @memberof ExternalNetwork
     */
    name: string;
}

/**
 * Check if a given object implements the ExternalNetwork interface.
 */
export function instanceOfExternalNetwork(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function ExternalNetworkFromJSON(json: any): ExternalNetwork {
    return ExternalNetworkFromJSONTyped(json, false);
}

export function ExternalNetworkFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExternalNetwork {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
    };
}

export function ExternalNetworkToJSON(value?: ExternalNetwork | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
    };
}

