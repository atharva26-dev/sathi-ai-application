// SAATHI - Multi-User Offline-Aware Storage Service Abstraction
// Enforces complete isolation: 1 Mobile Number = 1 Unique User with 4-Digit PIN.

const STORAGE_PREFIX = 'saathi_';
const ACTIVE_USER_STORAGE_KEY = 'saathi_active_user_mobile';
const KNOWN_CREDENTIALS_STORAGE_KEY = 'saathi_known_credentials';

// Keys that are shared across users (device-level settings)
const GLOBAL_KEYS = new Set([
  'preferred_language',
  'saathi_auth_session',
  'saathi_active_user_mobile',
  'saathi_known_credentials'
]);

interface StoredCredential {
  mobile: string;
  pinHash: string;
  name?: string;
  lastLoginAt: number;
}

// Simple fast deterministic salt hash for client-side offline PIN verification
function hashPinOffline(mobile: string, pin: string): string {
  let hash = 0;
  const str = `saathi_salt_${mobile}_${pin}_2026`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export const storageService = {
  /**
   * Get the currently active user mobile number (clean 10 digits)
   */
  getActiveUser(): string | null {
    try {
      const active = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
      if (!active) return null;
      const clean = active.replace(/\D/g, '').slice(-10);
      return clean.length === 10 ? clean : null;
    } catch {
      return null;
    }
  },

  /**
   * Set or clear the active user mobile.
   * Dispatches 'saathi_active_user_changed' event so context reloads immediately.
   */
  setActiveUser(mobile: string | null): void {
    try {
      if (mobile) {
        const clean = mobile.replace(/\D/g, '').slice(-10);
        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, clean);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('saathi_active_user_changed', { detail: { mobile: clean } }));
        }
      } else {
        localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('saathi_active_user_changed', { detail: { mobile: null } }));
        }
      }
    } catch (e) {
      console.warn('Error setting active user:', e);
    }
  },

  /**
   * Resolve the storage key based on whether the key is device-global or user-scoped.
   */
  resolveKey(key: string): string {
    if (GLOBAL_KEYS.has(key)) {
      return `${STORAGE_PREFIX}global_${key}`;
    }
    const active = this.getActiveUser();
    if (active) {
      return `${STORAGE_PREFIX}user_${active}_${key}`;
    }
    return `${STORAGE_PREFIX}guest_${key}`;
  },

  get<T>(key: string, defaultValue: T): T {
    try {
      const fullKey = this.resolveKey(key);
      const serialized = localStorage.getItem(fullKey);
      if (serialized === null) {
        // Fallback check for legacy migration if user is active
        const legacyKey = 'saathi_app_' + key;
        const legacy = localStorage.getItem(legacyKey);
        if (legacy !== null && this.getActiveUser() === '9822345678') {
          try {
            const parsed = JSON.parse(legacy) as T;
            this.set(key, parsed); // migrate to user-scoped
            return parsed;
          } catch {}
        }
        return defaultValue;
      }
      return JSON.parse(serialized) as T;
    } catch (e) {
      console.warn(`Storage get error for ${key}:`, e);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      const fullKey = this.resolveKey(key);
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage set error for ${key}:`, e);
    }
  },

  remove(key: string): void {
    try {
      const fullKey = this.resolveKey(key);
      localStorage.removeItem(fullKey);
    } catch (e) {
      console.warn(`Storage remove error for ${key}:`, e);
    }
  },

  /**
   * Clears all stored data belonging to a specific mobile number.
   * If no mobile provided, clears data for the current active user.
   */
  clearUserData(mobile?: string): void {
    try {
      const targetMobile = mobile ? mobile.replace(/\D/g, '').slice(-10) : this.getActiveUser();
      if (!targetMobile) return;
      const prefix = `${STORAGE_PREFIX}user_${targetMobile}_`;
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Storage clearUserData error:', e);
    }
  },

  /**
   * Clears any guest data
   */
  clearGuestData(): void {
    try {
      const prefix = `${STORAGE_PREFIX}guest_`;
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Storage clearGuestData error:', e);
    }
  },

  /**
   * Clears everything across all users (factory reset)
   */
  clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('saathi_') || k.startsWith('saathi_app_'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Storage clearAll error:', e);
    }
  },

  // --- Offline PIN Credential Store ---
  saveUserCredential(mobile: string, pin: string, name?: string): void {
    try {
      const clean = mobile.replace(/\D/g, '').slice(-10);
      if (clean.length !== 10 || pin.length !== 4) return;
      const raw = localStorage.getItem(KNOWN_CREDENTIALS_STORAGE_KEY);
      const list: StoredCredential[] = raw ? JSON.parse(raw) : [];
      const pinHash = hashPinOffline(clean, pin);
      const existingIdx = list.findIndex((c) => c.mobile === clean);
      const entry: StoredCredential = {
        mobile: clean,
        pinHash,
        name: name || (existingIdx >= 0 ? list[existingIdx].name : undefined),
        lastLoginAt: Date.now()
      };
      if (existingIdx >= 0) {
        list[existingIdx] = entry;
      } else {
        list.push(entry);
      }
      localStorage.setItem(KNOWN_CREDENTIALS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Error saving user credential:', e);
    }
  },

  verifyLocalPin(mobile: string, pin: string): { verified: boolean; isKnown: boolean } {
    try {
      const clean = mobile.replace(/\D/g, '').slice(-10);
      if (clean.length !== 10 || pin.length !== 4) return { verified: false, isKnown: false };

      // Pre-seed demo user 9822345678 with PIN 1234
      if (clean === '9822345678') {
        return { verified: pin === '1234', isKnown: true };
      }

      const raw = localStorage.getItem(KNOWN_CREDENTIALS_STORAGE_KEY);
      if (!raw) return { verified: false, isKnown: false };
      const list: StoredCredential[] = JSON.parse(raw);
      const cred = list.find((c) => c.mobile === clean);
      if (!cred) return { verified: false, isKnown: false };

      const computed = hashPinOffline(clean, pin);
      return { verified: cred.pinHash === computed, isKnown: true };
    } catch {
      return { verified: false, isKnown: false };
    }
  },

  isUserKnown(mobile: string): boolean {
    const clean = mobile.replace(/\D/g, '').slice(-10);
    if (clean === '9822345678') return true;
    try {
      const raw = localStorage.getItem(KNOWN_CREDENTIALS_STORAGE_KEY);
      if (!raw) return false;
      const list: StoredCredential[] = JSON.parse(raw);
      return list.some((c) => c.mobile === clean);
    } catch {
      return false;
    }
  }
};
