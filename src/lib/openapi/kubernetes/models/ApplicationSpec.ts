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
import type { ApplicationVersion } from './ApplicationVersion';
import {
    ApplicationVersionFromJSON,
    ApplicationVersionFromJSONTyped,
    ApplicationVersionToJSON,
} from './ApplicationVersion';

/**
 * An application.
 * @export
 * @interface ApplicationSpec
 */
export interface ApplicationSpec {
    /**
     * Human readable application name.
     * @type {string}
     * @memberof ApplicationSpec
     */
    humanReadableName: string;
    /**
     * Documentation link for the application.
     * @type {string}
     * @memberof ApplicationSpec
     */
    documentation: string;
    /**
     * The license under which the application is released.
     * @type {string}
     * @memberof ApplicationSpec
     */
    license: string;
    /**
     * A base64 encoded SVG icon.  This should work in both light and dark themes.
     * @type {string}
     * @memberof ApplicationSpec
     */
    icon: string;
    /**
     * A set of application versions.
     * @type {Array<ApplicationVersion>}
     * @memberof ApplicationSpec
     */
    versions: Array<ApplicationVersion>;
    /**
     * A set of tags for filtering applications.
     * @type {Array<string>}
     * @memberof ApplicationSpec
     */
    tags?: Array<string>;
}

/**
 * Check if a given object implements the ApplicationSpec interface.
 */
export function instanceOfApplicationSpec(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "humanReadableName" in value;
    isInstance = isInstance && "documentation" in value;
    isInstance = isInstance && "license" in value;
    isInstance = isInstance && "icon" in value;
    isInstance = isInstance && "versions" in value;

    return isInstance;
}

export function ApplicationSpecFromJSON(json: any): ApplicationSpec {
    return ApplicationSpecFromJSONTyped(json, false);
}

export function ApplicationSpecFromJSONTyped(json: any, ignoreDiscriminator: boolean): ApplicationSpec {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'humanReadableName': json['humanReadableName'],
        'documentation': json['documentation'],
        'license': json['license'],
        'icon': json['icon'],
        'versions': ((json['versions'] as Array<any>).map(ApplicationVersionFromJSON)),
        'tags': !exists(json, 'tags') ? undefined : json['tags'],
    };
}

export function ApplicationSpecToJSON(value?: ApplicationSpec | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'humanReadableName': value.humanReadableName,
        'documentation': value.documentation,
        'license': value.license,
        'icon': value.icon,
        'versions': ((value.versions as Array<any>).map(ApplicationVersionToJSON)),
        'tags': value.tags,
    };
}

