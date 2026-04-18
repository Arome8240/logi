/**
 * API Error Handler
 * 
 * Utilities for handling and displaying API errors.
 */

import { toast } from 'sonner-native';
import { ApiError } from './types';

/**
 * Handle API error and show appropriate toast messages
 */
export const handleApiError = (error: any, customMessage?: string) => {
  const apiError = error as ApiError;
  
  // Use custom message if provided
  if (customMessage) {
    toast.error(customMessage);
    return;
  }
  
  // Handle validation errors (422)
  if (apiError.status === 422 && apiError.errors) {
    // Show first error from each field
    Object.entries(apiError.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        toast.error(messages[0]);
      }
    });
    return;
  }
  
  // Handle network errors
  if (apiError.status === 0) {
    toast.error('Network error. Please check your connection.');
    return;
  }
  
  // Handle unauthorized
  if (apiError.status === 401) {
    toast.error('Session expired. Please login again.');
    return;
  }
  
  // Handle forbidden
  if (apiError.status === 403) {
    toast.error('You do not have permission to perform this action.');
    return;
  }
  
  // Handle not found
  if (apiError.status === 404) {
    toast.error('Resource not found.');
    return;
  }
  
  // Handle server errors
  if (apiError.status >= 500) {
    toast.error('Server error. Please try again later.');
    return;
  }
  
  // Default error message
  toast.error(apiError.message || 'Something went wrong. Please try again.');
};

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error: any): string => {
  const apiError = error as ApiError;
  
  // Handle validation errors
  if (apiError.status === 422 && apiError.errors) {
    const firstError = Object.values(apiError.errors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0];
    }
  }
  
  return apiError.message || 'Something went wrong';
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  const apiError = error as ApiError;
  return apiError.status === 0;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: any): boolean => {
  const apiError = error as ApiError;
  return apiError.status === 401;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: any): boolean => {
  const apiError = error as ApiError;
  return apiError.status === 422;
};
