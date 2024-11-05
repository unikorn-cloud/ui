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


import * as runtime from '../runtime';
import type {
  ClusterManagerRead,
  ClusterManagerWrite,
  Flavor,
  Image,
  KubernetesClusterRead,
  KubernetesClusterWrite,
  ModelError,
} from '../models/index';
import {
    ClusterManagerReadFromJSON,
    ClusterManagerReadToJSON,
    ClusterManagerWriteFromJSON,
    ClusterManagerWriteToJSON,
    FlavorFromJSON,
    FlavorToJSON,
    ImageFromJSON,
    ImageToJSON,
    KubernetesClusterReadFromJSON,
    KubernetesClusterReadToJSON,
    KubernetesClusterWriteFromJSON,
    KubernetesClusterWriteToJSON,
    ModelErrorFromJSON,
    ModelErrorToJSON,
} from '../models/index';

export interface ApiV1OrganizationsOrganizationIDClustermanagersGetRequest {
    organizationID: string;
}

export interface ApiV1OrganizationsOrganizationIDClustersGetRequest {
    organizationID: string;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDeleteRequest {
    organizationID: string;
    projectID: string;
    clusterManagerID: string;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPutRequest {
    organizationID: string;
    projectID: string;
    clusterManagerID: string;
    clusterManagerWrite: ClusterManagerWrite;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersPostRequest {
    organizationID: string;
    projectID: string;
    clusterManagerWrite: ClusterManagerWrite;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDeleteRequest {
    organizationID: string;
    projectID: string;
    clusterID: string;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGetRequest {
    organizationID: string;
    projectID: string;
    clusterID: string;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPutRequest {
    organizationID: string;
    projectID: string;
    clusterID: string;
    kubernetesClusterWrite: KubernetesClusterWrite;
}

export interface ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersPostRequest {
    organizationID: string;
    projectID: string;
    kubernetesClusterWrite: KubernetesClusterWrite;
}

export interface ApiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGetRequest {
    organizationID: string;
    regionID: string;
}

export interface ApiV1OrganizationsOrganizationIDRegionsRegionIDImagesGetRequest {
    organizationID: string;
    regionID: string;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * Lists cluster managers within the organization.
     */
    async apiV1OrganizationsOrganizationIDClustermanagersGetRaw(requestParameters: ApiV1OrganizationsOrganizationIDClustermanagersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ClusterManagerRead>>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDClustermanagersGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/clustermanagers`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ClusterManagerReadFromJSON));
    }

    /**
     * Lists cluster managers within the organization.
     */
    async apiV1OrganizationsOrganizationIDClustermanagersGet(requestParameters: ApiV1OrganizationsOrganizationIDClustermanagersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ClusterManagerRead>> {
        const response = await this.apiV1OrganizationsOrganizationIDClustermanagersGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List all clusters within the organization.
     */
    async apiV1OrganizationsOrganizationIDClustersGetRaw(requestParameters: ApiV1OrganizationsOrganizationIDClustersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<KubernetesClusterRead>>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDClustersGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/clusters`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(KubernetesClusterReadFromJSON));
    }

    /**
     * List all clusters within the organization.
     */
    async apiV1OrganizationsOrganizationIDClustersGet(requestParameters: ApiV1OrganizationsOrganizationIDClustersGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<KubernetesClusterRead>> {
        const response = await this.apiV1OrganizationsOrganizationIDClustersGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes a cluster manager from within the scoped project. This is a cascading operation and will delete all contained clusters.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDeleteRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDelete.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDelete.');
        }

        if (requestParameters.clusterManagerID === null || requestParameters.clusterManagerID === undefined) {
            throw new runtime.RequiredError('clusterManagerID','Required parameter requestParameters.clusterManagerID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/clustermanagers/{clusterManagerID}`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))).replace(`{${"clusterManagerID"}}`, encodeURIComponent(String(requestParameters.clusterManagerID))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes a cluster manager from within the scoped project. This is a cascading operation and will delete all contained clusters.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDelete(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Updates a cluster manager within the scoped project.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPutRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPut.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPut.');
        }

        if (requestParameters.clusterManagerID === null || requestParameters.clusterManagerID === undefined) {
            throw new runtime.RequiredError('clusterManagerID','Required parameter requestParameters.clusterManagerID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPut.');
        }

        if (requestParameters.clusterManagerWrite === null || requestParameters.clusterManagerWrite === undefined) {
            throw new runtime.RequiredError('clusterManagerWrite','Required parameter requestParameters.clusterManagerWrite was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPut.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/clustermanagers/{clusterManagerID}`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))).replace(`{${"clusterManagerID"}}`, encodeURIComponent(String(requestParameters.clusterManagerID))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ClusterManagerWriteToJSON(requestParameters.clusterManagerWrite),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Updates a cluster manager within the scoped project.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPut(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersClusterManagerIDPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates a new cluster manager within the project.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersPostRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ClusterManagerRead>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersPost.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersPost.');
        }

        if (requestParameters.clusterManagerWrite === null || requestParameters.clusterManagerWrite === undefined) {
            throw new runtime.RequiredError('clusterManagerWrite','Required parameter requestParameters.clusterManagerWrite was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/clustermanagers`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ClusterManagerWriteToJSON(requestParameters.clusterManagerWrite),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ClusterManagerReadFromJSON(jsonValue));
    }

    /**
     * Creates a new cluster manager within the project.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersPost(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ClusterManagerRead> {
        const response = await this.apiV1OrganizationsOrganizationIDProjectsProjectIDClustermanagersPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete a cluster from within a the selected cluster manager.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDeleteRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete.');
        }

        if (requestParameters.clusterID === null || requestParameters.clusterID === undefined) {
            throw new runtime.RequiredError('clusterID','Required parameter requestParameters.clusterID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/clusters/{clusterID}`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))).replace(`{${"clusterID"}}`, encodeURIComponent(String(requestParameters.clusterID))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a cluster from within a the selected cluster manager.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDelete(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Get a cluster\'s Kubernetes configuration.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGetRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGet.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGet.');
        }

        if (requestParameters.clusterID === null || requestParameters.clusterID === undefined) {
            throw new runtime.RequiredError('clusterID','Required parameter requestParameters.clusterID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/clusters/{clusterID}/kubeconfig`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))).replace(`{${"clusterID"}}`, encodeURIComponent(String(requestParameters.clusterID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Get a cluster\'s Kubernetes configuration.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGet(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDKubeconfigGetRaw(requestParameters, initOverrides);
    }

    /**
     * Update a cluster within the selected cluster manager.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPutRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPut.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPut.');
        }

        if (requestParameters.clusterID === null || requestParameters.clusterID === undefined) {
            throw new runtime.RequiredError('clusterID','Required parameter requestParameters.clusterID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPut.');
        }

        if (requestParameters.kubernetesClusterWrite === null || requestParameters.kubernetesClusterWrite === undefined) {
            throw new runtime.RequiredError('kubernetesClusterWrite','Required parameter requestParameters.kubernetesClusterWrite was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPut.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/clusters/{clusterID}`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))).replace(`{${"clusterID"}}`, encodeURIComponent(String(requestParameters.clusterID))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: KubernetesClusterWriteToJSON(requestParameters.kubernetesClusterWrite),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Update a cluster within the selected cluster manager.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPut(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersClusterIDPutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates a new cluster within the selected cluster manager.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustersPostRaw(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<KubernetesClusterRead>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersPost.');
        }

        if (requestParameters.projectID === null || requestParameters.projectID === undefined) {
            throw new runtime.RequiredError('projectID','Required parameter requestParameters.projectID was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersPost.');
        }

        if (requestParameters.kubernetesClusterWrite === null || requestParameters.kubernetesClusterWrite === undefined) {
            throw new runtime.RequiredError('kubernetesClusterWrite','Required parameter requestParameters.kubernetesClusterWrite was null or undefined when calling apiV1OrganizationsOrganizationIDProjectsProjectIDClustersPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/projects/{projectID}/clusters`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"projectID"}}`, encodeURIComponent(String(requestParameters.projectID))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: KubernetesClusterWriteToJSON(requestParameters.kubernetesClusterWrite),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => KubernetesClusterReadFromJSON(jsonValue));
    }

    /**
     * Creates a new cluster within the selected cluster manager.
     */
    async apiV1OrganizationsOrganizationIDProjectsProjectIDClustersPost(requestParameters: ApiV1OrganizationsOrganizationIDProjectsProjectIDClustersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<KubernetesClusterRead> {
        const response = await this.apiV1OrganizationsOrganizationIDProjectsProjectIDClustersPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Lists all Kubernetes compatible flavors that the user has access to.
     */
    async apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGetRaw(requestParameters: ApiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Flavor>>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet.');
        }

        if (requestParameters.regionID === null || requestParameters.regionID === undefined) {
            throw new runtime.RequiredError('regionID','Required parameter requestParameters.regionID was null or undefined when calling apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/regions/{regionID}/flavors`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"regionID"}}`, encodeURIComponent(String(requestParameters.regionID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(FlavorFromJSON));
    }

    /**
     * Lists all Kubernetes compatible flavors that the user has access to.
     */
    async apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGet(requestParameters: ApiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Flavor>> {
        const response = await this.apiV1OrganizationsOrganizationIDRegionsRegionIDFlavorsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Lists all Kubernetes compatible images that the user has access to.
     */
    async apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGetRaw(requestParameters: ApiV1OrganizationsOrganizationIDRegionsRegionIDImagesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Image>>> {
        if (requestParameters.organizationID === null || requestParameters.organizationID === undefined) {
            throw new runtime.RequiredError('organizationID','Required parameter requestParameters.organizationID was null or undefined when calling apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet.');
        }

        if (requestParameters.regionID === null || requestParameters.regionID === undefined) {
            throw new runtime.RequiredError('regionID','Required parameter requestParameters.regionID was null or undefined when calling apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organizations/{organizationID}/regions/{regionID}/images`.replace(`{${"organizationID"}}`, encodeURIComponent(String(requestParameters.organizationID))).replace(`{${"regionID"}}`, encodeURIComponent(String(requestParameters.regionID))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ImageFromJSON));
    }

    /**
     * Lists all Kubernetes compatible images that the user has access to.
     */
    async apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGet(requestParameters: ApiV1OrganizationsOrganizationIDRegionsRegionIDImagesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Image>> {
        const response = await this.apiV1OrganizationsOrganizationIDRegionsRegionIDImagesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
