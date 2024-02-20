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
 * An OpenStack project.
 * @export
 * @interface OpenstackProject
 */
export interface OpenstackProject {
    /**
     * The unique project ID.
     * @type {string}
     * @memberof OpenstackProject
     */
    id: string;
    /**
     * The name of the project.
     * @type {string}
     * @memberof OpenstackProject
     */
    name: string;
    /**
     * A verbose description of the project.
     * @type {string}
     * @memberof OpenstackProject
     */
    description?: string;
}

/**
 * Check if a given object implements the OpenstackProject interface.
 */
export function instanceOfOpenstackProject(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function OpenstackProjectFromJSON(json: any): OpenstackProject {
    return OpenstackProjectFromJSONTyped(json, false);
}

export function OpenstackProjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): OpenstackProject {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
    };
}

export function OpenstackProjectToJSON(value?: OpenstackProject | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'description': value.description,
    };
}

