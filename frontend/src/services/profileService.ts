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

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_init',
  name: '',
  age: undefined,
  mobile: '',
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
  preferredLanguage: 'en',
  isOnboarded: false,
  isDemo: false
};

export const profileService = {
  getProfile(): UserProfile {
    return storageService.get<UserProfile>(PROFILE_KEY, DEFAULT_PROFILE);
  },

  saveProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated: UserProfile = {
      ...current,
      ...profile,
      id: current.id === 'usr_init' ? 'usr_' + Date.now() : current.id
    };
    storageService.set(PROFILE_KEY, updated);
    return updated;
  },

  loadDemoProfile(): UserProfile {
    storageService.set(PROFILE_KEY, DEMO_PROFILE);
    return DEMO_PROFILE;
  },

  resetProfile(): UserProfile {
    storageService.set(PROFILE_KEY, DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  }
};
