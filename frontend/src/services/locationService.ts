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

export interface DistrictDataChunk {
  state: string;
  district: string;
  subdistricts: Record<string, string[]>;
  pincodes: Record<string, string>;
}

export const slugifyLocation = (text: string): string => {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

export const getSubDistrictLabel = (
  stateCodeOrName: number | string,
  lang: 'mr' | 'hi' | 'en'
): { labelEn: string; labelNative: string; placeholder: string } => {
  const str = String(stateCodeOrName).toLowerCase();

  // 1. Maharashtra, Gujarat, Goa -> Taluka
  if (str === '27' || str === '24' || str === '30' || str.includes('maharashtra') || str.includes('gujarat') || str.includes('goa')) {
    return {
      labelEn: 'Taluka',
      labelNative: lang === 'mr' ? 'तालुका' : lang === 'hi' ? 'तालुका' : 'Taluka',
      placeholder: lang === 'mr' ? 'तालुका निवडा किंवा शोधा' : lang === 'hi' ? 'तालुका चुनें या खोजें' : 'Select or search Taluka'
    };
  }

  // 2. Andhra Pradesh, Telangana -> Mandal
  if (str === '28' || str === '36' || str.includes('andhra') || str.includes('telangana')) {
    return {
      labelEn: 'Mandal',
      labelNative: lang === 'mr' ? 'मंडल' : lang === 'hi' ? 'मंडल' : 'Mandal',
      placeholder: lang === 'mr' ? 'मंडल निवडा किंवा शोधा' : lang === 'hi' ? 'मंडल चुनें या खोजें' : 'Select or search Mandal'
    };
  }

  // 3. Tamil Nadu, Karnataka, Kerala -> Taluk
  if (str === '33' || str === '29' || str === '32' || str.includes('tamil') || str.includes('karnataka') || str.includes('kerala')) {
    return {
      labelEn: 'Taluk',
      labelNative: lang === 'mr' ? 'तालुक' : lang === 'hi' ? 'तालुक' : 'Taluk',
      placeholder: lang === 'mr' ? 'तालुक निवडा किंवा शोधा' : lang === 'hi' ? 'तालुक चुनें या खोजें' : 'Select or search Taluk'
    };
  }

  // 4. Bihar, Jharkhand, West Bengal, Odisha, Assam -> Block
  if (
    str === '10' || str === '20' || str === '19' || str === '21' || str === '18' ||
    str.includes('bihar') || str.includes('jharkhand') || str.includes('bengal') || str.includes('odisha') || str.includes('assam')
  ) {
    return {
      labelEn: 'Block',
      labelNative: lang === 'mr' ? 'प्रखंड / ब्लॉक' : lang === 'hi' ? 'प्रखंड / ब्लॉक' : 'Block',
      placeholder: lang === 'mr' ? 'प्रखंड निवडा किंवा शोधा' : lang === 'hi' ? 'प्रखंड चुनें या खोजें' : 'Select or search Block'
    };
  }

  // 5. Default: Tehsil
  return {
    labelEn: 'Tehsil',
    labelNative: lang === 'mr' ? 'तहसील' : lang === 'hi' ? 'तहसील' : 'Tehsil',
    placeholder: lang === 'mr' ? 'तहसील निवडा किंवा शोधा' : lang === 'hi' ? 'तहसील चुनें या खोजें' : 'Select or search Tehsil'
  };
};

// In-memory caches
let cachedStates: LocationState[] | null = null;
let cachedDistrictsMap: Record<string, string[]> | null = null;
const cachedDistrictChunks: Record<string, DistrictDataChunk> = {};

export const locationService = {
  /**
   * Fetch all States and UTs from LGD hierarchy
   */
  async getStates(): Promise<LocationState[]> {
    if (cachedStates && cachedStates.length > 0) {
      return cachedStates;
    }

    try {
      const res = await fetch('/data/locations/states.json');
      if (res.ok) {
        const list: Array<{ id: string; name: string }> = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          cachedStates = list.map((st, idx) => {
            const fallback = ALL_INDIA_STATES.find(
              (f) => f.name.toLowerCase() === st.name.toLowerCase()
            );
            return {
              code: fallback ? fallback.code : idx + 1,
              name: st.name,
              category: fallback ? fallback.category : 'State',
              nameNative: fallback ? fallback.nameNative : { mr: st.name, hi: st.name, en: st.name }
            };
          });
          return cachedStates;
        }
      }
    } catch (err) {
      console.warn('Could not load /data/locations/states.json, using fallback:', err);
    }

    cachedStates = ALL_INDIA_STATES;
    return cachedStates;
  },

  /**
   * Fetch districts map from LGD hierarchy
   */
  async getDistrictsMap(): Promise<Record<string, string[]>> {
    if (cachedDistrictsMap) {
      return cachedDistrictsMap;
    }

    try {
      const res = await fetch('/data/locations/districts.json');
      if (res.ok) {
        cachedDistrictsMap = await res.json();
        return cachedDistrictsMap || {};
      }
    } catch (err) {
      console.warn('Could not load /data/locations/districts.json:', err);
    }

    // Build fallback map from ALL_INDIA_DISTRICTS
    const map: Record<string, string[]> = {};
    ALL_INDIA_STATES.forEach((st) => {
      const dists = ALL_INDIA_DISTRICTS.filter((d) => d.stateCode === st.code).map((d) => d.name);
      map[st.name] = dists;
    });
    cachedDistrictsMap = map;
    return cachedDistrictsMap;
  },

  /**
   * Fetch districts for a given State name or code
   */
  async getDistricts(stateCodeOrName: number | string): Promise<LocationDistrict[]> {
    const states = await this.getStates();
    let stateName = '';
    let stateCode = 27;

    if (typeof stateCodeOrName === 'number') {
      const found = states.find((s) => s.code === stateCodeOrName);
      if (found) {
        stateName = found.name;
        stateCode = found.code;
      }
    } else {
      stateName = String(stateCodeOrName);
      const found = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
      if (found) {
        stateCode = found.code;
        stateName = found.name;
      }
    }

    const distMap = await this.getDistrictsMap();
    const matchingKey = Object.keys(distMap).find(
      (k) => k.toLowerCase() === stateName.toLowerCase()
    );

    const distNames = matchingKey ? distMap[matchingKey] || [] : [];
    if (distNames.length > 0) {
      return distNames.map((dName, idx) => {
        const fb = ALL_INDIA_DISTRICTS.find(
          (d) => d.stateCode === stateCode && d.name.toLowerCase() === dName.toLowerCase()
        );
        return {
          code: fb ? fb.code : stateCode * 1000 + idx,
          stateCode,
          name: dName,
          nameNative: fb ? fb.nameNative : { mr: dName, hi: dName, en: dName }
        };
      });
    }

    return ALL_INDIA_DISTRICTS.filter((d) => d.stateCode === stateCode);
  },

  /**
   * Load the partitioned district chunk containing subdistricts, villages, and PIN codes
   */
  async getDistrictDetails(stateName: string, districtName: string): Promise<DistrictDataChunk | null> {
    const key = `${slugifyLocation(stateName)}_${slugifyLocation(districtName)}`;
    if (cachedDistrictChunks[key]) {
      return cachedDistrictChunks[key];
    }

    try {
      const res = await fetch(`/data/locations/districts/${key}.json`);
      if (res.ok) {
        const chunk: DistrictDataChunk = await res.json();
        cachedDistrictChunks[key] = chunk;
        return chunk;
      }
    } catch (err) {
      console.warn(`Could not load district chunk for ${key}:`, err);
    }

    return null;
  },

  /**
   * Fetch sub-districts (Talukas / Tehsils / Mandals / Blocks) for selected District
   */
  async getSubDistricts(
    districtCodeOrName: number | string,
    stateName?: string
  ): Promise<LocationSubDistrict[]> {
    let dName = String(districtCodeOrName);
    let sName = stateName || '';

    // If district is a numeric code, find its name
    if (typeof districtCodeOrName === 'number') {
      const fb = ALL_INDIA_DISTRICTS.find((d) => d.code === districtCodeOrName);
      if (fb) {
        dName = fb.name;
        if (!sName) {
          const st = ALL_INDIA_STATES.find((s) => s.code === fb.stateCode);
          if (st) sName = st.name;
        }
      }
    }

    if (!sName) {
      sName = 'Maharashtra'; // Default fallback
    }

    const chunk = await this.getDistrictDetails(sName, dName);
    if (chunk && chunk.subdistricts) {
      const sdNames = Object.keys(chunk.subdistricts).sort();
      const distCode = typeof districtCodeOrName === 'number' ? districtCodeOrName : 504;
      return sdNames.map((name, idx) => {
        const fb = ALL_INDIA_SUBDISTRICTS.find(
          (sd) => sd.districtCode === distCode && sd.name.toLowerCase() === name.toLowerCase()
        );
        return {
          code: fb ? fb.code : distCode * 100 + idx,
          districtCode: distCode,
          name,
          nameNative: fb ? fb.nameNative : { mr: name, hi: name, en: name }
        };
      });
    }

    const distCode = typeof districtCodeOrName === 'number' ? districtCodeOrName : 504;
    return ALL_INDIA_SUBDISTRICTS.filter((sd) => sd.districtCode === distCode);
  },

  /**
   * Fetch villages for selected sub-district with optional query search
   */
  async getVillages(
    subDistrictCodeOrName: number | string,
    query?: string,
    stateName?: string,
    districtName?: string
  ): Promise<LocationVillage[]> {
    let sdName = String(subDistrictCodeOrName);
    const sName = stateName || 'Maharashtra';
    const dName = districtName || 'Sangli';

    // If subdistrict is a numeric code, resolve name from fallback
    if (typeof subDistrictCodeOrName === 'number') {
      const fb = ALL_INDIA_SUBDISTRICTS.find((sd) => sd.code === subDistrictCodeOrName);
      if (fb) {
        sdName = fb.name;
      }
    }

    const chunk = await this.getDistrictDetails(sName, dName);
    if (chunk && chunk.subdistricts) {
      // Find subdistrict matching
      const matchingSdKey = Object.keys(chunk.subdistricts).find(
        (k) => k.toLowerCase() === sdName.toLowerCase()
      );

      const vList = matchingSdKey ? chunk.subdistricts[matchingSdKey] || [] : [];
      const pincodes = chunk.pincodes || {};
      const sdCode = typeof subDistrictCodeOrName === 'number' ? subDistrictCodeOrName : 4210;

      let result: LocationVillage[] = vList.map((vName, idx) => {
        const pin = pincodes[vName] || '';
        const fb = ALL_INDIA_VILLAGES.find((fv) => fv.name.toLowerCase() === vName.toLowerCase());
        return {
          code: fb ? fb.code : sdCode * 1000 + idx,
          subDistrictCode: sdCode,
          name: vName,
          nameNative: fb ? fb.nameNative : { mr: vName, hi: vName, en: vName },
          pincode: pin || (fb ? fb.pincode : '')
        };
      });

      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        result = result.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.nameNative.mr.toLowerCase().includes(q) ||
            v.nameNative.hi.toLowerCase().includes(q) ||
            v.pincode.includes(q)
        );
      }

      return result;
    }

    const sdCode = typeof subDistrictCodeOrName === 'number' ? subDistrictCodeOrName : 4210;
    return ALL_INDIA_VILLAGES.filter((v) => v.subDistrictCode === sdCode);
  },

  // Direct Hierarchy helper functions for direct cascading selectors
  async getHierarchyStates(): Promise<string[]> {
    const states = await this.getStates();
    return states.map((s) => s.name);
  },

  async getHierarchyDistricts(stateName: string): Promise<string[]> {
    const distMap = await this.getDistrictsMap();
    const key = Object.keys(distMap).find((k) => k.toLowerCase() === stateName.toLowerCase());
    return key ? distMap[key] || [] : [];
  },

  async getHierarchySubDistricts(stateName: string, districtName: string): Promise<string[]> {
    const chunk = await this.getDistrictDetails(stateName, districtName);
    return chunk && chunk.subdistricts ? Object.keys(chunk.subdistricts).sort() : [];
  },

  async getHierarchyVillages(
    stateName: string,
    districtName: string,
    subDistrictName: string
  ): Promise<Array<{ name: string; pincode: string }>> {
    const chunk = await this.getDistrictDetails(stateName, districtName);
    if (!chunk || !chunk.subdistricts) return [];

    const key = Object.keys(chunk.subdistricts).find(
      (k) => k.toLowerCase() === subDistrictName.toLowerCase()
    );
    if (!key) return [];

    const vils = chunk.subdistricts[key] || [];
    const pins = chunk.pincodes || {};
    return vils.map((v) => ({
      name: v,
      pincode: pins[v] || ''
    }));
  }
};
