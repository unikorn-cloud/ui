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
import type { ProjectScopedResourceReadMetadata } from './ProjectScopedResourceReadMetadata';
import {
    ProjectScopedResourceReadMetadataFromJSON,
    ProjectScopedResourceReadMetadataFromJSONTyped,
    ProjectScopedResourceReadMetadataToJSON,
} from './ProjectScopedResourceReadMetadata';
import type { ServerReadSpec } from './ServerReadSpec';
import {
    ServerReadSpecFromJSON,
    ServerReadSpecFromJSONTyped,
    ServerReadSpecToJSON,
} from './ServerReadSpec';
import type { ServerReadStatus } from './ServerReadStatus';
import {
    ServerReadStatusFromJSON,
    ServerReadStatusFromJSONTyped,
    ServerReadStatusToJSON,
} from './ServerReadStatus';

/**
 * A server.
 * @export
 * @interface ServerRead
 */
export interface ServerRead {
    /**
     * 
     * @type {ProjectScopedResourceReadMetadata}
     * @memberof ServerRead
     */
    metadata: ProjectScopedResourceReadMetadata;
    /**
     * 
     * @type {ServerReadSpec}
     * @memberof ServerRead
     */
    spec: ServerReadSpec;
    /**
     * 
     * @type {ServerReadStatus}
     * @memberof ServerRead
     */
    status: ServerReadStatus;
}

/**
 * Check if a given object implements the ServerRead interface.
 */
export function instanceOfServerRead(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "spec" in value;
    isInstance = isInstance && "status" in value;

    return isInstance;
}

export function ServerReadFromJSON(json: any): ServerRead {
    return ServerReadFromJSONTyped(json, false);
}

export function ServerReadFromJSONTyped(json: any, ignoreDiscriminator: boolean): ServerRead {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'metadata': ProjectScopedResourceReadMetadataFromJSON(json['metadata']),
        'spec': ServerReadSpecFromJSON(json['spec']),
        'status': ServerReadStatusFromJSON(json['status']),
    };
}

export function ServerReadToJSON(value?: ServerRead | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': ProjectScopedResourceReadMetadataToJSON(value.metadata),
        'spec': ServerReadSpecToJSON(value.spec),
        'status': ServerReadStatusToJSON(value.status),
    };
}

