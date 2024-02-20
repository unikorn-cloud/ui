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
 * An application dependency.
 * @export
 * @interface ApplicationDependency
 */
export interface ApplicationDependency {
    /**
     * The application name.
     * @type {string}
     * @memberof ApplicationDependency
     */
    name: string;
}

/**
 * Check if a given object implements the ApplicationDependency interface.
 */
export function instanceOfApplicationDependency(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function ApplicationDependencyFromJSON(json: any): ApplicationDependency {
    return ApplicationDependencyFromJSONTyped(json, false);
}

export function ApplicationDependencyFromJSONTyped(json: any, ignoreDiscriminator: boolean): ApplicationDependency {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
    };
}

export function ApplicationDependencyToJSON(value?: ApplicationDependency | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
    };
}

