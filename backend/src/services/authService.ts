import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import { ProfileData, profileService } from './profileService.js';
import crypto from 'crypto';

export interface UserSession {
  token: string;
  userId: string;
  expiresAt: number;
  profile: ProfileData;
}

interface StoredUserCredential {
  userId: string;
  mobile: string;
  pinHash: string;
  salt: string;
  profile: ProfileData;
  createdAt: number;
}

// In-memory token session cache for fast auth resolution
const sessionCache = new Map<string, UserSession>();

// Dedicated isolated user credentials registry (strictly 1 mobile = 1 user with PIN)
const userRegistry = new Map<string, StoredUserCredential>();

// Helper functions for secure salted PIN hashing (PBKDF2 SHA-256)
function hashPin(pin: string, salt: string): string {
  return crypto.pbkdf2Sync(pin, salt, 10000, 32, 'sha256').toString('hex');
}

function verifyPin(pin: string, salt: string, expectedHash: string): boolean {
  try {
    const computed = hashPin(pin, salt);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(expectedHash));
  } catch {
    return false;
  }
}

// Pre-seed Demo User for offline/demo tests
const DEMO_MOBILE = '9822345678';
const DEMO_SALT = 'saathi_demo_salt_2026';
userRegistry.set(DEMO_MOBILE, {
  userId: 'usr_mob_' + DEMO_MOBILE,
  mobile: DEMO_MOBILE,
  pinHash: hashPin('1234', DEMO_SALT),
  salt: DEMO_SALT,
  profile: {
    id: 'usr_mob_' + DEMO_MOBILE,
    fullName: 'रमेश पाटील (Ramesh Patil)',
    mobile: DEMO_MOBILE,
    preferredLanguage: 'mr',
    village: 'सुपे',
    block: 'बारामती',
    district: 'पुणे',
    state: 'Maharashtra',
    ownCapital: 100000,
    desiredBusiness: 'दुग्ध प्रक्रिया व ताजे पनीर उत्पादन',
    skills: ['दुग्ध संकलन', 'स्थानिक बाजार संबंध'],
    availableAssets: ['मोकळी जागा'],
    isOnboarded: true,
    isDemo: true
  },
  createdAt: Date.now()
});

export interface RegisterDto {
  fullName: string;
  mobile: string;
  pin: string;
  preferredLanguage?: string;
  village?: string;
  block?: string;
  district?: string;
  state?: string;
  ownCapital?: number;
  desiredBusiness?: string;
  skills?: string[];
  availableAssets?: string[];
}

export interface LoginDto {
  mobile: string;
  pin: string;
}

export const authService = {
  /**
   * Register a new unique user with 10-digit mobile and 4-digit PIN
   */
  async register(dto: RegisterDto): Promise<{ session: UserSession; profile: ProfileData }> {
    const cleanMobile = dto.mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      throw new Error('वैध १० अंकी मोबाईल नंबर आवश्यक आहे (Valid 10-digit mobile number required)');
    }
    const cleanPin = dto.pin.trim();
    if (cleanPin.length !== 4) {
      throw new Error('४ अंकी सुरक्षा पिन आवश्यक आहे (4-digit security PIN required)');
    }

    const existing = userRegistry.get(cleanMobile);
    if (existing) {
      // Check if existing user is verifying their PIN
      if (verifyPin(cleanPin, existing.salt, existing.pinHash)) {
        // Return active session with their existing isolated profile
        const token = 'stk_' + crypto.randomBytes(24).toString('hex');
        const session: UserSession = {
          token,
          userId: existing.userId,
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
          profile: existing.profile
        };
        sessionCache.set(token, session);
        return { session, profile: existing.profile };
      }
      throw new Error('हा मोबाईल नंबर आधीच नोंदणीकृत आहे. कृपया अचूक पिनने लॉगिन करा. (This mobile number is already registered. Please login with correct PIN.)');
    }

    const userId = 'usr_mob_' + cleanMobile;
    const token = 'stk_' + crypto.randomBytes(24).toString('hex');
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    const salt = crypto.randomBytes(16).toString('hex');
    const pinHash = hashPin(cleanPin, salt);

    const profile: ProfileData = {
      id: userId,
      fullName: dto.fullName,
      mobile: cleanMobile,
      preferredLanguage: dto.preferredLanguage || 'mr',
      village: dto.village || '',
      block: dto.block || '',
      district: dto.district || '',
      state: dto.state || '',
      ownCapital: dto.ownCapital || 250000,
      desiredBusiness: dto.desiredBusiness || 'Mobile & Electronics Repair',
      skills: dto.skills || ['स्थानिक संपर्क', 'दुरुस्ती कौशल्य'],
      availableAssets: dto.availableAssets || ['जागा'],
      isOnboarded: Boolean(dto.desiredBusiness && dto.village),
      isDemo: false
    };

    // Store in isolated in-memory user registry
    userRegistry.set(cleanMobile, {
      userId,
      mobile: cleanMobile,
      pinHash,
      salt,
      profile,
      createdAt: Date.now()
    });

    // Store in Supabase if live
    try {
      if (process.env.NODE_ENV !== 'test') {
        await supabaseAdmin.from('profiles').upsert({
          id: userId,
          full_name: dto.fullName,
          preferred_language: dto.preferredLanguage || 'mr',
          is_onboarded: profile.isOnboarded,
          is_demo: false
        });
      }
    } catch (err: any) {
      logger.warn('Supabase profile insertion note (offline fallback active):', err.message);
    }

    const session: UserSession = {
      token,
      userId,
      expiresAt,
      profile
    };

    sessionCache.set(token, session);

    return { session, profile };
  },

  /**
   * Login with 10-digit mobile and mandatory 4-digit PIN verification.
   * Strictly verifies PIN. First-time users are registered with their provided PIN.
   */
  async login(dto: LoginDto): Promise<{ session: UserSession; profile: ProfileData } | null> {
    const cleanMobile = dto.mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      throw new Error('वैध १० अंकी मोबाईल नंबर आवश्यक आहे (Valid 10-digit mobile number required)');
    }
    const cleanPin = dto.pin ? dto.pin.trim() : '';
    if (cleanPin.length !== 4) {
      throw new Error('४ अंकी सुरक्षा पिन आवश्यक आहे (4-digit security PIN required)');
    }

    const user = userRegistry.get(cleanMobile);

    if (user) {
      // User exists: verify PIN strictly
      const isPinCorrect = verifyPin(cleanPin, user.salt, user.pinHash);
      if (!isPinCorrect) {
        throw new Error('चुकीचा सुरक्षा पिन. कृपया अचूक ४ अंकी पिन टाका. (Incorrect Security PIN. Please enter correct 4-digit PIN.)');
      }

      const newToken = 'stk_' + crypto.randomBytes(24).toString('hex');
      const session: UserSession = {
        token: newToken,
        userId: user.userId,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        profile: user.profile
      };
      sessionCache.set(newToken, session);
      return { session, profile: user.profile };
    }

    // User does not exist yet: First-time login mandatory registration
    const userId = 'usr_mob_' + cleanMobile;
    const token = 'stk_' + crypto.randomBytes(24).toString('hex');
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const salt = crypto.randomBytes(16).toString('hex');
    const pinHash = hashPin(cleanPin, salt);

    const newProfile: ProfileData = {
      id: userId,
      fullName: 'उद्योजक (Entrepreneur)',
      mobile: cleanMobile,
      preferredLanguage: 'mr',
      village: '',
      block: '',
      district: '',
      state: '',
      ownCapital: 50000,
      desiredBusiness: '',
      skills: [],
      availableAssets: [],
      isOnboarded: false,
      isDemo: false
    };

    userRegistry.set(cleanMobile, {
      userId,
      mobile: cleanMobile,
      pinHash,
      salt,
      profile: newProfile,
      createdAt: Date.now()
    });

    const session: UserSession = {
      token,
      userId,
      expiresAt,
      profile: newProfile
    };

    sessionCache.set(token, session);
    return { session, profile: newProfile };
  },

  /**
   * Updates profile data for a specific user in registry and active sessions
   */
  updateUserProfile(userIdOrMobile: string, partial: Partial<ProfileData>): ProfileData | null {
    const cleanMobile = userIdOrMobile.replace(/\D/g, '').slice(-10);
    const user = userRegistry.get(cleanMobile) || Array.from(userRegistry.values()).find((u) => u.userId === userIdOrMobile);
    if (!user) return null;

    user.profile = {
      ...user.profile,
      ...partial
    };

    // Also update any active sessions for this user
    for (const session of sessionCache.values()) {
      if (session.userId === user.userId) {
        session.profile = user.profile;
      }
    }

    return user.profile;
  },

  /**
   * Get user profile by clean mobile or userId
   */
  getUserProfile(userIdOrMobile: string): ProfileData | null {
    const cleanMobile = userIdOrMobile.replace(/\D/g, '').slice(-10);
    const user = userRegistry.get(cleanMobile) || Array.from(userRegistry.values()).find((u) => u.userId === userIdOrMobile);
    return user ? user.profile : null;
  },

  /**
   * Validate bearer token and return active session
   */
  validateToken(token: string): UserSession | null {
    if (!token) return null;
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const session = sessionCache.get(cleanToken);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      sessionCache.delete(cleanToken);
      return null;
    }
    return session;
  },

  /**
   * Clear session cache (useful for tests)
   */
  clearAllSessions(): void {
    sessionCache.clear();
  }
};
