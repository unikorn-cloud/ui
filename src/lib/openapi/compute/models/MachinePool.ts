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
import type { FirewallRule } from './FirewallRule';
import {
    FirewallRuleFromJSON,
    FirewallRuleFromJSONTyped,
    FirewallRuleToJSON,
} from './FirewallRule';
import type { ImageSelector } from './ImageSelector';
import {
    ImageSelectorFromJSON,
    ImageSelectorFromJSONTyped,
    ImageSelectorToJSON,
} from './ImageSelector';
import type { PublicIPAllocation } from './PublicIPAllocation';
import {
    PublicIPAllocationFromJSON,
    PublicIPAllocationFromJSONTyped,
    PublicIPAllocationToJSON,
} from './PublicIPAllocation';
import type { Volume } from './Volume';
import {
    VolumeFromJSON,
    VolumeFromJSONTyped,
    VolumeToJSON,
} from './Volume';

/**
 * A Compute cluster machine.
 * @export
 * @interface MachinePool
 */
export interface MachinePool {
    /**
     * Number of machines for a statically sized pool or the maximum for an auto-scaled pool.
     * @type {number}
     * @memberof MachinePool
     */
    replicas: number;
    /**
     * Flavor ID.
     * @type {string}
     * @memberof MachinePool
     */
    flavorId: string;
    /**
     * 
     * @type {Volume}
     * @memberof MachinePool
     */
    disk?: Volume;
    /**
     * A list of firewall rules applied to a workload pool.
     * @type {Array<FirewallRule>}
     * @memberof MachinePool
     */
    firewall?: Array<FirewallRule>;
    /**
     * 
     * @type {PublicIPAllocation}
     * @memberof MachinePool
     */
    publicIPAllocation?: PublicIPAllocation;
    /**
     * 
     * @type {ImageSelector}
     * @memberof MachinePool
     */
    image: ImageSelector;
    /**
     * UserData contains base64-encoded configuration information or scripts to use upon launch.
     * @type {string}
     * @memberof MachinePool
     */
    userData?: string;
}

/**
 * Check if a given object implements the MachinePool interface.
 */
export function instanceOfMachinePool(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "replicas" in value;
    isInstance = isInstance && "flavorId" in value;
    isInstance = isInstance && "image" in value;

    return isInstance;
}

export function MachinePoolFromJSON(json: any): MachinePool {
    return MachinePoolFromJSONTyped(json, false);
}

export function MachinePoolFromJSONTyped(json: any, ignoreDiscriminator: boolean): MachinePool {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'replicas': json['replicas'],
        'flavorId': json['flavorId'],
        'disk': !exists(json, 'disk') ? undefined : VolumeFromJSON(json['disk']),
        'firewall': !exists(json, 'firewall') ? undefined : ((json['firewall'] as Array<any>).map(FirewallRuleFromJSON)),
        'publicIPAllocation': !exists(json, 'publicIPAllocation') ? undefined : PublicIPAllocationFromJSON(json['publicIPAllocation']),
        'image': ImageSelectorFromJSON(json['image']),
        'userData': !exists(json, 'userData') ? undefined : json['userData'],
    };
}

export function MachinePoolToJSON(value?: MachinePool | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'replicas': value.replicas,
        'flavorId': value.flavorId,
        'disk': VolumeToJSON(value.disk),
        'firewall': value.firewall === undefined ? undefined : ((value.firewall as Array<any>).map(FirewallRuleToJSON)),
        'publicIPAllocation': PublicIPAllocationToJSON(value.publicIPAllocation),
        'image': ImageSelectorToJSON(value.image),
        'userData': value.userData,
    };
}

