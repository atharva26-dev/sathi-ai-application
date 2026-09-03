// SAATHI - Offline-aware Storage Service Abstraction

const STORAGE_PREFIX = 'saathi_app_';

export const storageService = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const serialized = localStorage.getItem(STORAGE_PREFIX + key);
      if (serialized === null) return defaultValue;
      return JSON.parse(serialized) as T;
    } catch (e) {
      console.warn(`Storage get error for ${key}:`, e);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage set error for ${key}:`, e);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      console.warn(`Storage remove error for ${key}:`, e);
    }
  },

  clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
  }
};
