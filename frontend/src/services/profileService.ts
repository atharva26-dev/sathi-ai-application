import { UserProfile } from '../types';
import { storageService } from './storageService';

const PROFILE_KEY = 'user_profile';

export const DEMO_PROFILE: UserProfile = {
  id: 'usr_demo_baramati_01',
  name: 'रमेश पाटील (Ramesh Patil)',
  age: 32,
  mobile: '9822345678',
  village: 'सुपे (Supe)',
  block: 'बारामती (Baramati)',
  district: 'पुणे (Pune)',
  state: 'महाराष्ट्र (Maharashtra)',
  ownCapital: 100000,
  desiredBusiness: 'दुग्ध प्रक्रिया व ताजे पनीर उत्पादन (Dairy & Fresh Paneer)',
  experienceYears: 4,
  skills: ['दुग्ध संकलन (Milk Collection)', 'स्थानिक बाजार संबंध (Local Network)', 'वाहतूक (Bike/Van)'],
  availableAssets: ['स्वतःची मोकळी शेड (15x20 ft)', 'बोअरवेल पाणी (Borewell)', 'दुचाकी वाहन (Two-Wheeler)'],
  existingBusiness: 'घरगुती दूध विक्री (Small domestic milk supply)',
  businessGoals: 'दररोज ५० किलो पनीर तयार करून बारामती व दौंड भागातील हॉटेल्सना पुरवणे',
  preferredLanguage: 'mr',
  isOnboarded: true,
  isDemo: true
};

export const createBlankProfile = (mobile = ''): UserProfile => ({
  id: 'usr_' + Date.now(),
  name: '',
  age: undefined,
  mobile: mobile.replace(/\D/g, '').slice(-10),
  village: '',
  block: '',
  district: '',
  state: '',
  ownCapital: 0,
  desiredBusiness: '',
  experienceYears: 0,
  skills: [],
  availableAssets: [],
  existingBusiness: '',
  businessGoals: '',
  preferredLanguage: 'mr',
  isOnboarded: false,
  isDemo: false
});

export const profileService = {
  getProfile(): UserProfile {
    const activeMobile = storageService.getActiveUser();
    const fallback = activeMobile === '9822345678' ? DEMO_PROFILE : createBlankProfile(activeMobile || '');
    const profile = storageService.get<UserProfile>(PROFILE_KEY, fallback);
    if (activeMobile && !profile.mobile) {
      profile.mobile = activeMobile;
    }
    return profile;
  },

  saveProfile(profile: Partial<UserProfile>): UserProfile {
    const activeMobile = storageService.getActiveUser();
    const current = this.getProfile();
    const updated: UserProfile = {
      ...current,
      ...profile,
      mobile: profile.mobile ? profile.mobile.replace(/\D/g, '').slice(-10) : (current.mobile || activeMobile || ''),
      id: current.id === 'usr_init' ? 'usr_' + Date.now() : (current.id || 'usr_' + Date.now())
    };

    // Ensure active user is kept in sync if mobile is present
    if (updated.mobile && updated.mobile.length === 10 && updated.mobile !== activeMobile) {
      storageService.setActiveUser(updated.mobile);
    }

    storageService.set(PROFILE_KEY, updated);
    return updated;
  },

  loadDemoProfile(): UserProfile {
    storageService.setActiveUser('9822345678');
    storageService.set(PROFILE_KEY, DEMO_PROFILE);
    return DEMO_PROFILE;
  },

  resetProfile(): UserProfile {
    const activeMobile = storageService.getActiveUser();
    const blank = createBlankProfile(activeMobile || '');
    storageService.set(PROFILE_KEY, blank);
    return blank;
  }
};
