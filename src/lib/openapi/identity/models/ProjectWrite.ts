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
import type { ProjectSpec } from './ProjectSpec';
import {
    ProjectSpecFromJSON,
    ProjectSpecFromJSONTyped,
    ProjectSpecToJSON,
} from './ProjectSpec';
import type { ResourceWriteMetadata } from './ResourceWriteMetadata';
import {
    ResourceWriteMetadataFromJSON,
    ResourceWriteMetadataFromJSONTyped,
    ResourceWriteMetadataToJSON,
} from './ResourceWriteMetadata';

/**
 * A project when created or updated.
 * @export
 * @interface ProjectWrite
 */
export interface ProjectWrite {
    /**
     * 
     * @type {ResourceWriteMetadata}
     * @memberof ProjectWrite
     */
    metadata: ResourceWriteMetadata;
    /**
     * 
     * @type {ProjectSpec}
     * @memberof ProjectWrite
     */
    spec: ProjectSpec;
}

/**
 * Check if a given object implements the ProjectWrite interface.
 */
export function instanceOfProjectWrite(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "spec" in value;

    return isInstance;
}

export function ProjectWriteFromJSON(json: any): ProjectWrite {
    return ProjectWriteFromJSONTyped(json, false);
}

export function ProjectWriteFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectWrite {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': ResourceWriteMetadataFromJSON(json['metadata']),
        'spec': ProjectSpecFromJSON(json['spec']),
    };
}

export function ProjectWriteToJSON(value?: ProjectWrite | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ResourceWriteMetadataToJSON(value.metadata),
        'spec': ProjectSpecToJSON(value.spec),
    };
}

