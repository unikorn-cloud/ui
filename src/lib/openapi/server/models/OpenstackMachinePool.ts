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
import type { OpenstackVolume } from './OpenstackVolume';
import {
    OpenstackVolumeFromJSON,
    OpenstackVolumeFromJSONTyped,
    OpenstackVolumeToJSON,
} from './OpenstackVolume';

/**
 * A Kubernetes cluster machine.
 * @export
 * @interface OpenstackMachinePool
 */
export interface OpenstackMachinePool {
    /**
     * Number of machines.
     * @type {number}
     * @memberof OpenstackMachinePool
     */
    replicas: number;
    /**
     * Kubernetes version. This should be derived from the image name as images
     * will be preloaded with containers for a specific Kubernetes version.
     * @type {string}
     * @memberof OpenstackMachinePool
     */
    version: string;
    /**
     * OpenStack image name.
     * @type {string}
     * @memberof OpenstackMachinePool
     */
    imageName: string;
    /**
     * OpenStack flavor name.
     * @type {string}
     * @memberof OpenstackMachinePool
     */
    flavorName: string;
    /**
     * 
     * @type {OpenstackVolume}
     * @memberof OpenstackMachinePool
     */
    disk?: OpenstackVolume;
}

/**
 * Check if a given object implements the OpenstackMachinePool interface.
 */
export function instanceOfOpenstackMachinePool(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "replicas" in value;
    isInstance = isInstance && "version" in value;
    isInstance = isInstance && "imageName" in value;
    isInstance = isInstance && "flavorName" in value;

    return isInstance;
}

export function OpenstackMachinePoolFromJSON(json: any): OpenstackMachinePool {
    return OpenstackMachinePoolFromJSONTyped(json, false);
}

export function OpenstackMachinePoolFromJSONTyped(json: any, ignoreDiscriminator: boolean): OpenstackMachinePool {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'replicas': json['replicas'],
        'version': json['version'],
        'imageName': json['imageName'],
        'flavorName': json['flavorName'],
        'disk': !exists(json, 'disk') ? undefined : OpenstackVolumeFromJSON(json['disk']),
    };
}

export function OpenstackMachinePoolToJSON(value?: OpenstackMachinePool | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'replicas': value.replicas,
        'version': value.version,
        'imageName': value.imageName,
        'flavorName': value.flavorName,
        'disk': OpenstackVolumeToJSON(value.disk),
    };
}

