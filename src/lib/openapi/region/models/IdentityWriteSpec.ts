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
import type { Tag } from './Tag';
import {
    TagFromJSON,
    TagFromJSONTyped,
    TagToJSON,
} from './Tag';

/**
 * Request parameters for creating an identity.
 * @export
 * @interface IdentityWriteSpec
 */
export interface IdentityWriteSpec {
    /**
     * A list of tags.
     * @type {Array<Tag>}
     * @memberof IdentityWriteSpec
     */
    tags?: Array<Tag>;
    /**
     * The region an identity is provisioned in.
     * @type {string}
     * @memberof IdentityWriteSpec
     */
    regionId: string;
}

/**
 * Check if a given object implements the IdentityWriteSpec interface.
 */
export function instanceOfIdentityWriteSpec(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "regionId" in value;

    return isInstance;
}

export function IdentityWriteSpecFromJSON(json: any): IdentityWriteSpec {
    return IdentityWriteSpecFromJSONTyped(json, false);
}

export function IdentityWriteSpecFromJSONTyped(json: any, ignoreDiscriminator: boolean): IdentityWriteSpec {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'tags': !exists(json, 'tags') ? undefined : ((json['tags'] as Array<any>).map(TagFromJSON)),
        'regionId': json['regionId'],
    };
}

export function IdentityWriteSpecToJSON(value?: IdentityWriteSpec | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'tags': value.tags === undefined ? undefined : ((value.tags as Array<any>).map(TagToJSON)),
        'regionId': value.regionId,
    };
}

