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
/**
 * Generic error message, compatible with oauth2.
 * @export
 * @interface ModelError
 */
export interface ModelError {
    /**
     * A terse error string expanding on the HTTP error code. Errors are based on the OAuth2 specification, but are expanded with proprietary status codes for APIs other than those specified by OAuth2.
     * @type {string}
     * @memberof ModelError
     */
    error: ModelErrorErrorEnum;
    /**
     * Verbose message describing the error.
     * @type {string}
     * @memberof ModelError
     */
    errorDescription: string;
}


/**
 * @export
 */
export const ModelErrorErrorEnum = {
    InvalidRequest: 'invalid_request',
    UnauthorizedClient: 'unauthorized_client',
    AccessDenied: 'access_denied',
    UnsupportedResponseType: 'unsupported_response_type',
    InvalidScope: 'invalid_scope',
    ServerError: 'server_error',
    TemporarilyUnavailable: 'temporarily_unavailable',
    InvalidClient: 'invalid_client',
    InvalidGrant: 'invalid_grant',
    UnsupportedGrantType: 'unsupported_grant_type',
    NotFound: 'not_found',
    Conflict: 'conflict',
    MethodNotAllowed: 'method_not_allowed',
    UnsupportedMediaType: 'unsupported_media_type',
    Forbidden: 'forbidden'
} as const;
export type ModelErrorErrorEnum = typeof ModelErrorErrorEnum[keyof typeof ModelErrorErrorEnum];


/**
 * Check if a given object implements the ModelError interface.
 */
export function instanceOfModelError(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "error" in value;
    isInstance = isInstance && "errorDescription" in value;

    return isInstance;
}

export function ModelErrorFromJSON(json: any): ModelError {
    return ModelErrorFromJSONTyped(json, false);
}

export function ModelErrorFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelError {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'error': json['error'],
        'errorDescription': json['error_description'],
    };
}

export function ModelErrorToJSON(value?: ModelError | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'error': value.error,
        'error_description': value.errorDescription,
    };
}

