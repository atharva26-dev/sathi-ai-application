import { SupportedLanguage } from '../../config/constants.js';

export type BusinessStage =
  | 'IDEA'
  | 'PRE_STARTUP'
  | 'NEW_BUSINESS'
  | 'OPERATING'
  | 'STRUGGLING'
  | 'STABLE'
  | 'GROWING'
  | 'EXPANDING';

export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERIENCED';

export interface ActiveUserContext {
  userId: string;
  name: string;
  age?: number;
  mobile?: string;
  language: SupportedLanguage;

  businessId: string;
  businessName: string;
  businessCategory: string;
  businessDescription?: string;

  village: string;
  gramPanchayat?: string;
  block: string;
  taluka?: string;
  district: string;
  state: string;
  pincode?: string;

  availableCapital: number;
  projectCost: number;
  loanAmount: number;

  businessStage: BusinessStage;
  experienceLevel: ExperienceLevel;
  experienceYears?: number;
  skills: string[];
  availableAssets: string[];
}

export const createDefaultActiveContext = (
  userId = '00000000-0000-0000-0000-000000000001',
  overrides?: Partial<ActiveUserContext>
): ActiveUserContext => {
  const cap = overrides?.availableCapital || 250000;
  const projCost = overrides?.projectCost || cap * 10;
  const loanAmt = overrides?.loanAmount || projCost * 0.9;

  return {
    userId,
    name: overrides?.name || 'उद्योजक (Entrepreneur)',
    age: overrides?.age || 30,
    mobile: overrides?.mobile || '',
    language: overrides?.language || 'mr',

    businessId: overrides?.businessId || 'biz_mobile_repair',
    businessName: overrides?.businessName || 'Mobile & Electronics Repair',
    businessCategory: overrides?.businessCategory || 'Electronics & Technical Services',
    businessDescription:
      overrides?.businessDescription ||
      'स्मार्टफोन स्क्रीन, बॅटरी, चार्जिंग पोर्ट दुरुस्ती व डिजिटल ॲक्सेसरीज विक्री',

    village: overrides?.village || 'Palus',
    gramPanchayat: overrides?.gramPanchayat || 'Palus Gram Panchayat',
    block: overrides?.block || 'Palus',
    taluka: overrides?.taluka || 'Palus',
    district: overrides?.district || 'Sangli',
    state: overrides?.state || 'Maharashtra',
    pincode: overrides?.pincode || '416310',

    availableCapital: cap,
    projectCost: projCost,
    loanAmount: loanAmt,

    businessStage: overrides?.businessStage || 'PRE_STARTUP',
    experienceLevel: overrides?.experienceLevel || 'BEGINNER',
    experienceYears: overrides?.experienceYears || 1,
    skills: overrides?.skills || ['तांत्रिक काम (Technical Repair)', 'व्यवस्थापन (Management)'],
    availableAssets: overrides?.availableAssets || ['दुकान जागा (Shop Space)', 'स्मार्टफोन (Smartphone)']
  };
};
