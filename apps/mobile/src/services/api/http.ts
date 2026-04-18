/**
 * HTTP Service
 * 
 * Wrapper functions for HTTP methods with type safety.
 * Provides a clean API for making HTTP requests.
 */

import { AxiosRequestConfig } from 'axios';
import api from './client';

type RequestConfig = AxiosRequestConfig;

/**
 * GET request
 * @param url - API endpoint
 * @param config - Optional Axios config
 * @returns Promise with response data
 */
export const get = async <T>(url: string, config?: RequestConfig): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

/**
 * POST request
 * @param url - API endpoint
 * @param data - Request body
 * @param config - Optional Axios config
 * @returns Promise with response data
 */
export const post = async <T>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

/**
 * PUT request
 * @param url - API endpoint
 * @param data - Request body
 * @param config - Optional Axios config
 * @returns Promise with response data
 */
export const put = async <T>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

/**
 * PATCH request
 * @param url - API endpoint
 * @param data - Request body
 * @param config - Optional Axios config
 * @returns Promise with response data
 */
export const patch = async <T>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
  const response = await api.patch<T>(url, data, config);
  return response.data;
};

/**
 * DELETE request
 * @param url - API endpoint
 * @param config - Optional Axios config
 * @returns Promise with response data
 */
export const del = async <T>(url: string, config?: RequestConfig): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};
