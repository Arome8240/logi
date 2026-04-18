# Logistics Mobile App

React Native mobile app built with Expo Router.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment:
```bash
cp .env.example .env
# Update EXPO_PUBLIC_API_URL with your backend URL
```

3. Start the app:
```bash
pnpm start
```

## API Integration

### Using React Query Hooks

```typescript
import { useLogin } from '@/features/auth/hooks';

function LoginScreen() {
  const login = useLogin();
  
  const handleLogin = () => {
    login.mutate({ email, password });
  };
  
  return (
    <Button onPress={handleLogin} loading={login.isPending}>
      Login
    </Button>
  );
}
```

### Making API Calls

```typescript
import { apiClient } from '@/services/api/client';

// GET request
const response = await apiClient.get('/shipments');

// POST request
const response = await apiClient.post('/shipments', data);

// PUT request
const response = await apiClient.put('/shipments/123', data);

// DELETE request
const response = await apiClient.delete('/shipments/123');
```

### Query Keys

```typescript
import { queryKeys } from '@/lib/react-query';

// Use predefined query keys
queryKeys.auth.user
queryKeys.shipments.list({ status: 'active' })
queryKeys.shipments.detail('123')
```

## State Management

### Global State (Zustand)

```typescript
import { useUser, useAuthActions } from '@/shared/store';

function Profile() {
  const user = useUser();
  const { logout } = useAuthActions();
  
  return <Button onPress={logout}>Logout</Button>;
}
```

### Local Storage (MMKV)

```typescript
import { storageService, STORAGE_KEYS } from '@/services/storage';

// Store data
storageService.setString(STORAGE_KEYS.THEME, 'dark');
storageService.setObject(STORAGE_KEYS.USER, userData);

// Retrieve data
const theme = storageService.getString(STORAGE_KEYS.THEME);
const user = storageService.getObject(STORAGE_KEYS.USER);
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.
