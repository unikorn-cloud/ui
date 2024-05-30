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
import type { ApplicationRead } from './ApplicationRead';
import {
    ApplicationReadFromJSON,
    ApplicationReadFromJSONTyped,
    ApplicationReadToJSON,
} from './ApplicationRead';

/**
 * A list of appications.
 * @export
 * @interface Applications
 */
export interface Applications extends Array<ApplicationRead> {
}

/**
 * Check if a given object implements the Applications interface.
 */
export function instanceOfApplications(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ApplicationsFromJSON(json: any): Applications {
    return ApplicationsFromJSONTyped(json, false);
}

export function ApplicationsFromJSONTyped(json: any, ignoreDiscriminator: boolean): Applications {
    return json;
}

export function ApplicationsToJSON(value?: Applications | null): any {
    return value;
}

