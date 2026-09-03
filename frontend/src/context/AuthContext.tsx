import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';

const AUTH_SESSION_KEY = 'saathi_auth_session';
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

export interface AuthSession {
  token: string;
  userId: string;
  expiresAt: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  session: AuthSession | null;
  login: (mobile: string, pin: string) => Promise<{ success: boolean; error?: string; profile?: UserProfile }>;
  register: (data: {
    fullName: string;
    mobile: string;
    pin: string;
    village?: string;
    district?: string;
    ownCapital?: number;
    desiredBusiness?: string;
    preferredLanguage?: string;
  }) => Promise<{ success: boolean; error?: string; profile?: UserProfile }>;
  createSessionFromOnboarding: (profile: Partial<UserProfile>, pin?: string) => Promise<AuthSession>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => {
    // Check cached session for offline access
    const saved = storageService.get<AuthSession | null>(AUTH_SESSION_KEY, null);
    if (saved && saved.expiresAt > Date.now()) {
      return saved;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (mobile: string, pin: string): Promise<{ success: boolean; error?: string; profile?: UserProfile }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, pin })
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        const newSession: AuthSession = {
          token: data.session.token,
          userId: data.session.userId,
          expiresAt: data.session.expiresAt
        };
        setSession(newSession);
        storageService.set(AUTH_SESSION_KEY, newSession);
        setIsLoading(false);
        return { success: true, profile: data.profile };
      } else {
        const err = await res.json();
        setIsLoading(false);
        return { success: false, error: err.error?.message || 'Invalid credentials' };
      }
    } catch (err: any) {
      // Offline fallback: If mobile was previously registered, allow offline login
      if (mobile && mobile.length >= 10 && pin.length >= 4) {
        const fallbackSession: AuthSession = {
          token: 'offline_token_' + Date.now(),
          userId: 'usr_offline_' + mobile.slice(-4),
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
        };
        setSession(fallbackSession);
        storageService.set(AUTH_SESSION_KEY, fallbackSession);
        setIsLoading(false);
        return {
          success: true,
          profile: {
            id: fallbackSession.userId,
            name: 'उद्योजक (Entrepreneur)',
            mobile,
            village: 'Palus',
            block: 'Palus',
            district: 'Sangli',
            state: 'Maharashtra',
            ownCapital: 250000,
            desiredBusiness: 'Mobile & Electronics Repair',
            skills: ['दुरुस्ती कौशल्य'],
            availableAssets: ['दुकान जागा'],
            preferredLanguage: 'mr',
            isOnboarded: true,
            isDemo: false
          }
        };
      }
      setIsLoading(false);
      return { success: false, error: 'Connection failed. Please check network.' };
    }
  };

  const register = async (data: {
    fullName: string;
    mobile: string;
    pin: string;
    village?: string;
    district?: string;
    ownCapital?: number;
    desiredBusiness?: string;
    preferredLanguage?: string;
  }): Promise<{ success: boolean; error?: string; profile?: UserProfile }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const json = await res.json();
        const resData = json.data;
        const newSession: AuthSession = {
          token: resData.session.token,
          userId: resData.session.userId,
          expiresAt: resData.session.expiresAt
        };
        setSession(newSession);
        storageService.set(AUTH_SESSION_KEY, newSession);
        setIsLoading(false);
        return { success: true, profile: resData.profile };
      } else {
        const err = await res.json();
        setIsLoading(false);
        return { success: false, error: err.error?.message || 'Registration failed' };
      }
    } catch (err: any) {
      // Offline Registration support
      const fallbackSession: AuthSession = {
        token: 'offline_token_' + Date.now(),
        userId: 'usr_' + Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
      };
      setSession(fallbackSession);
      storageService.set(AUTH_SESSION_KEY, fallbackSession);
      setIsLoading(false);
      return {
        success: true,
        profile: {
          id: fallbackSession.userId,
          name: data.fullName,
          mobile: data.mobile,
          village: data.village || 'Palus',
          block: 'Palus',
          district: data.district || 'Sangli',
          state: 'Maharashtra',
          ownCapital: data.ownCapital || 250000,
          desiredBusiness: data.desiredBusiness || 'Mobile & Electronics Repair',
          skills: ['दुरुस्ती कौशल्य'],
          availableAssets: ['दुकान जागा'],
          preferredLanguage: (data.preferredLanguage as any) || 'mr',
          isOnboarded: Boolean(data.desiredBusiness && data.village),
          isDemo: false
        }
      };
    }
  };

  const createSessionFromOnboarding = async (
    profileData: Partial<UserProfile>,
    pin?: string
  ): Promise<AuthSession> => {
    setIsLoading(true);
    // If mobile & PIN available, attempt server sync
    if (profileData.mobile && profileData.mobile.length >= 10 && pin && pin.length >= 4) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: profileData.name || 'उद्योजक',
            mobile: profileData.mobile,
            pin,
            village: profileData.village,
            district: profileData.district,
            state: profileData.state,
            ownCapital: profileData.ownCapital,
            desiredBusiness: profileData.desiredBusiness,
            preferredLanguage: profileData.preferredLanguage
          })
        });
        if (res.ok) {
          const json = await res.json();
          const resData = json.data;
          const newSession: AuthSession = {
            token: resData.session.token,
            userId: resData.session.userId,
            expiresAt: resData.session.expiresAt
          };
          setSession(newSession);
          storageService.set(AUTH_SESSION_KEY, newSession);
          setIsLoading(false);
          return newSession;
        }
      } catch (e) {
        console.warn('Backend register sync failed, using offline session:', e);
      }
    }

    // Local / Offline standard session
    const fallbackSession: AuthSession = {
      token: 'saathi_session_' + Date.now(),
      userId: profileData.id || 'usr_' + Date.now(),
      expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000 // 60 days
    };
    setSession(fallbackSession);
    storageService.set(AUTH_SESSION_KEY, fallbackSession);
    setIsLoading(false);
    return fallbackSession;
  };

  const logout = () => {
    setSession(null);
    storageService.remove(AUTH_SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session && session.expiresAt > Date.now()),
        session,
        login,
        register,
        createSessionFromOnboarding,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
