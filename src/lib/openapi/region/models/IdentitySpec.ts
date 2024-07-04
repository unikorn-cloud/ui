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
import type { IdentitySpecOpenStack } from './IdentitySpecOpenStack';
import {
    IdentitySpecOpenStackFromJSON,
    IdentitySpecOpenStackFromJSONTyped,
    IdentitySpecOpenStackToJSON,
} from './IdentitySpecOpenStack';
import type { RegionType } from './RegionType';
import {
    RegionTypeFromJSON,
    RegionTypeFromJSONTyped,
    RegionTypeToJSON,
} from './RegionType';
import type { Tag } from './Tag';
import {
    TagFromJSON,
    TagFromJSONTyped,
    TagToJSON,
} from './Tag';

/**
 * A provider specific identity, while the client can list regions to infer the
 * type, we don't requires this and return it with the response.  That can then
 * be used in turn to determine which provider specification to examine.
 * @export
 * @interface IdentitySpec
 */
export interface IdentitySpec {
    /**
     * A list of tags.
     * @type {Array<Tag>}
     * @memberof IdentitySpec
     */
    tags?: Array<Tag>;
    /**
     * 
     * @type {RegionType}
     * @memberof IdentitySpec
     */
    type: RegionType;
    /**
     * 
     * @type {IdentitySpecOpenStack}
     * @memberof IdentitySpec
     */
    openstack?: IdentitySpecOpenStack;
}

/**
 * Check if a given object implements the IdentitySpec interface.
 */
export function instanceOfIdentitySpec(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function IdentitySpecFromJSON(json: any): IdentitySpec {
    return IdentitySpecFromJSONTyped(json, false);
}

export function IdentitySpecFromJSONTyped(json: any, ignoreDiscriminator: boolean): IdentitySpec {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'tags': !exists(json, 'tags') ? undefined : ((json['tags'] as Array<any>).map(TagFromJSON)),
        'type': RegionTypeFromJSON(json['type']),
        'openstack': !exists(json, 'openstack') ? undefined : IdentitySpecOpenStackFromJSON(json['openstack']),
    };
}

export function IdentitySpecToJSON(value?: IdentitySpec | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'tags': value.tags === undefined ? undefined : ((value.tags as Array<any>).map(TagToJSON)),
        'type': RegionTypeToJSON(value.type),
        'openstack': IdentitySpecOpenStackToJSON(value.openstack),
    };
}

