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


/**
 * Supported claims.
 * @export
 */
export const Claim = {
    Aud: 'aud',
    Email: 'email',
    EmailVerified: 'email_verified',
    Exp: 'exp',
    FamilyName: 'family_name',
    GivenName: 'given_name',
    Iat: 'iat',
    Iss: 'iss',
    Locale: 'locale',
    Name: 'name',
    Picture: 'picture',
    Sub: 'sub'
} as const;
export type Claim = typeof Claim[keyof typeof Claim];


export function ClaimFromJSON(json: any): Claim {
    return ClaimFromJSONTyped(json, false);
}

export function ClaimFromJSONTyped(json: any, ignoreDiscriminator: boolean): Claim {
    return json as Claim;
}

export function ClaimToJSON(value?: Claim | null): any {
    return value as any;
}
