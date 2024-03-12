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
  Applications,
  ClusterManager,
  ClusterManagers,
  Flavors,
  Images,
  KubernetesCluster,
  KubernetesClusters,
  Oauth2Error,
  Project,
  Projects,
  Regions,
} from '../models/index';
import {
    ApplicationsFromJSON,
    ApplicationsToJSON,
    ClusterManagerFromJSON,
    ClusterManagerToJSON,
    ClusterManagersFromJSON,
    ClusterManagersToJSON,
    FlavorsFromJSON,
    FlavorsToJSON,
    ImagesFromJSON,
    ImagesToJSON,
    KubernetesClusterFromJSON,
    KubernetesClusterToJSON,
    KubernetesClustersFromJSON,
    KubernetesClustersToJSON,
    Oauth2ErrorFromJSON,
    Oauth2ErrorToJSON,
    ProjectFromJSON,
    ProjectToJSON,
    ProjectsFromJSON,
    ProjectsToJSON,
    RegionsFromJSON,
    RegionsToJSON,
} from '../models/index';

export interface ApiV1ProjectsPostRequest {
    project: Project;
}

export interface ApiV1ProjectsProjectNameClustermanagersClusterManagerNameDeleteRequest {
    projectName: string;
    clusterManagerName: string;
}

export interface ApiV1ProjectsProjectNameClustermanagersClusterManagerNamePutRequest {
    projectName: string;
    clusterManagerName: string;
    clusterManager: ClusterManager;
}

export interface ApiV1ProjectsProjectNameClustermanagersPostRequest {
    projectName: string;
    clusterManager: ClusterManager;
}

export interface ApiV1ProjectsProjectNameClustersClusterNameDeleteRequest {
    projectName: string;
    clusterName: string;
}

export interface ApiV1ProjectsProjectNameClustersClusterNameKubeconfigGetRequest {
    projectName: string;
    clusterName: string;
}

export interface ApiV1ProjectsProjectNameClustersClusterNamePutRequest {
    projectName: string;
    clusterName: string;
    kubernetesCluster: KubernetesCluster;
}

export interface ApiV1ProjectsProjectNameClustersPostRequest {
    projectName: string;
    kubernetesCluster: KubernetesCluster;
}

export interface ApiV1ProjectsProjectNameDeleteRequest {
    projectName: string;
}

export interface ApiV1RegionsRegionNameFlavorsGetRequest {
    regionName: string;
}

export interface ApiV1RegionsRegionNameImagesGetRequest {
    regionName: string;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * Lists applications available to be installed on clusters.
     */
    async apiV1ApplicationsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Applications>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/applications`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ApplicationsFromJSON(jsonValue));
    }

    /**
     * Lists applications available to be installed on clusters.
     */
    async apiV1ApplicationsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Applications> {
        const response = await this.apiV1ApplicationsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Lists cluster managers within the organization.
     */
    async apiV1ClustermanagersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ClusterManagers>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/clustermanagers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ClusterManagersFromJSON(jsonValue));
    }

    /**
     * Lists cluster managers within the organization.
     */
    async apiV1ClustermanagersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ClusterManagers> {
        const response = await this.apiV1ClustermanagersGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * List all clusters within the organization.
     */
    async apiV1ClustersGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<KubernetesClusters>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/clusters`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => KubernetesClustersFromJSON(jsonValue));
    }

    /**
     * List all clusters within the organization.
     */
    async apiV1ClustersGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<KubernetesClusters> {
        const response = await this.apiV1ClustersGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Deletes an organization and all its resources based on the access token claims.
     */
    async apiV1OrganizationDeleteRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organization`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes an organization and all its resources based on the access token claims.
     */
    async apiV1OrganizationDelete(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1OrganizationDeleteRaw(initOverrides);
    }

    /**
     * Creates a new organization based on the access token claims.
     */
    async apiV1OrganizationPostRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/organization`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates a new organization based on the access token claims.
     */
    async apiV1OrganizationPost(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1OrganizationPostRaw(initOverrides);
    }

    /**
     * List all projects for the organization.
     */
    async apiV1ProjectsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Projects>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProjectsFromJSON(jsonValue));
    }

    /**
     * List all projects for the organization.
     */
    async apiV1ProjectsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Projects> {
        const response = await this.apiV1ProjectsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates a new project resource for the user\'s organization.
     */
    async apiV1ProjectsPostRaw(requestParameters: ApiV1ProjectsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.project === null || requestParameters.project === undefined) {
            throw new runtime.RequiredError('project','Required parameter requestParameters.project was null or undefined when calling apiV1ProjectsPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ProjectToJSON(requestParameters.project),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates a new project resource for the user\'s organization.
     */
    async apiV1ProjectsPost(requestParameters: ApiV1ProjectsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ProjectsPostRaw(requestParameters, initOverrides);
    }

    /**
     * Deletes a cluster manager from within the scoped project. This is a cascading operation and will delete all contained clusters.
     */
    async apiV1ProjectsProjectNameClustermanagersClusterManagerNameDeleteRaw(requestParameters: ApiV1ProjectsProjectNameClustermanagersClusterManagerNameDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectName === null || requestParameters.projectName === undefined) {
            throw new runtime.RequiredError('projectName','Required parameter requestParameters.projectName was null or undefined when calling apiV1ProjectsProjectNameClustermanagersClusterManagerNameDelete.');
        }

        if (requestParameters.clusterManagerName === null || requestParameters.clusterManagerName === undefined) {
            throw new runtime.RequiredError('clusterManagerName','Required parameter requestParameters.clusterManagerName was null or undefined when calling apiV1ProjectsProjectNameClustermanagersClusterManagerNameDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects/{projectName}/clustermanagers/{clusterManagerName}`.replace(`{${"projectName"}}`, encodeURIComponent(String(requestParameters.projectName))).replace(`{${"clusterManagerName"}}`, encodeURIComponent(String(requestParameters.clusterManagerName))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes a cluster manager from within the scoped project. This is a cascading operation and will delete all contained clusters.
     */
    async apiV1ProjectsProjectNameClustermanagersClusterManagerNameDelete(requestParameters: ApiV1ProjectsProjectNameClustermanagersClusterManagerNameDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ProjectsProjectNameClustermanagersClusterManagerNameDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Updates a cluster manager within the scoped project.
     */
    async apiV1ProjectsProjectNameClustermanagersClusterManagerNamePutRaw(requestParameters: ApiV1ProjectsProjectNameClustermanagersClusterManagerNamePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectName === null || requestParameters.projectName === undefined) {
            throw new runtime.RequiredError('projectName','Required parameter requestParameters.projectName was null or undefined when calling apiV1ProjectsProjectNameClustermanagersClusterManagerNamePut.');
        }

        if (requestParameters.clusterManagerName === null || requestParameters.clusterManagerName === undefined) {
            throw new runtime.RequiredError('clusterManagerName','Required parameter requestParameters.clusterManagerName was null or undefined when calling apiV1ProjectsProjectNameClustermanagersClusterManagerNamePut.');
        }

        if (requestParameters.clusterManager === null || requestParameters.clusterManager === undefined) {
            throw new runtime.RequiredError('clusterManager','Required parameter requestParameters.clusterManager was null or undefined when calling apiV1ProjectsProjectNameClustermanagersClusterManagerNamePut.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects/{projectName}/clustermanagers/{clusterManagerName}`.replace(`{${"projectName"}}`, encodeURIComponent(String(requestParameters.projectName))).replace(`{${"clusterManagerName"}}`, encodeURIComponent(String(requestParameters.clusterManagerName))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ClusterManagerToJSON(requestParameters.clusterManager),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Updates a cluster manager within the scoped project.
     */
    async apiV1ProjectsProjectNameClustermanagersClusterManagerNamePut(requestParameters: ApiV1ProjectsProjectNameClustermanagersClusterManagerNamePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ProjectsProjectNameClustermanagersClusterManagerNamePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates a new cluster manager within the project.
     */
    async apiV1ProjectsProjectNameClustermanagersPostRaw(requestParameters: ApiV1ProjectsProjectNameClustermanagersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectName === null || requestParameters.projectName === undefined) {
            throw new runtime.RequiredError('projectName','Required parameter requestParameters.projectName was null or undefined when calling apiV1ProjectsProjectNameClustermanagersPost.');
        }

        if (requestParameters.clusterManager === null || requestParameters.clusterManager === undefined) {
            throw new runtime.RequiredError('clusterManager','Required parameter requestParameters.clusterManager was null or undefined when calling apiV1ProjectsProjectNameClustermanagersPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects/{projectName}/clustermanagers`.replace(`{${"projectName"}}`, encodeURIComponent(String(requestParameters.projectName))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ClusterManagerToJSON(requestParameters.clusterManager),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates a new cluster manager within the project.
     */
    async apiV1ProjectsProjectNameClustermanagersPost(requestParameters: ApiV1ProjectsProjectNameClustermanagersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ProjectsProjectNameClustermanagersPostRaw(requestParameters, initOverrides);
    }

    /**
     * Delete a cluster from within a the selected cluster manager.
     */
    async apiV1ProjectsProjectNameClustersClusterNameDeleteRaw(requestParameters: ApiV1ProjectsProjectNameClustersClusterNameDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectName === null || requestParameters.projectName === undefined) {
            throw new runtime.RequiredError('projectName','Required parameter requestParameters.projectName was null or undefined when calling apiV1ProjectsProjectNameClustersClusterNameDelete.');
        }

        if (requestParameters.clusterName === null || requestParameters.clusterName === undefined) {
            throw new runtime.RequiredError('clusterName','Required parameter requestParameters.clusterName was null or undefined when calling apiV1ProjectsProjectNameClustersClusterNameDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects/{projectName}/clusters/{clusterName}`.replace(`{${"projectName"}}`, encodeURIComponent(String(requestParameters.projectName))).replace(`{${"clusterName"}}`, encodeURIComponent(String(requestParameters.clusterName))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a cluster from within a the selected cluster manager.
     */
    async apiV1ProjectsProjectNameClustersClusterNameDelete(requestParameters: ApiV1ProjectsProjectNameClustersClusterNameDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ProjectsProjectNameClustersClusterNameDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * Get a cluster\'s Kubernetes configuration.
     */
    async apiV1ProjectsProjectNameClustersClusterNameKubeconfigGetRaw(requestParameters: ApiV1ProjectsProjectNameClustersClusterNameKubeconfigGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectName === null || requestParameters.projectName === undefined) {
            throw new runtime.RequiredError('projectName','Required parameter requestParameters.projectName was null or undefined when calling apiV1ProjectsProjectNameClustersClusterNameKubeconfigGet.');
        }

        if (requestParameters.clusterName === null || requestParameters.clusterName === undefined) {
            throw new runtime.RequiredError('clusterName','Required parameter requestParameters.clusterName was null or undefined when calling apiV1ProjectsProjectNameClustersClusterNameKubeconfigGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects/{projectName}/clusters/{clusterName}/kubeconfig`.replace(`{${"projectName"}}`, encodeURIComponent(String(requestParameters.projectName))).replace(`{${"clusterName"}}`, encodeURIComponent(String(requestParameters.clusterName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Get a cluster\'s Kubernetes configuration.
     */
    async apiV1ProjectsProjectNameClustersClusterNameKubeconfigGet(requestParameters: ApiV1ProjectsProjectNameClustersClusterNameKubeconfigGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ProjectsProjectNameClustersClusterNameKubeconfigGetRaw(requestParameters, initOverrides);
    }

    /**
     * Update a cluster within the selected cluster manager.
     */
    async apiV1ProjectsProjectNameClustersClusterNamePutRaw(requestParameters: ApiV1ProjectsProjectNameClustersClusterNamePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectName === null || requestParameters.projectName === undefined) {
            throw new runtime.RequiredError('projectName','Required parameter requestParameters.projectName was null or undefined when calling apiV1ProjectsProjectNameClustersClusterNamePut.');
        }

        if (requestParameters.clusterName === null || requestParameters.clusterName === undefined) {
            throw new runtime.RequiredError('clusterName','Required parameter requestParameters.clusterName was null or undefined when calling apiV1ProjectsProjectNameClustersClusterNamePut.');
        }

        if (requestParameters.kubernetesCluster === null || requestParameters.kubernetesCluster === undefined) {
            throw new runtime.RequiredError('kubernetesCluster','Required parameter requestParameters.kubernetesCluster was null or undefined when calling apiV1ProjectsProjectNameClustersClusterNamePut.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects/{projectName}/clusters/{clusterName}`.replace(`{${"projectName"}}`, encodeURIComponent(String(requestParameters.projectName))).replace(`{${"clusterName"}}`, encodeURIComponent(String(requestParameters.clusterName))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: KubernetesClusterToJSON(requestParameters.kubernetesCluster),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Update a cluster within the selected cluster manager.
     */
    async apiV1ProjectsProjectNameClustersClusterNamePut(requestParameters: ApiV1ProjectsProjectNameClustersClusterNamePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ProjectsProjectNameClustersClusterNamePutRaw(requestParameters, initOverrides);
    }

    /**
     * Creates a new cluster within the selected cluster manager.
     */
    async apiV1ProjectsProjectNameClustersPostRaw(requestParameters: ApiV1ProjectsProjectNameClustersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectName === null || requestParameters.projectName === undefined) {
            throw new runtime.RequiredError('projectName','Required parameter requestParameters.projectName was null or undefined when calling apiV1ProjectsProjectNameClustersPost.');
        }

        if (requestParameters.kubernetesCluster === null || requestParameters.kubernetesCluster === undefined) {
            throw new runtime.RequiredError('kubernetesCluster','Required parameter requestParameters.kubernetesCluster was null or undefined when calling apiV1ProjectsProjectNameClustersPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects/{projectName}/clusters`.replace(`{${"projectName"}}`, encodeURIComponent(String(requestParameters.projectName))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: KubernetesClusterToJSON(requestParameters.kubernetesCluster),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates a new cluster within the selected cluster manager.
     */
    async apiV1ProjectsProjectNameClustersPost(requestParameters: ApiV1ProjectsProjectNameClustersPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ProjectsProjectNameClustersPostRaw(requestParameters, initOverrides);
    }

    /**
     * Deletes the project associated with the authenticated user\'s scoped authorisation token. This is a cascading operation and will delete all contained cluster managers and clusters.
     */
    async apiV1ProjectsProjectNameDeleteRaw(requestParameters: ApiV1ProjectsProjectNameDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectName === null || requestParameters.projectName === undefined) {
            throw new runtime.RequiredError('projectName','Required parameter requestParameters.projectName was null or undefined when calling apiV1ProjectsProjectNameDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/projects/{projectName}`.replace(`{${"projectName"}}`, encodeURIComponent(String(requestParameters.projectName))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes the project associated with the authenticated user\'s scoped authorisation token. This is a cascading operation and will delete all contained cluster managers and clusters.
     */
    async apiV1ProjectsProjectNameDelete(requestParameters: ApiV1ProjectsProjectNameDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV1ProjectsProjectNameDeleteRaw(requestParameters, initOverrides);
    }

    /**
     * List all regions.
     */
    async apiV1RegionsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Regions>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/regions`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegionsFromJSON(jsonValue));
    }

    /**
     * List all regions.
     */
    async apiV1RegionsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Regions> {
        const response = await this.apiV1RegionsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Lists all compute flavors that the authenticated user has access to
     */
    async apiV1RegionsRegionNameFlavorsGetRaw(requestParameters: ApiV1RegionsRegionNameFlavorsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Flavors>> {
        if (requestParameters.regionName === null || requestParameters.regionName === undefined) {
            throw new runtime.RequiredError('regionName','Required parameter requestParameters.regionName was null or undefined when calling apiV1RegionsRegionNameFlavorsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/regions/{regionName}/flavors`.replace(`{${"regionName"}}`, encodeURIComponent(String(requestParameters.regionName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FlavorsFromJSON(jsonValue));
    }

    /**
     * Lists all compute flavors that the authenticated user has access to
     */
    async apiV1RegionsRegionNameFlavorsGet(requestParameters: ApiV1RegionsRegionNameFlavorsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Flavors> {
        const response = await this.apiV1RegionsRegionNameFlavorsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Lists all compute images that the authenticated user has access to.
     */
    async apiV1RegionsRegionNameImagesGetRaw(requestParameters: ApiV1RegionsRegionNameImagesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Images>> {
        if (requestParameters.regionName === null || requestParameters.regionName === undefined) {
            throw new runtime.RequiredError('regionName','Required parameter requestParameters.regionName was null or undefined when calling apiV1RegionsRegionNameImagesGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("oauth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/regions/{regionName}/images`.replace(`{${"regionName"}}`, encodeURIComponent(String(requestParameters.regionName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImagesFromJSON(jsonValue));
    }

    /**
     * Lists all compute images that the authenticated user has access to.
     */
    async apiV1RegionsRegionNameImagesGet(requestParameters: ApiV1RegionsRegionNameImagesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Images> {
        const response = await this.apiV1RegionsRegionNameImagesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
