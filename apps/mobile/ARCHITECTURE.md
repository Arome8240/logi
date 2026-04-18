# React Native App Architecture Guide

A comprehensive guide for building scalable, maintainable React Native applications using Expo Router with feature-based architecture.

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Project Structure](#project-structure)
4. [Routing Architecture](#routing-architecture)
5. [Feature-Based Organization](#feature-based-organization)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Storage Strategy](#storage-strategy)
9. [Component Architecture](#component-architecture)
10. [Styling Approach](#styling-approach)
11. [Migration Guide](#migration-guide)
12. [Best Practices](#best-practices)

---

## Overview

This architecture separates routing concerns from UI logic, organizing code by features rather than technical layers. It provides:

- **Clear separation of concerns** - Routes handle navigation, screens handle UI
- **Feature-based organization** - Related code lives together
- **Reusable components** - Screens can be imported anywhere
- **Easy testing** - Components are isolated and testable
- **Scalable structure** - Easy to add new features

---

## Core Principles

### 1. Separation of Routing and UI Logic

**Routes** (`app/` directory):
- Thin wrappers that import screen components
- Handle navigation structure
- Configure animations and layouts
- 3-5 lines of code maximum

**Screens** (`src/features/` directory):
- Contain all UI logic and state
- Handle business logic
- Manage data fetching
- Can be reused across multiple routes

### 2. Feature-Based Organization

Group related functionality together:
```
src/features/auth/
├── api/           # API calls
├── hooks/         # Custom hooks
├── screens/       # Screen components
├── components/    # Feature-specific components
├── types/         # TypeScript types
└── utils/         # Feature utilities
```

### 3. Single Responsibility

Each file has one clear purpose:
- Routes only handle navigation
- Screens only handle UI
- Hooks only handle logic
- Components only handle presentation

---

## Project Structure

```
your-app/
├── app/                          # Expo Router - Routing layer
│   ├── (auth)/                   # Auth route group
│   │   ├── _layout.tsx          # Auth layout with animations
│   │   ├── login/
│   │   │   ├── _layout.tsx      # Login layout
│   │   │   └── index.tsx        # Login route (imports LoginScreen)
│   │   └── register/
│   │       ├── _layout.tsx
│   │       └── index.tsx
│   ├── (home)/                   # Main app route group
│   │   ├── _layout.tsx
│   │   ├── profile/
│   │   └── settings/
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
│
├── src/                          # Application source
│   ├── features/                 # Feature-based modules
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── auth-api.ts
│   │   │   ├── hooks/
│   │   │   │   └── use-auth.ts
│   │   │   ├── screens/
│   │   │   │   ├── index.ts     # Export all screens
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   ├── components/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── profile/
│   │   └── settings/
│   │
│   ├── shared/                   # Shared across features
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── text.tsx
│   │   │   ├── layout/          # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Container.tsx
│   │   │   └── common/          # Common components
│   │   ├── hooks/               # Shared hooks
│   │   ├── utils/               # Utility functions
│   │   ├── types/               # Shared types
│   │   ├── config/              # Configuration
│   │   │   └── env.ts
│   │   └── store/               # Global state
│   │       └── index.ts
│   │
│   ├── services/                 # External services
│   │   ├── api/
│   │   │   └── client.ts        # API client setup
│   │   ├── storage/
│   │   │   ├── storage-service.ts
│   │   │   └── storage-keys.ts
│   │   ├── notifications/
│   │   └── analytics/
│   │
│   └── lib/                      # Third-party integrations
│       ├── react-query/
│       └── stream-chat/
│
├── assets/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
└── docs/                         # Documentation
    ├── ARCHITECTURE.md
    └── API_DOCUMENTATION.md
```

---

## Routing Architecture

### Route File Pattern

**Before (Bad):**
```typescript
// app/(auth)/login.tsx
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  
  // 200+ lines of implementation
  
  return (
    <View>
      {/* Complex UI */}
    </View>
  );
}
```

**After (Good):**
```typescript
// app/(auth)/login/index.tsx
import React from "react";
import { LoginScreen } from "@/features/auth/screens";

export default function Login() {
  return <LoginScreen />;
}
```

### Layout Files

Every route group should have a `_layout.tsx` for animations:

```typescript
// app/(auth)/_layout.tsx
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 200,
      }}
    />
  );
}
```

### Route Organization

```
app/
├── (auth)/              # Parentheses = route group (not in URL)
│   ├── _layout.tsx     # Underscore = special file
│   ├── login/
│   │   ├── _layout.tsx
│   │   └── index.tsx   # /login
│   └── register/
│       └── index.tsx   # /register
│
├── (home)/
│   ├── _layout.tsx
│   ├── profile/
│   │   └── index.tsx   # /profile
│   └── settings/
│       ├── index.tsx   # /settings
│       └── [id].tsx    # /settings/:id (dynamic route)
│
└── _layout.tsx         # Root layout
```

---

## Feature-Based Organization

### Feature Structure

Each feature is self-contained:

```
src/features/auth/
├── api/
│   └── auth-api.ts           # API endpoints
├── hooks/
│   ├── use-auth.ts           # Auth logic
│   ├── use-login.ts          # Login mutation
│   └── use-register.ts       # Register mutation
├── screens/
│   ├── index.ts              # Export all screens
│   ├── LoginScreen.tsx       # Login UI
│   ├── RegisterScreen.tsx    # Register UI
│   └── OTPScreen.tsx         # OTP verification UI
├── components/
│   ├── AuthHeader.tsx        # Feature-specific components
│   └── SocialButtons.tsx
├── types/
│   └── auth.types.ts         # TypeScript types
└── utils/
    └── validation.ts         # Feature utilities
```

### Screen Component Pattern

```typescript
// src/features/auth/screens/LoginScreen.tsx
import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Input } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui";
import { Text } from "@/shared/components/ui";
import { useLogin } from "../hooks/use-login";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleLogin = () => {
    login.mutate({ email, password }, {
      onSuccess: () => router.push("/home"),
    });
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold">Welcome Back</Text>
      
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      
      <Button onPress={handleLogin} loading={login.isPending}>
        <Text className="text-white">Login</Text>
      </Button>
    </View>
  );
}
```

### Index File Pattern

```typescript
// src/features/auth/screens/index.ts
export { LoginScreen } from './LoginScreen';
export { RegisterScreen } from './RegisterScreen';
export { OTPScreen } from './OTPScreen';
```

---

## State Management

### Global State (Zustand)

```typescript
// src/shared/store/index.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const zustandStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

interface AppState {
  user: string | null;
  token: string | null;
  setUser: (user: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

// Selectors
export const useUser = () => useStore((state) => state.user);
export const useToken = () => useStore((state) => state.token);
export const useAuthActions = () => useStore((state) => ({
  setUser: state.setUser,
  setToken: state.setToken,
  logout: state.logout,
}));
```

### Server State (React Query)

```typescript
// src/features/auth/hooks/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth-api';
import { useAuthActions } from '@/shared/store';
import { toast } from 'sonner-native';

export function useLogin() {
  const { setUser, setToken } = useAuthActions();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(JSON.stringify(data.user));
      setToken(data.token);
      toast.success('Login successful');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
}
```

---

## API Integration

### API Client Setup

```typescript
// src/services/api/client.ts
import axios from 'axios';
import { useStore } from '@/shared/store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

### Feature API Pattern

```typescript
// src/features/auth/api/auth-api.ts
import { apiClient } from '@/services/api/client';
import { LoginData, RegisterData, AuthResponse } from '../types/auth.types';

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

  verifyOTP: async (otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-otp', { otp });
    return response.data;
  },
};
```

---

## Storage Strategy

### Storage Service

```typescript
// src/services/storage/storage-service.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const storageService = {
  // String operations
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  // Object operations
  getObject: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : undefined;
  },

  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  // Boolean operations
  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },

  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  // Number operations
  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  setNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },

  // Delete operations
  delete: (key: string): void => {
    storage.delete(key);
  },

  clearAll: (): void => {
    storage.clearAll();
  },

  // Check if key exists
  contains: (key: string): boolean => {
    return storage.contains(key);
  },
};
```

### Storage Keys

```typescript
// src/services/storage/storage-keys.ts
export const STORAGE_KEYS = {
  // Auth
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  
  // Onboarding
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // Settings
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  
  // Cache
  CACHED_DATA: 'cached_data',
} as const;
```

---

## Component Architecture

### UI Components

```typescript
// src/shared/components/ui/button.tsx
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from './text';
import { cn } from '@/shared/utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export function Button({
  children,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  className,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        'px-4 py-3 rounded-lg items-center justify-center',
        variant === 'primary' && 'bg-primary',
        variant === 'secondary' && 'bg-secondary',
        variant === 'outline' && 'border-2 border-primary bg-transparent',
        (disabled || loading) && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
```

### Layout Components

```typescript
// src/shared/components/layout/Header.tsx
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-native';
import { Text } from '../ui/text';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
}

export function Header({ title, showBack = true, rightComponent }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View className="w-6" />
      )}
      
      <Text className="text-lg font-bold">{title}</Text>
      
      {rightComponent || <View className="w-6" />}
    </View>
  );
}
```

---

## Styling Approach

We use a combination of **NativeWind (Tailwind CSS)** for utility-first styling and **React Native Reusables** for pre-built, accessible UI components.

### NativeWind (Tailwind CSS)

NativeWind brings Tailwind CSS to React Native, allowing you to use utility classes for styling.

#### Installation

```bash
npm install nativewind
npm install --save-dev tailwindcss
```

#### Configuration

```typescript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DA100B',
          50: '#FEE2E2',
          100: '#FECACA',
          200: '#FCA5A5',
          300: '#F87171',
          400: '#EF4444',
          500: '#DA100B',
          600: '#B91C1C',
          700: '#991B1B',
          800: '#7F1D1D',
          900: '#6B1515',
        },
        secondary: {
          DEFAULT: '#8AC53F',
          50: '#F0F9E8',
          100: '#E1F3D1',
          200: '#C3E7A3',
          300: '#A5DB75',
          400: '#8AC53F',
          500: '#6FA32F',
          600: '#548123',
          700: '#3F6119',
          800: '#2A400F',
          900: '#152005',
        },
      },
      fontFamily: {
        'dm-sans': ['DMSans-Regular'],
        'dm-sans-medium': ['DMSans-Medium'],
        'dm-sans-bold': ['DMSans-Bold'],
      },
    },
  },
  plugins: [],
};
```

```typescript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
```

### React Native Reusables

React Native Reusables provides pre-built, accessible UI components based on shadcn/ui design system.

#### Installation

```bash
npx @react-native-reusables/cli@latest init
```

This will:
- Set up the components directory
- Configure theme colors
- Add necessary dependencies

#### Component Structure

```
src/shared/components/ui/
├── button.tsx          # Button component
├── input.tsx           # Input component
├── text.tsx            # Text component
├── card.tsx            # Card component
├── dialog.tsx          # Dialog/Modal component
├── dropdown-menu.tsx   # Dropdown menu
├── select.tsx          # Select component
├── switch.tsx          # Switch/Toggle
├── checkbox.tsx        # Checkbox component
├── radio-group.tsx     # Radio buttons
├── skeleton.tsx        # Loading skeleton
├── toast.tsx           # Toast notifications
└── ...
```

#### Using Reusables Components

```typescript
// src/shared/components/ui/button.tsx
import * as React from 'react';
import { Pressable } from 'react-native';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const buttonVariants = {
  default: 'bg-primary active:opacity-90',
  destructive: 'bg-destructive active:opacity-90',
  outline: 'border border-input bg-background active:bg-accent',
  secondary: 'bg-secondary active:opacity-80',
  ghost: 'active:bg-accent',
  link: 'active:underline',
};

const buttonSizes = {
  default: 'h-12 px-4 py-3',
  sm: 'h-9 px-3',
  lg: 'h-14 px-8',
  icon: 'h-10 w-10',
};

interface ButtonProps {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

function Button({
  variant = 'default',
  size = 'default',
  className,
  children,
  onPress,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <TextClassContext.Provider
      value={cn(
        variant === 'outline' ? 'text-foreground' : 'text-primary-foreground',
        'text-base font-medium'
      )}
    >
      <Pressable
        className={cn(
          'flex-row items-center justify-center rounded-lg',
          buttonVariants[variant],
          buttonSizes[size],
          disabled && 'opacity-50',
          className
        )}
        onPress={onPress}
        disabled={disabled}
        {...props}
      >
        {children}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonVariants, buttonSizes };
```

```typescript
// src/shared/components/ui/input.tsx
import * as React from 'react';
import { TextInput, View } from 'react-native';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
  className?: string;
  error?: boolean;
}

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  InputProps
>(({ className, error, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'h-12 rounded-lg border border-input bg-background px-4 py-3',
        'text-base text-foreground',
        'placeholder:text-muted-foreground',
        'focus:border-primary focus:border-2',
        error && 'border-destructive',
        props.editable === false && 'opacity-50',
        className
      )}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
```

### Theme Configuration

```typescript
// src/lib/constants.ts
export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    border: 'hsl(240 5.9% 90%)',
    card: 'hsl(0 0% 100%)',
    notification: 'hsl(0 84.2% 60.2%)',
    primary: 'hsl(355 84% 44%)',
    text: 'hsl(240 10% 3.9%)',
  },
  dark: {
    background: 'hsl(240 10% 3.9%)',
    border: 'hsl(240 3.7% 15.9%)',
    card: 'hsl(240 10% 3.9%)',
    notification: 'hsl(0 72% 51%)',
    primary: 'hsl(355 84% 44%)',
    text: 'hsl(0 0% 98%)',
  },
};
```

### Component Usage Examples

```typescript
// Using Button
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';

<Button variant="default" size="lg" onPress={handleSubmit}>
  <Text>Submit</Text>
</Button>

<Button variant="outline" onPress={handleCancel}>
  <Text>Cancel</Text>
</Button>

<Button variant="ghost" size="sm" onPress={handleEdit}>
  <Text>Edit</Text>
</Button>
```

```typescript
// Using Input
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

<View className="gap-2">
  <Label>Email</Label>
  <Input
    placeholder="Enter your email"
    keyboardType="email-address"
    autoCapitalize="none"
    value={email}
    onChangeText={setEmail}
  />
</View>
```

```typescript
// Using Card
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Welcome Back</CardTitle>
    <CardDescription>Sign in to your account</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

```typescript
// Using Dialog
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to proceed?
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### Combining NativeWind and Reusables

```typescript
// Screen example combining both approaches
import { View, ScrollView } from 'react-native';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Text } from '@/shared/components/ui/text';
import { Card, CardContent } from '@/shared/components/ui/card';

export function LoginScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-5">
        {/* NativeWind utility classes */}
        <Text className="text-3xl font-bold text-foreground mb-2">
          Welcome Back
        </Text>
        <Text className="text-base text-muted-foreground mb-8">
          Sign in to continue
        </Text>

        {/* Reusables Card component */}
        <Card className="mb-6">
          <CardContent className="gap-4 pt-6">
            {/* Reusables Input with NativeWind classes */}
            <View className="gap-2">
              <Text className="text-sm font-medium">Email</Text>
              <Input
                placeholder="email@example.com"
                keyboardType="email-address"
                className="bg-gray-50"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium">Password</Text>
              <Input
                placeholder="Enter password"
                secureTextEntry
                className="bg-gray-50"
              />
            </View>

            {/* Reusables Button */}
            <Button className="mt-4" onPress={handleLogin}>
              <Text className="text-white font-semibold">Sign In</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
```

### Utility Functions

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Benefits of This Approach

✅ **Consistency** - Reusables provides consistent, accessible components
✅ **Flexibility** - NativeWind allows custom styling with utility classes
✅ **Accessibility** - Reusables components are built with accessibility in mind
✅ **Type Safety** - Full TypeScript support
✅ **Customization** - Easy to customize theme and components
✅ **Developer Experience** - Fast development with pre-built components
✅ **Performance** - Optimized for React Native
✅ **Dark Mode** - Built-in dark mode support

---

## Migration Guide

### Step-by-Step Process

#### 1. Analyze Current Structure

```bash
# List all route files
find app -name "*.tsx" -type f

# Identify screens to refactor
# Look for files with >50 lines of code
```

#### 2. Create Feature Directory

```bash
mkdir -p src/features/auth/screens
mkdir -p src/features/auth/api
mkdir -p src/features/auth/hooks
```

#### 3. Extract Screen Component

**From:**
```typescript
// app/(auth)/login.tsx
export default function Login() {
  // 200 lines of code
}
```

**To:**
```typescript
// src/features/auth/screens/LoginScreen.tsx
export function LoginScreen() {
  // 200 lines of code (same implementation)
}

// src/features/auth/screens/index.ts
export { LoginScreen } from './LoginScreen';

// app/(auth)/login/index.tsx
import { LoginScreen } from "@/features/auth/screens";

export default function Login() {
  return <LoginScreen />;
}
```

#### 4. Add Layout Files

```typescript
// app/(auth)/login/_layout.tsx
import { Stack } from "expo-router";

export default function LoginLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
```

#### 5. Test and Verify

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Run the app
npx expo start
```

### Migration Checklist

- [ ] Create feature directory structure
- [ ] Move screen implementation to feature/screens
- [ ] Create index.ts with exports
- [ ] Update route file to import screen
- [ ] Add _layout.tsx for animations
- [ ] Move API calls to feature/api
- [ ] Move hooks to feature/hooks
- [ ] Move types to feature/types
- [ ] Test navigation
- [ ] Verify TypeScript compilation
- [ ] Test on device

---

## Best Practices

### 1. Naming Conventions

```typescript
// Screens: PascalCase with "Screen" suffix
LoginScreen.tsx
ProfileScreen.tsx

// Components: PascalCase
Button.tsx
Header.tsx

// Hooks: camelCase with "use" prefix
use-auth.ts
use-profile.ts

// API: kebab-case with "-api" suffix
auth-api.ts
profile-api.ts

// Types: kebab-case with ".types" suffix
auth.types.ts
profile.types.ts
```

### 2. Import Organization

```typescript
// 1. React and React Native
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';

// 2. Third-party libraries
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

// 3. Shared components
import { Button } from '@/shared/components/ui';
import { Header } from '@/shared/components/layout';

// 4. Feature-specific imports
import { useAuth } from '../hooks/use-auth';
import { authApi } from '../api/auth-api';

// 5. Types
import type { User } from '../types/auth.types';
```

### 3. Component Size

- Routes: 3-5 lines
- Screens: 100-300 lines (split if larger)
- Components: 50-150 lines
- Hooks: 20-100 lines

### 4. File Organization

```
✅ Good:
src/features/auth/screens/LoginScreen.tsx (250 lines)
src/features/auth/hooks/use-login.ts (50 lines)
src/features/auth/api/auth-api.ts (80 lines)

❌ Bad:
app/(auth)/login.tsx (500 lines with everything)
```

### 5. Type Safety

```typescript
// Always define types
interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Use types in functions
export const login = async (data: LoginData): Promise<AuthResponse> => {
  // ...
};
```

### 6. Error Handling

```typescript
// In hooks
export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      toast.success('Login successful');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

// In screens
const handleLogin = () => {
  if (!email || !password) {
    toast.error('Please fill all fields');
    return;
  }
  
  login.mutate({ email, password });
};
```

### 7. Loading States

```typescript
// Show loading indicators
<Button onPress={handleLogin} loading={login.isPending}>
  <Text>Login</Text>
</Button>

// Handle loading in screens
if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}
```

### 8. Code Reusability

```typescript
// Extract reusable logic to hooks
export function useFormValidation() {
  const [errors, setErrors] = useState({});
  
  const validate = (data: any) => {
    // Validation logic
  };
  
  return { errors, validate };
}

// Extract reusable UI to components
export function FormField({ label, error, ...props }) {
  return (
    <View>
      <Text>{label}</Text>
      <Input {...props} />
      {error && <Text className="text-red-500">{error}</Text>}
    </View>
  );
}
```

---

## Conclusion

This architecture provides:

✅ **Scalability** - Easy to add new features
✅ **Maintainability** - Clear structure and separation
✅ **Testability** - Isolated components
✅ **Reusability** - Shared components and hooks
✅ **Type Safety** - TypeScript throughout
✅ **Performance** - Optimized rendering
✅ **Developer Experience** - Clear patterns and conventions

Follow this guide to build production-ready React Native applications with clean, maintainable code.

---

## Additional Resources

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [MMKV Documentation](https://github.com/mrousavy/react-native-mmkv)

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Maintained By:** Your Team
