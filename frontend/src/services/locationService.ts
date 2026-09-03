import { storageService } from './storageService';
import {
  ALL_INDIA_STATES,
  ALL_INDIA_DISTRICTS,
  ALL_INDIA_SUBDISTRICTS,
  ALL_INDIA_VILLAGES
} from '../data/allIndiaLocations';

export interface LocationState {
  code: number;
  name: string;
  category?: 'State' | 'Union Territory';
  nameNative: {
    mr: string;
    hi: string;
    en: string;
  };
}

export interface LocationDistrict {
  code: number;
  stateCode: number;
  name: string;
  nameNative: {
    mr: string;
    hi: string;
    en: string;
  };
}

export interface LocationSubDistrict {
  code: number;
  districtCode: number;
  name: string;
  nameNative: {
    mr: string;
    hi: string;
    en: string;
  };
}

export interface LocationVillage {
  code: number;
  subDistrictCode: number;
  name: string;
  nameNative: {
    mr: string;
    hi: string;
    en: string;
  };
  pincode: string;
  latitude?: number;
  longitude?: number;
}

const API_BASE = '/api/v1/location';

// Baseline fallback states in case user is completely offline during first render
const FALLBACK_STATES: LocationState[] = ALL_INDIA_STATES;

// Offline verified fallback districts covering all 28 states and 8 union territories
const FALLBACK_DISTRICTS: LocationDistrict[] = ALL_INDIA_DISTRICTS;

// Offline verified fallback subdistricts (talukas / tehsils / mandals / blocks)
const FALLBACK_SUBDISTRICTS: LocationSubDistrict[] = ALL_INDIA_SUBDISTRICTS;

// Offline verified fallback villages with authentic PIN codes
const FALLBACK_VILLAGES: LocationVillage[] = ALL_INDIA_VILLAGES;

export const getSubDistrictLabel = (
  stateCode: number,
  lang: 'mr' | 'hi' | 'en'
): { labelEn: string; labelNative: string; placeholder: string } => {
  // 1. Maharashtra, Gujarat, Goa -> Taluka
  if (stateCode === 27 || stateCode === 24 || stateCode === 30) {
    return {
      labelEn: 'Taluka',
      labelNative: lang === 'mr' ? 'तालुका' : lang === 'hi' ? 'तालुका' : 'Taluka',
      placeholder: lang === 'mr' ? 'तालुका निवडा किंवा शोधा' : lang === 'hi' ? 'तालुका चुनें या खोजें' : 'Select or search Taluka'
    };
  }

  // 2. Andhra Pradesh, Telangana -> Mandal
  if (stateCode === 28 || stateCode === 36) {
    return {
      labelEn: 'Mandal',
      labelNative: lang === 'mr' ? 'मंडल' : lang === 'hi' ? 'मंडल' : 'Mandal',
      placeholder: lang === 'mr' ? 'मंडल निवडा किंवा शोधा' : lang === 'hi' ? 'मंडल चुनें या खोजें' : 'Select or search Mandal'
    };
  }

  // 3. Tamil Nadu, Karnataka, Kerala -> Taluk
  if (stateCode === 33 || stateCode === 29 || stateCode === 32) {
    return {
      labelEn: 'Taluk',
      labelNative: lang === 'mr' ? 'तालुक' : lang === 'hi' ? 'तालुक' : 'Taluk',
      placeholder: lang === 'mr' ? 'तालुक निवडा किंवा शोधा' : lang === 'hi' ? 'तालुक चुनें या खोजें' : 'Select or search Taluk'
    };
  }

  // 4. Bihar, Jharkhand, West Bengal, Odisha, Assam -> Block
  if (stateCode === 10 || stateCode === 20 || stateCode === 19 || stateCode === 21 || stateCode === 18) {
    return {
      labelEn: 'Block',
      labelNative: lang === 'mr' ? 'प्रखंड / ब्लॉक' : lang === 'hi' ? 'प्रखंड / ब्लॉक' : 'Block',
      placeholder: lang === 'mr' ? 'प्रखंड निवडा किंवा शोधा' : lang === 'hi' ? 'प्रखंड चुनें या खोजें' : 'Select or search Block'
    };
  }

  // 5. Rajasthan, Uttar Pradesh, MP, Haryana, Punjab, HP, UK, Delhi, J&K -> Tehsil
  return {
    labelEn: 'Tehsil',
    labelNative: lang === 'mr' ? 'तहसील' : lang === 'hi' ? 'तहसील' : 'Tehsil',
    placeholder: lang === 'mr' ? 'तहसील निवडा किंवा शोधा' : lang === 'hi' ? 'तहसील चुनें या खोजें' : 'Select or search Tehsil'
  };
};

export const locationService = {
  /**
   * Fetch all 36 Indian States and UTs
   */
  async getStates(): Promise<LocationState[]> {
    const cacheKey = 'saathi_cache_states';
    try {
      const res = await fetch(`${API_BASE}/states`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          storageService.set(cacheKey, json.data);
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Network fetch states failed, using offline cache:', err);
    }

    const cached = storageService.get<LocationState[] | null>(cacheKey, null);
    return cached && cached.length > 0 ? cached : FALLBACK_STATES;
  },

  /**
   * Fetch districts for selected State code
   */
  async getDistricts(stateCode: number): Promise<LocationDistrict[]> {
    const cacheKey = `saathi_cache_districts_${stateCode}`;
    try {
      const res = await fetch(`${API_BASE}/districts?stateCode=${stateCode}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          storageService.set(cacheKey, json.data);
          return json.data;
        }
      }
    } catch (err) {
      console.warn(`Network fetch districts for state ${stateCode} failed:`, err);
    }

    const cached = storageService.get<LocationDistrict[] | null>(cacheKey, null);
    if (cached && cached.length > 0) return cached;
    return FALLBACK_DISTRICTS.filter((d) => d.stateCode === stateCode);
  },

  /**
   * Fetch sub-districts (Taluka/Tehsil/Mandal/Block) for selected District code
   */
  async getSubDistricts(districtCode: number): Promise<LocationSubDistrict[]> {
    const cacheKey = `saathi_cache_subdistricts_${districtCode}`;
    try {
      const res = await fetch(`${API_BASE}/subdistricts?districtCode=${districtCode}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          storageService.set(cacheKey, json.data);
          return json.data;
        }
      }
    } catch (err) {
      console.warn(`Network fetch subdistricts for district ${districtCode} failed:`, err);
    }

    const cached = storageService.get<LocationSubDistrict[] | null>(cacheKey, null);
    if (cached && cached.length > 0) return cached;
    return FALLBACK_SUBDISTRICTS.filter((sd) => sd.districtCode === districtCode);
  },

  /**
   * Fetch villages for selected sub-district with optional text search filter
   */
  async getVillages(subDistrictCode: number, query?: string): Promise<LocationVillage[]> {
    const qParam = query ? `&q=${encodeURIComponent(query)}` : '';
    const cacheKey = `saathi_cache_villages_${subDistrictCode}`;
    try {
      const res = await fetch(`${API_BASE}/villages?subdistrictCode=${subDistrictCode}${qParam}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          if (!query) {
            storageService.set(cacheKey, json.data);
          }
          return json.data;
        }
      }
    } catch (err) {
      console.warn(`Network fetch villages for subdistrict ${subDistrictCode} failed:`, err);
    }

    const cached = storageService.get<LocationVillage[] | null>(cacheKey, null);
    const list = cached && cached.length > 0 ? cached : FALLBACK_VILLAGES.filter((v) => v.subDistrictCode === subDistrictCode);
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      return list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.nameNative.mr.toLowerCase().includes(q) ||
          v.nameNative.hi.toLowerCase().includes(q) ||
          v.pincode.includes(q)
      );
    }
    return list;
  }
};
