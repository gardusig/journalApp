import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import axiosRetry from "axios-retry";

import { AuthenticationToken, getValidToken } from "./client.authentication";
import {
  ApiResponse,
  callCreateAPI,
  callFindAllAPI,
  callFindByIdAPI,
  callRemoveAPI,
  callUpdateAPI,
} from "./client.crud.api";

export abstract class AbstractApiClient<T> {
  private readonly axiosInstance: AxiosInstance;
  private authenticationToken: AuthenticationToken | null;

  constructor(baseURL: string, resourcePath: string) {
    this.axiosInstance = this.createAxiosInstance(baseURL, resourcePath);
    this.authenticationToken = null;
    this.setupRetryLogic();
    this.initializeInterceptors();
  }

  async findAll(): Promise<ApiResponse<T[]>> {
    return callFindAllAPI(this.axiosInstance);
  }

  async findById(id: string): Promise<ApiResponse<T | null>> {
    return callFindByIdAPI(this.axiosInstance, id);
  }

  async update(id: string, entity: T): Promise<ApiResponse<T | null>> {
    return callUpdateAPI(this.axiosInstance, id, entity);
  }

  async delete(id: string): Promise<ApiResponse<T | null>> {
    return callRemoveAPI(this.axiosInstance, id);
  }

  async create(entity: T): Promise<ApiResponse<T | null>> {
    return callCreateAPI(this.axiosInstance, entity);
  }

  private createAxiosInstance(
    baseURL: string,
    resourcePath: string,
  ): AxiosInstance {
    return axios.create({
      baseURL: `${baseURL}/${resourcePath}`,
      timeout: 5 * 1000, // 5 seconds timeout
    });
  }

  private initializeInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        this.authenticationToken = await getValidToken(
          this.authenticationToken,
        );
        return this.attachAuthHeaders(config, this.authenticationToken);
      },
      (error: AxiosError) => Promise.reject(error),
    );
  }

  private setupRetryLogic() {
    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: (retryCount: number) => {
        console.log(`Retry attempt: ${retryCount}`);
        return (1 << retryCount) * 1000;
      },
      retryCondition: (error: AxiosError) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status !== undefined && error.response.status >= 500)
        );
      },
    });
  }

  private async attachAuthHeaders(
    config: InternalAxiosRequestConfig,
    authenticationToken: AuthenticationToken | null,
  ): Promise<InternalAxiosRequestConfig> {
    if (authenticationToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authenticationToken.accessToken}`;
    }
    return config;
  }
}
