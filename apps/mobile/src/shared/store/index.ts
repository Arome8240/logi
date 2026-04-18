import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const zustandStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  getToken: () => string | null;
  logout: () => void;
  clearTokens: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      getToken: () => get().token,
      logout: () => set({ user: null, token: null }),
      clearTokens: () => set({ user: null, token: null }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

// Selectors for better performance
export const useUser = () => useStore((state) => state.user);
export const useToken = () => useStore((state) => state.token);
export const useIsAuthenticated = () => useStore((state) => !!state.token);
export const useAuthActions = () => useStore((state) => ({
  setUser: state.setUser,
  setToken: state.setToken,
  logout: state.logout,
}));
