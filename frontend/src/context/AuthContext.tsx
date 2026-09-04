import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { profileService, DEMO_PROFILE } from '../services/profileService';

const AUTH_SESSION_KEY = 'saathi_auth_session';
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

export interface AuthSession {
  token: string;
  userId: string;
  mobile: string;
  expiresAt: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  activeMobile: string | null;
  session: AuthSession | null;
  login: (mobile: string, pin: string) => Promise<{ success: boolean; error?: string; profile?: UserProfile }>;
  register: (data: {
    fullName: string;
    mobile: string;
    pin: string;
    village?: string;
    block?: string;
    district?: string;
    state?: string;
    ownCapital?: number;
    desiredBusiness?: string;
    preferredLanguage?: string;
  }) => Promise<{ success: boolean; error?: string; profile?: UserProfile }>;
  createSessionFromOnboarding: (profileData: Partial<UserProfile>, pin?: string) => Promise<AuthSession>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMobile, setActiveMobile] = useState<string | null>(() => storageService.getActiveUser());

  const [session, setSession] = useState<AuthSession | null>(() => {
    const active = storageService.getActiveUser();
    const saved = storageService.get<AuthSession | null>(AUTH_SESSION_KEY, null);
    if (saved && active && saved.mobile === active && saved.expiresAt > Date.now()) {
      return saved;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync activeMobile when storageService emits user change
  useEffect(() => {
    const handleUserChanged = (e: any) => {
      const mob = e.detail?.mobile || storageService.getActiveUser();
      setActiveMobile(mob);
    };
    window.addEventListener('saathi_active_user_changed', handleUserChanged);
    return () => window.removeEventListener('saathi_active_user_changed', handleUserChanged);
  }, []);

  const login = async (rawMobile: string, pin: string): Promise<{ success: boolean; error?: string; profile?: UserProfile }> => {
    setIsLoading(true);
    const mobile = rawMobile.replace(/\D/g, '').slice(-10);

    if (mobile.length !== 10) {
      setIsLoading(false);
      return { success: false, error: 'कृपया वैध १० अंकी मोबाईल नंबर टाका (Please enter valid 10-digit mobile).' };
    }

    if (!pin || pin.length !== 4) {
      setIsLoading(false);
      return { success: false, error: 'कृपया ४ अंकी सुरक्षा पिन टाका (Please enter 4-digit security PIN).' };
    }

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
          mobile,
          expiresAt: data.session.expiresAt
        };

        // 1. Switch active user in isolated storage
        storageService.setActiveUser(mobile);
        storageService.saveUserCredential(mobile, pin, data.profile?.name);
        storageService.set(AUTH_SESSION_KEY, newSession);
        setSession(newSession);
        setActiveMobile(mobile);

        // 2. Persist backend verified profile to isolated user storage
        let activeProfile = data.profile;
        if (activeProfile) {
          activeProfile = profileService.saveProfile(activeProfile);
        } else {
          activeProfile = profileService.getProfile();
        }

        setIsLoading(false);
        return { success: true, profile: activeProfile };
      } else {
        const err = await res.json();
        setIsLoading(false);
        return {
          success: false,
          error: err.error?.message || 'चुकीचा सुरक्षा पिन. कृपया अचूक ४ अंकी पिन टाका.'
        };
      }
    } catch {
      // --- Offline Authentication Fallback ---
      const localCheck = storageService.verifyLocalPin(mobile, pin);
      if (localCheck.isKnown) {
        if (localCheck.verified) {
          // Validated offline with correct PIN
          storageService.setActiveUser(mobile);
          const fallbackSession: AuthSession = {
            token: 'offline_token_' + Date.now(),
            userId: 'usr_' + mobile,
            mobile,
            expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
          };
          storageService.set(AUTH_SESSION_KEY, fallbackSession);
          setSession(fallbackSession);
          setActiveMobile(mobile);

          const localProfile = profileService.getProfile();
          setIsLoading(false);
          return { success: true, profile: localProfile };
        } else {
          // Known user but wrong PIN!
          setIsLoading(false);
          return {
            success: false,
            error: 'चुकीचा सुरक्षा पिन. कृपया अचूक ४ अंकी पिन टाका (Incorrect 4-digit PIN).'
          };
        }
      }

      // First time offline user registration
      storageService.saveUserCredential(mobile, pin);
      storageService.setActiveUser(mobile);
      const fallbackSession: AuthSession = {
        token: 'offline_token_' + Date.now(),
        userId: 'usr_' + mobile,
        mobile,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
      };
      storageService.set(AUTH_SESSION_KEY, fallbackSession);
      setSession(fallbackSession);
      setActiveMobile(mobile);

      const freshProfile = profileService.getProfile();
      setIsLoading(false);
      return { success: true, profile: freshProfile };
    }
  };

  const register = async (data: {
    fullName: string;
    mobile: string;
    pin: string;
    village?: string;
    block?: string;
    district?: string;
    state?: string;
    ownCapital?: number;
    desiredBusiness?: string;
    preferredLanguage?: string;
  }): Promise<{ success: boolean; error?: string; profile?: UserProfile }> => {
    setIsLoading(true);
    const cleanMobile = data.mobile.replace(/\D/g, '').slice(-10);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          mobile: cleanMobile
        })
      });

      if (res.ok) {
        const json = await res.json();
        const resData = json.data;
        const newSession: AuthSession = {
          token: resData.session.token,
          userId: resData.session.userId,
          mobile: cleanMobile,
          expiresAt: resData.session.expiresAt
        };

        storageService.setActiveUser(cleanMobile);
        storageService.saveUserCredential(cleanMobile, data.pin, data.fullName);
        storageService.set(AUTH_SESSION_KEY, newSession);
        setSession(newSession);
        setActiveMobile(cleanMobile);

        const saved = profileService.saveProfile(resData.profile);
        setIsLoading(false);
        return { success: true, profile: saved };
      } else {
        const err = await res.json();
        setIsLoading(false);
        return { success: false, error: err.error?.message || 'नोंदणी अयशस्वी झाली (Registration failed).' };
      }
    } catch {
      // Offline Registration support
      storageService.saveUserCredential(cleanMobile, data.pin, data.fullName);
      storageService.setActiveUser(cleanMobile);

      const fallbackSession: AuthSession = {
        token: 'offline_token_' + Date.now(),
        userId: 'usr_' + cleanMobile,
        mobile: cleanMobile,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
      };
      storageService.set(AUTH_SESSION_KEY, fallbackSession);
      setSession(fallbackSession);
      setActiveMobile(cleanMobile);

      const saved = profileService.saveProfile({
        name: data.fullName,
        mobile: cleanMobile,
        village: data.village || '',
        block: data.block || '',
        district: data.district || '',
        state: data.state || 'Maharashtra',
        ownCapital: data.ownCapital || 0,
        desiredBusiness: data.desiredBusiness || '',
        preferredLanguage: (data.preferredLanguage as any) || 'mr',
        isOnboarded: Boolean(data.desiredBusiness && data.village),
        isDemo: false
      });

      setIsLoading(false);
      return { success: true, profile: saved };
    }
  };

  const createSessionFromOnboarding = async (
    profileData: Partial<UserProfile>,
    pin?: string
  ): Promise<AuthSession> => {
    setIsLoading(true);
    const mobile = (profileData.mobile || '').replace(/\D/g, '').slice(-10);
    const validPin = pin && pin.length === 4 ? pin : '1234';

    if (mobile && mobile.length === 10) {
      storageService.saveUserCredential(mobile, validPin, profileData.name);
      storageService.setActiveUser(mobile);
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: profileData.name || 'उद्योजक',
            mobile,
            pin: validPin,
            village: profileData.village,
            block: profileData.block,
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
            mobile,
            expiresAt: resData.session.expiresAt
          };
          storageService.set(AUTH_SESSION_KEY, newSession);
          setSession(newSession);
          setActiveMobile(mobile);
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
      userId: profileData.id || (mobile ? 'usr_' + mobile : 'usr_' + Date.now()),
      mobile: mobile || '9822345678',
      expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000
    };
    storageService.setActiveUser(fallbackSession.mobile);
    storageService.set(AUTH_SESSION_KEY, fallbackSession);
    setSession(fallbackSession);
    setActiveMobile(fallbackSession.mobile);
    setIsLoading(false);
    return fallbackSession;
  };

  const logout = () => {
    setSession(null);
    setActiveMobile(null);
    storageService.setActiveUser(null);
    storageService.remove(AUTH_SESSION_KEY);
    profileService.resetProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session && session.expiresAt > Date.now() && activeMobile),
        activeMobile,
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
