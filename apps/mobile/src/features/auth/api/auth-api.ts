import { apiClient } from '@/services/api/client';
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  OTPVerifyData,
  ResetPasswordData,
  User,
} from '../types/auth.types';

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  verifyOTP: async (data: OTPVerifyData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  sendOTP: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/send-otp', { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
