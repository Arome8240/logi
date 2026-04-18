export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  
  // Shipments
  shipments: {
    all: ['shipments'] as const,
    list: (filters?: any) => ['shipments', 'list', filters] as const,
    detail: (id: string) => ['shipments', 'detail', id] as const,
    tracking: (id: string) => ['shipments', 'tracking', id] as const,
  },
  
  // Drivers
  drivers: {
    all: ['drivers'] as const,
    list: (filters?: any) => ['drivers', 'list', filters] as const,
    detail: (id: string) => ['drivers', 'detail', id] as const,
    available: ['drivers', 'available'] as const,
  },
  
  // Vehicles
  vehicles: {
    all: ['vehicles'] as const,
    list: (filters?: any) => ['vehicles', 'list', filters] as const,
    detail: (id: string) => ['vehicles', 'detail', id] as const,
  },
  
  // Routes
  routes: {
    all: ['routes'] as const,
    list: (filters?: any) => ['routes', 'list', filters] as const,
    detail: (id: string) => ['routes', 'detail', id] as const,
    optimize: (data: any) => ['routes', 'optimize', data] as const,
  },
} as const;
