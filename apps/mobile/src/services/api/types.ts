/**
 * API Types
 * 
 * Comprehensive type definitions for API requests and responses.
 */

// ============================================================================
// Base API Response Types
// ============================================================================

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]> | null;
  data?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Paginated Response
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// ============================================================================
// API Error Types
// ============================================================================

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]> | null;
  data?: unknown;
}

export interface AxiosErrorResponse {
  response?: {
    status: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
      [key: string]: unknown;
    };
  };
  message?: string;
}

// ============================================================================
// Type Guards
// ============================================================================

export const isApiError = (response: ApiResponse): response is ApiErrorResponse => {
  return response.success === false;
};

export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

export const isAxiosError = (error: unknown): error is AxiosErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
};

// ============================================================================
// Query/Mutation Types
// ============================================================================

export interface QueryError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface MutationError extends QueryError {
  response?: {
    status: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract error message from various error formats
 */
export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
};

/**
 * Extract validation errors from API response
 */
export const getValidationErrors = (error: unknown): Record<string, string[]> | null => {
  if (isAxiosError(error)) {
    return error.response?.data?.errors || null;
  }
  
  return null;
};
