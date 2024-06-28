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
import type { Oauth2ProviderSpec } from './Oauth2ProviderSpec';
import {
    Oauth2ProviderSpecFromJSON,
    Oauth2ProviderSpecFromJSONTyped,
    Oauth2ProviderSpecToJSON,
} from './Oauth2ProviderSpec';
import type { OrganizationScopedResourceReadMetadata } from './OrganizationScopedResourceReadMetadata';
import {
    OrganizationScopedResourceReadMetadataFromJSON,
    OrganizationScopedResourceReadMetadataFromJSONTyped,
    OrganizationScopedResourceReadMetadataToJSON,
} from './OrganizationScopedResourceReadMetadata';

/**
 * An OAuth2 provider when read.
 * @export
 * @interface Oauth2ProviderRead
 */
export interface Oauth2ProviderRead {
    /**
     * 
     * @type {OrganizationScopedResourceReadMetadata}
     * @memberof Oauth2ProviderRead
     */
    metadata: OrganizationScopedResourceReadMetadata;
    /**
     * 
     * @type {Oauth2ProviderSpec}
     * @memberof Oauth2ProviderRead
     */
    spec: Oauth2ProviderSpec;
}

/**
 * Check if a given object implements the Oauth2ProviderRead interface.
 */
export function instanceOfOauth2ProviderRead(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "spec" in value;

    return isInstance;
}

export function Oauth2ProviderReadFromJSON(json: any): Oauth2ProviderRead {
    return Oauth2ProviderReadFromJSONTyped(json, false);
}

export function Oauth2ProviderReadFromJSONTyped(json: any, ignoreDiscriminator: boolean): Oauth2ProviderRead {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': OrganizationScopedResourceReadMetadataFromJSON(json['metadata']),
        'spec': Oauth2ProviderSpecFromJSON(json['spec']),
    };
}

export function Oauth2ProviderReadToJSON(value?: Oauth2ProviderRead | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': OrganizationScopedResourceReadMetadataToJSON(value.metadata),
        'spec': Oauth2ProviderSpecToJSON(value.spec),
    };
}
