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
 * A security group's specification.
 * @export
 * @interface SecurityGroupWriteSpec
 */
export interface SecurityGroupWriteSpec {
    /**
     * A list of tags.
     * @type {Array<Tag>}
     * @memberof SecurityGroupWriteSpec
     */
    tags?: Array<Tag>;
}

/**
 * Check if a given object implements the SecurityGroupWriteSpec interface.
 */
export function instanceOfSecurityGroupWriteSpec(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function SecurityGroupWriteSpecFromJSON(json: any): SecurityGroupWriteSpec {
    return SecurityGroupWriteSpecFromJSONTyped(json, false);
}

export function SecurityGroupWriteSpecFromJSONTyped(json: any, ignoreDiscriminator: boolean): SecurityGroupWriteSpec {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'tags': !exists(json, 'tags') ? undefined : ((json['tags'] as Array<any>).map(TagFromJSON)),
    };
}

export function SecurityGroupWriteSpecToJSON(value?: SecurityGroupWriteSpec | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'tags': value.tags === undefined ? undefined : ((value.tags as Array<any>).map(TagToJSON)),
    };
}

