/**
 * Environment Configuration
 * 
 * Manages environment-specific configuration for different deployment stages.
 */

import Constants from 'expo-constants';

interface EnvConfig {
  apiUrl: string;
  paystackKey: string;
  googleWebClientId: string;
  environment: 'development' | 'staging' | 'production';
}

const ENV = {
  dev: {
    apiUrl: 'https://ghomes.faithstream.com.ng/api/v1/',
    paystackKey: 'pk_test_0c11ecacc70f90c9ff045a79b2cbccfc83f5f2fb',
    googleWebClientId: '498193419807-uqqimksgu3r5a446dchi5v3rn8mtak3d.apps.googleusercontent.com',
    environment: 'development' as const,
  },
  staging: {
    apiUrl: 'https://ghomes.faithstream.com.ng/api/v1/',
    paystackKey: 'pk_test_xxx',
    googleWebClientId: 'xxx',
    environment: 'staging' as const,
  },
  prod: {
    apiUrl: 'https://ghomes.faithstream.com.ng/api/v1/',
    paystackKey: 'pk_live_xxx',
    googleWebClientId: 'xxx',
    environment: 'production' as const,
  },
};

/**
 * Get environment variables based on release channel
 */
const getEnvVars = (): EnvConfig => {
  // Check for explicit environment variable
  const envFromProcess = process.env.EXPO_PUBLIC_ENV;
  
  if (envFromProcess === 'staging') return ENV.staging;
  if (envFromProcess === 'production') return ENV.prod;
  
  // Check release channel from Expo config
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel;
  
  if (__DEV__) return ENV.dev;
  if (releaseChannel === 'staging') return ENV.staging;
  if (releaseChannel === 'production') return ENV.prod;
  
  // Default to development
  return ENV.dev;
};

export const config = getEnvVars();

/**
 * Helper to check current environment
 */
export const isDevelopment = config.environment === 'development';
export const isStaging = config.environment === 'staging';
export const isProduction = config.environment === 'production';
