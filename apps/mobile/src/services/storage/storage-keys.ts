export const STORAGE_KEYS = {
  // Auth
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  
  // Onboarding
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FIRST_LAUNCH: 'first_launch',
  
  // Settings
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  LOCATION_ENABLED: 'location_enabled',
  
  // Cache
  CACHED_SHIPMENTS: 'cached_shipments',
  CACHED_ROUTES: 'cached_routes',
  LAST_SYNC: 'last_sync',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
