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
import type { ImageSelector } from './ImageSelector';
import {
    ImageSelectorFromJSON,
    ImageSelectorFromJSONTyped,
    ImageSelectorToJSON,
} from './ImageSelector';

/**
 * The image to use for a server.
 * @export
 * @interface ComputeImage
 */
export interface ComputeImage {
    /**
     * The image ID.
     * @type {string}
     * @memberof ComputeImage
     */
    id?: string;
    /**
     * 
     * @type {ImageSelector}
     * @memberof ComputeImage
     */
    selector?: ImageSelector;
}

/**
 * Check if a given object implements the ComputeImage interface.
 */
export function instanceOfComputeImage(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ComputeImageFromJSON(json: any): ComputeImage {
    return ComputeImageFromJSONTyped(json, false);
}

export function ComputeImageFromJSONTyped(json: any, ignoreDiscriminator: boolean): ComputeImage {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'selector': !exists(json, 'selector') ? undefined : ImageSelectorFromJSON(json['selector']),
    };
}

export function ComputeImageToJSON(value?: ComputeImage | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'selector': ImageSelectorToJSON(value.selector),
    };
}

