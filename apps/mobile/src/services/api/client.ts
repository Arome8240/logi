/**
 * API Client
 * 
 * Enhanced Axios client with interceptors, error handling, and logging.
 */

import type { InternalAxiosRequestConfig } from 'axios';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { router } from 'expo-router';

import { useStore } from '@/shared/store';
import { logger } from '@/services/logger';
import { ApiError } from './types';
import { config } from '@/shared/config/env';

const BASE_URL = config.apiUrl;

const SKIP_AUTH_ENDPOINTS = [
  'auth/login',
  'auth/signup',
  'auth/verify-otp',
  'auth/send-otp',
  'auth/resend-otp',
  'auth/forgot-password',
  'auth/reset-password',
];

let onUnauthorized: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
  onUnauthorized = callback;
};

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useStore.getState().getToken();
    const shouldSkipAuth = SKIP_AUTH_ENDPOINTS.some((endpoint) =>
      config.url?.includes(`/${endpoint}`)
    );

    if (token && config.headers && !shouldSkipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (__DEV__) {
      logger.debug('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data instanceof FormData ? '[FormData]' : config.data,
      });
    }

    return config;
  },
  (error) => {
    logger.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (__DEV__) {
      logger.debug('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      logger.warn('Unauthorized access - clearing tokens');
      
      // Clear tokens
      useStore.getState().clearTokens();
      
      // Call custom unauthorized handler if set
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        // Default: redirect to login
        router.replace('/login' as any);
      }
      
      return Promise.reject(normalizeError(error));
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      logger.warn('Access forbidden:', error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      logger.error('Network Error:', error.message);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: null,
        data: null,
      } as ApiError);
    }

    // Log error
    logger.error('API Error:', {
      status: error.response?.status,
      url: originalRequest?.url,
      message: error.response?.data?.message,
      errors: error.response?.data?.errors,
    });

    return Promise.reject(normalizeError(error));
  }
);

// Normalize error format
const normalizeError = (error: AxiosError<any>): ApiError => {
  return {
    status: error.response?.status || 0,
    message: error.response?.data?.message || error.message || 'Something went wrong',
    errors: error.response?.data?.errors || null,
    data: error.response?.data || null,
  };
};

export default api;
