import { MMKV } from 'react-native-mmkv';
import type { StorageKey } from './storage-keys';

export const storage = new MMKV();

export const storageService = {
  // String operations
  getString: (key: StorageKey): string | undefined => {
    return storage.getString(key);
  },

  setString: (key: StorageKey, value: string): void => {
    storage.set(key, value);
  },

  // Object operations
  getObject: <T>(key: StorageKey): T | undefined => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : undefined;
  },

  setObject: <T>(key: StorageKey, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  // Boolean operations
  getBoolean: (key: StorageKey): boolean | undefined => {
    return storage.getBoolean(key);
  },

  setBoolean: (key: StorageKey, value: boolean): void => {
    storage.set(key, value);
  },

  // Number operations
  getNumber: (key: StorageKey): number | undefined => {
    return storage.getNumber(key);
  },

  setNumber: (key: StorageKey, value: number): void => {
    storage.set(key, value);
  },

  // Delete operations
  delete: (key: StorageKey): void => {
    storage.delete(key);
  },

  clearAll: (): void => {
    storage.clearAll();
  },

  // Check if key exists
  contains: (key: StorageKey): boolean => {
    return storage.contains(key);
  },

  // Get all keys
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },
};
