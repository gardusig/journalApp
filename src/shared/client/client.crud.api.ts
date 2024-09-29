import { AxiosInstance, AxiosResponse } from "axios";

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Find all entities
export async function callFindAllAPI<T>(
  axiosInstance: AxiosInstance,
): Promise<ApiResponse<T[]>> {
  try {
    const response: AxiosResponse<ApiResponse<T[]>> =
      await axiosInstance.get(`/`);
    return response.data;
  } catch (error) {
    return { data: [], error: "Failed to fetch entities" };
  }
}

// Create a new entity
export async function callCreateAPI<T>(
  axiosInstance: AxiosInstance,
  entity: T,
): Promise<ApiResponse<T | null>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.post(
      `/`,
      entity,
    );
    return response.data;
  } catch (error) {
    return { data: null, error: "Failed to create entity" };
  }
}

// Update an entity by ID
export async function callUpdateAPI<T>(
  axiosInstance: AxiosInstance,
  id: string,
  entity: T,
): Promise<ApiResponse<T | null>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(
      `/${id}`,
      entity,
    );
    return response.data;
  } catch (error) {
    return { data: null, error: `Failed to update entity with ID ${id}` };
  }
}

// Delete an entity by ID
export async function callRemoveAPI<T>(
  axiosInstance: AxiosInstance,
  id: string,
): Promise<ApiResponse<T | null>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.delete(
      `/${id}`,
    );
    return response.data;
  } catch (error) {
    return { data: null, error: `Failed to delete entity with ID ${id}` };
  }
}

// Find entity by ID
export async function callFindByIdAPI<T>(
  axiosInstance: AxiosInstance,
  id: string,
): Promise<ApiResponse<T | null>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(
      `/${id}`,
    );
    return response.data;
  } catch (error) {
    return { data: null, error: `Failed to fetch entity with ID ${id}` };
  }
}
