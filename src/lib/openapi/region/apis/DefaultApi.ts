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


import * as runtime from '../runtime';
import type {
  ExternalNetworks,
  Flavors,
  IdentityRead,
  IdentityWrite,
  Images,
  ModelError,
  Regions,
} from '../models/index';
import {
    ExternalNetworksFromJSON,
    ExternalNetworksToJSON,
    FlavorsFromJSON,
    FlavorsToJSON,
    IdentityReadFromJSON,
    IdentityReadToJSON,
    IdentityWriteFromJSON,
    IdentityWriteToJSON,
    ImagesFromJSON,
    ImagesToJSON,
    ModelErrorFromJSON,
    ModelErrorToJSON,
    RegionsFromJSON,
    RegionsToJSON,
} from '../models/index';

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsGetRequest {
    organizationID: string;
    projectID: string;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDExternalnetworksGetRequest {
    organizationID: string;
    projectID: string;
    regionID: string;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGetRequest {
    organizationID: string;
    projectID: string;
    regionID: string;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPostRequest {
    organizationID: string;
    projectID: string;
    regionID: string;
    identityWrite: IdentityWrite;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGetRequest {
    organizationID: string;
    projectID: string;
    regionID: string;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * List all regions.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsGetRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Regions>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsGet.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/regions`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegionsFromJSON(jsonValue));
    }

    /**
     * List all regions.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsGet(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Regions> {
        const response = await this.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get a list of external networks.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDExternalnetworksGetRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDExternalnetworksGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ExternalNetworks>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDExternalnetworksGet.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDExternalnetworksGet.');
        }

        if (requestParameters.regionID === null || requestParameters.regionID === undefined) {
            throw new runtime.RequiredError('regionID','Required parameter requestParameters.regionID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDExternalnetworksGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/regions/{regionID}/externalnetworks`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))).replace(`{${"regionID"}}`, encodeURIComponent(String(requestParameters.regionID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ExternalNetworksFromJSON(jsonValue));
    }

    /**
     * Get a list of external networks.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDExternalnetworksGet(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDExternalnetworksGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ExternalNetworks> {
        const response = await this.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDExternalnetworksGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Lists all compute flavors that the authenticated user has access to
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGetRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Flavors>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGet.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGet.');
        }

        if (requestParameters.regionID === null || requestParameters.regionID === undefined) {
            throw new runtime.RequiredError('regionID','Required parameter requestParameters.regionID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/regions/{regionID}/flavors`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))).replace(`{${"regionID"}}`, encodeURIComponent(String(requestParameters.regionID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FlavorsFromJSON(jsonValue));
    }

    /**
     * Lists all compute flavors that the authenticated user has access to
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGet(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Flavors> {
        const response = await this.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDFlavorsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create a new identity in the region.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPostRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IdentityRead>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPost.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPost.');
        }

        if (requestParameters.regionID === null || requestParameters.regionID === undefined) {
            throw new runtime.RequiredError('regionID','Required parameter requestParameters.regionID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPost.');
        }

        if (requestParameters.identityWrite === null || requestParameters.identityWrite === undefined) {
            throw new runtime.RequiredError('identityWrite','Required parameter requestParameters.identityWrite was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/regions/{regionID}/identities`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))).replace(`{${"regionID"}}`, encodeURIComponent(String(requestParameters.regionID))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IdentityWriteToJSON(requestParameters.identityWrite),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IdentityReadFromJSON(jsonValue));
    }

    /**
     * Create a new identity in the region.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPost(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IdentityRead> {
        const response = await this.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDIdentitiesPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Lists all compute images that the authenticated user has access to.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGetRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Images>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGet.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGet.');
        }

        if (requestParameters.regionID === null || requestParameters.regionID === undefined) {
            throw new runtime.RequiredError('regionID','Required parameter requestParameters.regionID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/regions/{regionID}/images`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))).replace(`{${"regionID"}}`, encodeURIComponent(String(requestParameters.regionID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImagesFromJSON(jsonValue));
    }

    /**
     * Lists all compute images that the authenticated user has access to.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGet(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Images> {
        const response = await this.apiV1OrganizationsOrganizationIDProjectsProjectIDRegionsRegionIDImagesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
