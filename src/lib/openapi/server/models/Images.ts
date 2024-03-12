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
import type { Image } from './Image';
import {
    ImageFromJSON,
    ImageFromJSONTyped,
    ImageToJSON,
} from './Image';

/**
 * A list of images that are compatible with this platform.
 * @export
 * @interface Images
 */
export interface Images extends Array<Image> {
}

/**
 * Check if a given object implements the Images interface.
 */
export function instanceOfImages(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ImagesFromJSON(json: any): Images {
    return ImagesFromJSONTyped(json, false);
}

export function ImagesFromJSONTyped(json: any, ignoreDiscriminator: boolean): Images {
    return json;
}

export function ImagesToJSON(value?: Images | null): any {
    return value;
}
