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
import type { AuthMethod } from './AuthMethod';
import {
    AuthMethodFromJSON,
    AuthMethodFromJSONTyped,
    AuthMethodToJSON,
} from './AuthMethod';
import type { Claim } from './Claim';
import {
    ClaimFromJSON,
    ClaimFromJSONTyped,
    ClaimToJSON,
} from './Claim';
import type { CodeChallengeMethod } from './CodeChallengeMethod';
import {
    CodeChallengeMethodFromJSON,
    CodeChallengeMethodFromJSONTyped,
    CodeChallengeMethodToJSON,
} from './CodeChallengeMethod';
import type { GrantType } from './GrantType';
import {
    GrantTypeFromJSON,
    GrantTypeFromJSONTyped,
    GrantTypeToJSON,
} from './GrantType';
import type { ResponseType } from './ResponseType';
import {
    ResponseTypeFromJSON,
    ResponseTypeFromJSONTyped,
    ResponseTypeToJSON,
} from './ResponseType';
import type { Scope } from './Scope';
import {
    ScopeFromJSON,
    ScopeFromJSONTyped,
    ScopeToJSON,
} from './Scope';
import type { SigningAlgorithm } from './SigningAlgorithm';
import {
    SigningAlgorithmFromJSON,
    SigningAlgorithmFromJSONTyped,
    SigningAlgorithmToJSON,
} from './SigningAlgorithm';

/**
 * OpenID configuration.
 * @export
 * @interface OpenidConfiguration
 */
export interface OpenidConfiguration {
    /**
     * The OpenID Issuer (iss field).
     * @type {string}
     * @memberof OpenidConfiguration
     */
    issuer: string;
    /**
     * The oauth2 endpoint that initiates authentication.
     * @type {string}
     * @memberof OpenidConfiguration
     */
    authorizationEndpoint: string;
    /**
     * The oauth2 endpoint that is used to exchange an authentication code for tokens.
     * @type {string}
     * @memberof OpenidConfiguration
     */
    tokenEndpoint: string;
    /**
     * The oidc endpoint used to get information about an access token's user.
     * @type {string}
     * @memberof OpenidConfiguration
     */
    userinfoEndpoint: string;
    /**
     * The oauth2 endpoint that exposes public signing keys for token validation.
     * @type {string}
     * @memberof OpenidConfiguration
     */
    jwksUri: string;
    /**
     * A list of supported oauth2 scopes.
     * @type {Array<Scope>}
     * @memberof OpenidConfiguration
     */
    scopesSupported: Array<Scope>;
    /**
     * A list of supported claims
     * @type {Array<Claim>}
     * @memberof OpenidConfiguration
     */
    claimsSupported: Array<Claim>;
    /**
     * A list of supported response types that can be requested for the authorization endpoint.
     * @type {Array<ResponseType>}
     * @memberof OpenidConfiguration
     */
    responseTypesSupported: Array<ResponseType>;
    /**
     * A list of supported authentication methods for the token endpoint.
     * @type {Array<AuthMethod>}
     * @memberof OpenidConfiguration
     */
    tokenEndpointAuthMethodsSupported: Array<AuthMethod>;
    /**
     * A list of supported grants for the token endpoint.
     * @type {Array<GrantType>}
     * @memberof OpenidConfiguration
     */
    grantTypesSupported: Array<GrantType>;
    /**
     * A list of signing algorithms supported for ID tokens.
     * @type {Array<SigningAlgorithm>}
     * @memberof OpenidConfiguration
     */
    idTokenSigningAlgValuesSupported: Array<SigningAlgorithm>;
    /**
     * A list of code challenge methods supported.
     * @type {Array<CodeChallengeMethod>}
     * @memberof OpenidConfiguration
     */
    codeChallengeMethodsSupported: Array<CodeChallengeMethod>;
}

/**
 * Check if a given object implements the OpenidConfiguration interface.
 */
export function instanceOfOpenidConfiguration(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "issuer" in value;
    isInstance = isInstance && "authorizationEndpoint" in value;
    isInstance = isInstance && "tokenEndpoint" in value;
    isInstance = isInstance && "userinfoEndpoint" in value;
    isInstance = isInstance && "jwksUri" in value;
    isInstance = isInstance && "scopesSupported" in value;
    isInstance = isInstance && "claimsSupported" in value;
    isInstance = isInstance && "responseTypesSupported" in value;
    isInstance = isInstance && "tokenEndpointAuthMethodsSupported" in value;
    isInstance = isInstance && "grantTypesSupported" in value;
    isInstance = isInstance && "idTokenSigningAlgValuesSupported" in value;
    isInstance = isInstance && "codeChallengeMethodsSupported" in value;

    return isInstance;
}

export function OpenidConfigurationFromJSON(json: any): OpenidConfiguration {
    return OpenidConfigurationFromJSONTyped(json, false);
}

export function OpenidConfigurationFromJSONTyped(json: any, ignoreDiscriminator: boolean): OpenidConfiguration {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'issuer': json['issuer'],
        'authorizationEndpoint': json['authorization_endpoint'],
        'tokenEndpoint': json['token_endpoint'],
        'userinfoEndpoint': json['userinfo_endpoint'],
        'jwksUri': json['jwks_uri'],
        'scopesSupported': ((json['scopes_supported'] as Array<any>).map(ScopeFromJSON)),
        'claimsSupported': ((json['claims_supported'] as Array<any>).map(ClaimFromJSON)),
        'responseTypesSupported': ((json['response_types_supported'] as Array<any>).map(ResponseTypeFromJSON)),
        'tokenEndpointAuthMethodsSupported': ((json['token_endpoint_auth_methods_supported'] as Array<any>).map(AuthMethodFromJSON)),
        'grantTypesSupported': ((json['grant_types_supported'] as Array<any>).map(GrantTypeFromJSON)),
        'idTokenSigningAlgValuesSupported': ((json['id_token_signing_alg_values_supported'] as Array<any>).map(SigningAlgorithmFromJSON)),
        'codeChallengeMethodsSupported': ((json['code_challenge_methods_supported'] as Array<any>).map(CodeChallengeMethodFromJSON)),
    };
}

export function OpenidConfigurationToJSON(value?: OpenidConfiguration | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'issuer': value.issuer,
        'authorization_endpoint': value.authorizationEndpoint,
        'token_endpoint': value.tokenEndpoint,
        'userinfo_endpoint': value.userinfoEndpoint,
        'jwks_uri': value.jwksUri,
        'scopes_supported': ((value.scopesSupported as Array<any>).map(ScopeToJSON)),
        'claims_supported': ((value.claimsSupported as Array<any>).map(ClaimToJSON)),
        'response_types_supported': ((value.responseTypesSupported as Array<any>).map(ResponseTypeToJSON)),
        'token_endpoint_auth_methods_supported': ((value.tokenEndpointAuthMethodsSupported as Array<any>).map(AuthMethodToJSON)),
        'grant_types_supported': ((value.grantTypesSupported as Array<any>).map(GrantTypeToJSON)),
        'id_token_signing_alg_values_supported': ((value.idTokenSigningAlgValuesSupported as Array<any>).map(SigningAlgorithmToJSON)),
        'code_challenge_methods_supported': ((value.codeChallengeMethodsSupported as Array<any>).map(CodeChallengeMethodToJSON)),
    };
}
