/* tslint:disable */
/* eslint-disable */
/**
 * Unikorn Identity API
 * The Unikorn Identity API provides an OIDC compliant interface for use with all Unikorn services and proxies.  As it\'s intended use is for multi-tenant cloud deployments it acts as an aggregation layer for other 3rd party OIDC services, dispatching login requests to the required OIDC backend.
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
 * oauth2 token endpoint.
 * @export
 * @interface TokenRequestOptions
 */
export interface TokenRequestOptions {
    /**
     * Supported grant type.  Must be either "code" or "password".
     * @type {string}
     * @memberof TokenRequestOptions
     */
    grantType: string;
    /**
     * Authorization code. Required with the "code" grant type.
     * @type {string}
     * @memberof TokenRequestOptions
     */
    code?: string | null;
    /**
     * Client ID. Required with the "code" grant type.
     * @type {string}
     * @memberof TokenRequestOptions
     */
    clientId?: string | null;
    /**
     * Client redirect URI. Required with the "code" grant type.
     * @type {string}
     * @memberof TokenRequestOptions
     */
    redirectUri?: string | null;
    /**
     * Client code verifier. Required with the "code" grant type.
     * @type {string}
     * @memberof TokenRequestOptions
     */
    codeVerifier?: string | null;
    /**
     * Resource owner username. Required with the "password" grant type.
     * @type {string}
     * @memberof TokenRequestOptions
     */
    username?: string | null;
    /**
     * Resource owner password. Required with the "password" grant type.
     * @type {string}
     * @memberof TokenRequestOptions
     */
    password?: string | null;
    /**
     * A refresh token for the refresh_token grant type.
     * @type {string}
     * @memberof TokenRequestOptions
     */
    refreshToken?: string | null;
}

/**
 * Check if a given object implements the TokenRequestOptions interface.
 */
export function instanceOfTokenRequestOptions(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "grantType" in value;

    return isInstance;
}

export function TokenRequestOptionsFromJSON(json: any): TokenRequestOptions {
    return TokenRequestOptionsFromJSONTyped(json, false);
}

export function TokenRequestOptionsFromJSONTyped(json: any, ignoreDiscriminator: boolean): TokenRequestOptions {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'grantType': json['grant_type'],
        'code': !exists(json, 'code') ? undefined : json['code'],
        'clientId': !exists(json, 'client_id') ? undefined : json['client_id'],
        'redirectUri': !exists(json, 'redirect_uri') ? undefined : json['redirect_uri'],
        'codeVerifier': !exists(json, 'code_verifier') ? undefined : json['code_verifier'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'password': !exists(json, 'password') ? undefined : json['password'],
        'refreshToken': !exists(json, 'refresh_token') ? undefined : json['refresh_token'],
    };
}

export function TokenRequestOptionsToJSON(value?: TokenRequestOptions | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'grant_type': value.grantType,
        'code': value.code,
        'client_id': value.clientId,
        'redirect_uri': value.redirectUri,
        'code_verifier': value.codeVerifier,
        'username': value.username,
        'password': value.password,
        'refresh_token': value.refreshToken,
    };
}

