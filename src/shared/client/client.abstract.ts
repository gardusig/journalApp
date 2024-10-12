import { Logger } from "@nestjs/common";
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import {
  AuthenticationClient,
  AuthenticationClientInterface,
} from "./client.authentication";
import {
  ApiResponse,
  callCreateAPI,
  callFindAllAPI,
  callFindByIdAPI,
  callRemoveAPI,
  callUpdateAPI,
} from "./client.crud.api";
import { createAxiosInstance } from "./client.util";

export abstract class AbstractApiClient<T> {
  protected readonly logger = new Logger(AbstractApiClient.name);

  private readonly axiosInstance: AxiosInstance;
  private authenticationClient: AuthenticationClientInterface | null;

  constructor(baseURL: string, resourcePath: string) {
    this.axiosInstance = createAxiosInstance(`${baseURL}/${resourcePath}`);
    this.authenticationClient = null;
    this.initializeInterceptors();
  }

  withAuthenticationClient(
    authenticationClient: AuthenticationClient,
  ): AbstractApiClient<T> {
    this.authenticationClient = authenticationClient;
    return this;
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

  private initializeInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (this.authenticationClient) {
          const token = await this.authenticationClient.getValidToken();
          this.logger.debug("token:", token);
          return this.attachAuthHeaders(config, token);
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.logger.error("API call failed:", error);
        return Promise.reject(error);
      },
    );
  }

  private async attachAuthHeaders(
    config: InternalAxiosRequestConfig,
    authenticationToken: string | null,
  ): Promise<InternalAxiosRequestConfig> {
    if (authenticationToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authenticationToken}`;
    }
    return config;
  }
}
