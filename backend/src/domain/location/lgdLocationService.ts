import { LocationHierarchy } from '../../types/market.js';
import { ALL_INDIA_STATES_AND_UTS, indiaGeographicMaster, LocationResolutionResult } from './indiaGeographicMaster.js';

export interface LgdState {
  code: number;
  name: string;
  nameNative: { mr: string; hi: string; en: string };
}

export interface LgdDistrict {
  code: number;
  stateCode: number;
  name: string;
  nameNative: { mr: string; hi: string; en: string };
}

export interface LgdSubDistrict {
  code: number;
  districtCode: number;
  name: string;
  nameNative: { mr: string; hi: string; en: string };
}

export interface LgdVillage {
  code: number;
  subDistrictCode: number;
  name: string;
  nameNative: { mr: string; hi: string; en: string };
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export const LGD_STATES: LgdState[] = ALL_INDIA_STATES_AND_UTS.map((s) => ({
  code: s.lgdCode,
  name: s.canonicalName,
  nameNative: {
    mr: s.nameNative.mr,
    hi: s.nameNative.hi,
    en: s.nameNative.en
  }
}));

import {
  ALL_INDIA_DISTRICTS,
  ALL_INDIA_SUBDISTRICTS,
  ALL_INDIA_VILLAGES
} from './allIndiaLocationsData.js';

export const LGD_DISTRICTS: LgdDistrict[] = ALL_INDIA_DISTRICTS;
export const LGD_SUBDISTRICTS: LgdSubDistrict[] = ALL_INDIA_SUBDISTRICTS;
export const LGD_VILLAGES: LgdVillage[] = ALL_INDIA_VILLAGES;


const STATE_ALIASES: Record<string, number> = {
  mh: 27,
  maha: 27,
  maharashtra: 27,
  tn: 33,
  tamilnadu: 33,
  'tamil nadu': 33,
  ap: 28,
  'andhra pradesh': 28,
  andhra: 28,
  rj: 8,
  rajasthan: 8,
  raj: 8,
  br: 10,
  bihar: 10,
  bih: 10,
  gj: 24,
  gujarat: 24,
  guj: 24,
  ka: 29,
  karnataka: 29,
  kar: 29,
  pb: 3,
  punjab: 3,
  hr: 6,
  haryana: 6,
  up: 9,
  'uttar pradesh': 9,
  as: 18,
  assam: 18,
  wb: 19,
  'west bengal': 19,
  bengal: 19,
  kl: 32,
  kerala: 32,
  ts: 36,
  telangana: 36,
  mp: 23,
  'madhya pradesh': 23
};

export class LgdLocationService {
  public resolveStateCode(stateIdentifier?: string | number): number | undefined {
    if (!stateIdentifier) return undefined;
    if (typeof stateIdentifier === 'number') return stateIdentifier;
    const parsed = parseInt(stateIdentifier, 10);
    if (!isNaN(parsed)) return parsed;
    const q = stateIdentifier.toLowerCase().trim();
    if (STATE_ALIASES[q]) return STATE_ALIASES[q];
    const match = LGD_STATES.find(
      (s) =>
        s.name.toLowerCase() === q ||
        s.nameNative.mr.toLowerCase() === q ||
        s.nameNative.hi.toLowerCase() === q ||
        s.name.toLowerCase().includes(q) ||
        q.includes(s.name.toLowerCase())
    );
    return match?.code;
  }

  public resolveDistrictCode(districtIdentifier?: string | number): number | undefined {
    if (!districtIdentifier) return undefined;
    if (typeof districtIdentifier === 'number') return districtIdentifier;
    const parsed = parseInt(districtIdentifier, 10);
    if (!isNaN(parsed)) return parsed;
    const q = districtIdentifier.toLowerCase().trim();
    const match = LGD_DISTRICTS.find(
      (d) =>
        d.name.toLowerCase() === q ||
        d.nameNative.mr.toLowerCase() === q ||
        d.nameNative.hi.toLowerCase() === q ||
        d.name.toLowerCase().includes(q) ||
        q.includes(d.name.toLowerCase())
    );
    return match?.code;
  }

  public resolveSubDistrictCode(subdistrictIdentifier?: string | number): number | undefined {
    if (!subdistrictIdentifier) return undefined;
    if (typeof subdistrictIdentifier === 'number') return subdistrictIdentifier;
    const parsed = parseInt(subdistrictIdentifier, 10);
    if (!isNaN(parsed)) return parsed;
    const q = subdistrictIdentifier.toLowerCase().trim();
    const match = LGD_SUBDISTRICTS.find(
      (sd) =>
        sd.name.toLowerCase() === q ||
        sd.nameNative.mr.toLowerCase() === q ||
        sd.nameNative.hi.toLowerCase() === q ||
        sd.name.toLowerCase().includes(q) ||
        q.includes(sd.name.toLowerCase())
    );
    return match?.code;
  }

  public getSubdistrictLabel(stateCode?: number, stateName?: string): string {
    const sName = (stateName || '').toLowerCase();
    const code = stateCode || this.resolveStateCode(stateName);
    if (code === 28 || code === 36 || sName.includes('andhra') || sName.includes('telangana')) {
      return 'Mandal';
    }
    if (
      code === 33 ||
      code === 32 ||
      code === 29 ||
      sName.includes('tamil') ||
      sName.includes('kerala') ||
      sName.includes('karnataka')
    ) {
      return 'Taluk';
    }
    if (
      code === 10 ||
      code === 20 ||
      code === 21 ||
      code === 19 ||
      sName.includes('bihar') ||
      sName.includes('jharkhand') ||
      sName.includes('odisha') ||
      sName.includes('bengal')
    ) {
      return 'Block';
    }
    if (
      code === 8 ||
      code === 9 ||
      code === 23 ||
      code === 6 ||
      code === 3 ||
      code === 2 ||
      code === 5 ||
      sName.includes('rajasthan') ||
      sName.includes('uttar pradesh') ||
      sName.includes('madhya') ||
      sName.includes('haryana') ||
      sName.includes('punjab') ||
      sName.includes('delhi')
    ) {
      return 'Tehsil';
    }
    return 'Taluka'; // Maharashtra, Gujarat, Goa, and pan-India standard
  }

  public resolveCanonicalLocation(params: {
    state?: string | number;
    district?: string | number;
    subdistrict?: string | number;
    village?: string | number;
  }): {
    country: string;
    state_id: number;
    state_name: string;
    district_id: number;
    district_name: string;
    subdistrict_id: number;
    subdistrict_name: string;
    subdistrict_label: string;
    village_id?: number;
    village_name: string;
    lgd_code?: number;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  } {
    // 1. Resolve State
    let stateCode = this.resolveStateCode(params.state);
    let stateObj = LGD_STATES.find((s) => s.code === stateCode);
    if (!stateObj && params.district) {
      const distCode = this.resolveDistrictCode(params.district);
      const dist = LGD_DISTRICTS.find((d) => d.code === distCode);
      if (dist) {
        stateCode = dist.stateCode;
        stateObj = LGD_STATES.find((s) => s.code === stateCode);
      }
    }
    if (!stateObj && params.subdistrict) {
      const sdCode = this.resolveSubDistrictCode(params.subdistrict);
      const sd = LGD_SUBDISTRICTS.find((s) => s.code === sdCode);
      if (sd) {
        const dist = LGD_DISTRICTS.find((d) => d.code === sd.districtCode);
        if (dist) {
          stateCode = dist.stateCode;
          stateObj = LGD_STATES.find((s) => s.code === stateCode);
        }
      }
    }
    if (!stateObj) {
      stateObj = LGD_STATES.find((s) => s.code === 27) || LGD_STATES[0];
      stateCode = stateObj.code;
    }

    // 2. Resolve District
    let districtCode = this.resolveDistrictCode(params.district);
    let distObj = LGD_DISTRICTS.find((d) => d.code === districtCode);
    if (!distObj && params.subdistrict) {
      const sdCode = this.resolveSubDistrictCode(params.subdistrict);
      const sd = LGD_SUBDISTRICTS.find((s) => s.code === sdCode);
      if (sd) {
        distObj = LGD_DISTRICTS.find((d) => d.code === sd.districtCode);
        districtCode = distObj?.code;
      }
    }
    if (!distObj && stateCode) {
      distObj = LGD_DISTRICTS.find((d) => d.stateCode === stateCode);
      districtCode = distObj?.code;
    }

    // 3. Resolve SubDistrict
    let subdistrictCode = this.resolveSubDistrictCode(params.subdistrict);
    let sdObj = LGD_SUBDISTRICTS.find((sd) => sd.code === subdistrictCode);
    if (!sdObj && districtCode) {
      sdObj = LGD_SUBDISTRICTS.find((sd) => sd.districtCode === districtCode);
      subdistrictCode = sdObj?.code;
    }

    // 4. Resolve Village
    let villageObj: LgdVillage | undefined;
    if (params.village) {
      const vQuery = String(params.village).toLowerCase().trim();
      const vCandidates = this.getVillages(subdistrictCode);
      villageObj = vCandidates.find(
        (v) =>
          v.name.toLowerCase() === vQuery ||
          v.nameNative.mr === vQuery ||
          v.nameNative.hi === vQuery ||
          String(v.code) === vQuery ||
          v.name.toLowerCase().includes(vQuery)
      );
    }
    if (!villageObj && subdistrictCode) {
      const vCandidates = this.getVillages(subdistrictCode);
      villageObj = vCandidates[0];
    }

    const subdistrictLabel = this.getSubdistrictLabel(stateCode, stateObj.name);

    return {
      country: 'India',
      state_id: stateCode || 27,
      state_name: stateObj.name,
      district_id: districtCode || (distObj ? distObj.code : 504),
      district_name: distObj ? distObj.name : params.district ? String(params.district) : 'Sangli',
      subdistrict_id: subdistrictCode || (sdObj ? sdObj.code : 4210),
      subdistrict_name: sdObj ? sdObj.name : params.subdistrict ? String(params.subdistrict) : 'Palus',
      subdistrict_label: subdistrictLabel,
      village_id: villageObj ? villageObj.code : params.village ? undefined : 568320,
      village_name: villageObj
        ? villageObj.name
        : params.village
        ? String(params.village)
        : sdObj
        ? sdObj.name
        : 'Palus',
      lgd_code: villageObj ? villageObj.code : sdObj ? sdObj.code : districtCode,
      pincode: villageObj?.pincode || '416310',
      latitude: villageObj?.latitude || 17.1006,
      longitude: villageObj?.longitude || 74.4532
    };
  }

  public getStates(): LgdState[] {
    return LGD_STATES;
  }

  public getDistricts(stateIdentifier?: number | string): LgdDistrict[] {
    const stateCode = this.resolveStateCode(stateIdentifier);
    if (!stateCode) return LGD_DISTRICTS;
    return LGD_DISTRICTS.filter((d) => d.stateCode === stateCode);
  }

  public getSubDistricts(districtIdentifier?: number | string): LgdSubDistrict[] {
    const districtCode = this.resolveDistrictCode(districtIdentifier);
    if (!districtCode) return LGD_SUBDISTRICTS;
    return LGD_SUBDISTRICTS.filter((sd) => sd.districtCode === districtCode);
  }

  public getVillages(subDistrictIdentifier?: number | string, query?: string): LgdVillage[] {
    const subDistrictCode = this.resolveSubDistrictCode(subDistrictIdentifier);
    let list = LGD_VILLAGES;
    if (subDistrictCode) {
      list = list.filter((v) => v.subDistrictCode === subDistrictCode);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.nameNative.mr.toLowerCase().includes(q) ||
          v.nameNative.hi.toLowerCase().includes(q) ||
          v.pincode.includes(q)
      );
    }
    return list;
  }

  /**
   * Search across all levels of the geographic hierarchy (Village, Taluka, District, State)
   */
  public searchLocation(query: string, limit = 10): LocationHierarchy[] {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();

    const results: LocationHierarchy[] = [];

    // 1. Check exact village matches
    for (const v of LGD_VILLAGES) {
      const vName = v.name.toLowerCase();
      const vMr = v.nameNative.mr.toLowerCase();
      const vHi = v.nameNative.hi.toLowerCase();

      if (
        vName.includes(q) ||
        q.includes(vName) ||
        vMr.includes(q) ||
        q.includes(vMr) ||
        vHi.includes(q) ||
        q.includes(vHi) ||
        v.pincode.includes(q)
      ) {
        const sd = LGD_SUBDISTRICTS.find((s) => s.code === v.subDistrictCode);
        const dist = LGD_DISTRICTS.find((d) => d.code === sd?.districtCode);
        const st = LGD_STATES.find((s) => s.code === dist?.stateCode);

        results.push({
          village: v.name,
          villageLgdCode: v.code,
          subDistrict: sd?.name || 'Taluka',
          subDistrictLgdCode: sd?.code,
          block: sd?.name || 'Block',
          blockLgdCode: sd?.code,
          district: dist?.name || 'District',
          districtLgdCode: dist?.code,
          state: st?.name || 'Maharashtra',
          stateLgdCode: st?.code,
          pincode: v.pincode,
          latitude: v.latitude,
          longitude: v.longitude
        });
      }
    }

    // 2. Check sub-district (Taluka) matches
    for (const sd of LGD_SUBDISTRICTS) {
      const sdName = sd.name.toLowerCase();
      const sdMr = sd.nameNative.mr.toLowerCase();
      const sdHi = sd.nameNative.hi.toLowerCase();
      const sdEn = (sd.nameNative.en || '').toLowerCase();

      if (
        sdName.includes(q) ||
        q.includes(sdName) ||
        sdMr.includes(q) ||
        q.includes(sdMr) ||
        sdHi.includes(q) ||
        q.includes(sdHi) ||
        sdEn.includes(q) ||
        q.includes(sdEn)
      ) {
        const dist = LGD_DISTRICTS.find((d) => d.code === sd.districtCode);
        const st = LGD_STATES.find((s) => s.code === dist?.stateCode);

        // Check if not already included
        const exists = results.some((r) => r.subDistrictLgdCode === sd.code && r.village === sd.name);
        if (!exists) {
          results.push({
            village: sd.name,
            villageLgdCode: sd.code * 100,
            subDistrict: sd.name,
            subDistrictLgdCode: sd.code,
            block: sd.name,
            blockLgdCode: sd.code,
            district: dist?.name || 'District',
            districtLgdCode: dist?.code,
            state: st?.name || 'India',
            stateLgdCode: st?.code
          });
        }
      }
    }

    // 3. Check District matches
    for (const dist of LGD_DISTRICTS) {
      const dName = dist.name.toLowerCase();
      const dMr = dist.nameNative.mr.toLowerCase();
      const dHi = dist.nameNative.hi.toLowerCase();
      const dEn = (dist.nameNative.en || '').toLowerCase();

      if (
        dName.includes(q) ||
        q.includes(dName) ||
        dMr.includes(q) ||
        q.includes(dMr) ||
        dHi.includes(q) ||
        q.includes(dHi) ||
        dEn.includes(q) ||
        q.includes(dEn)
      ) {
        const st = LGD_STATES.find((s) => s.code === dist.stateCode);
        const exists = results.some((r) => r.districtLgdCode === dist.code);
        if (!exists) {
          results.push({
            village: dist.name,
            subDistrict: dist.name,
            block: dist.name,
            district: dist.name,
            districtLgdCode: dist.code,
            state: st?.name || 'India',
            stateLgdCode: st?.code
          });
        }
      }
    }

    // 4. Check State matches
    for (const st of LGD_STATES) {
      const sName = st.name.toLowerCase();
      const sMr = st.nameNative.mr.toLowerCase();
      const sHi = st.nameNative.hi.toLowerCase();
      const sEn = (st.nameNative.en || '').toLowerCase();

      if (
        sName.includes(q) ||
        q.includes(sName) ||
        sMr.includes(q) ||
        q.includes(sMr) ||
        sHi.includes(q) ||
        q.includes(sHi) ||
        sEn.includes(q) ||
        q.includes(sEn)
      ) {
        const matchingDists = LGD_DISTRICTS.filter((d) => d.stateCode === st.code);
        const primaryDist = matchingDists[0];
        const exists = results.some((r) => r.stateLgdCode === st.code);
        if (!exists && primaryDist) {
          results.push({
            village: primaryDist.name,
            subDistrict: primaryDist.name,
            block: primaryDist.name,
            district: primaryDist.name,
            districtLgdCode: primaryDist.code,
            state: st.name,
            stateLgdCode: st.code
          });
        }
      }
    }

    // 5. Dynamic parse fallback if not found in fast dictionary
    if (results.length === 0 && q.length > 0) {
      results.push({
        village: query.trim(),
        subDistrict: 'Taluka',
        block: 'Block',
        district: query.trim(),
        state: 'India'
      });
    }

    return results.slice(0, limit);
  }

  /**
   * Resolve any string location or structured input into a canonical LocationHierarchy
   * Returns null if location data is missing or empty.
   */
  public resolveLocationHierarchy(input?: string | Partial<LocationHierarchy>): LocationHierarchy | null {
    if (!input) {
      return null;
    }

    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (!trimmed || trimmed === 'null' || trimmed === 'undefined') {
        return null;
      }
      const res = indiaGeographicMaster.resolveLocation(trimmed);
      return {
        village: res.village,
        villageLgdCode: res.villageLgdCode,
        subDistrict: res.subDistrict,
        subDistrictLgdCode: res.subDistrictLgdCode,
        block: res.block,
        blockLgdCode: res.blockLgdCode,
        district: res.district,
        districtLgdCode: res.districtLgdCode,
        state: res.state,
        stateLgdCode: res.stateLgdCode,
        pincode: res.pincode,
        latitude: res.latitude,
        longitude: res.longitude
      };
    }

    if (typeof input === 'object') {
      const hasAny = Boolean(
        (input.village && input.village.trim()) ||
        (input.district && input.district.trim()) ||
        (input.block && input.block.trim()) ||
        (input.subDistrict && input.subDistrict.trim()) ||
        (input.state && input.state.trim())
      );

      if (!hasAny) {
        return null;
      }

      const query = input.village || input.district || input.block || input.subDistrict || '';
      const match = query ? this.searchLocation(query)[0] : undefined;

      return {
        village: input.village || match?.village || 'Local Area',
        villageLgdCode: input.villageLgdCode || match?.villageLgdCode,
        subDistrict: input.subDistrict || input.block || match?.subDistrict || 'Taluka',
        subDistrictLgdCode: input.subDistrictLgdCode || match?.subDistrictLgdCode,
        block: input.block || input.subDistrict || match?.block || 'Block',
        blockLgdCode: input.blockLgdCode || match?.blockLgdCode,
        district: input.district || match?.district || 'District',
        districtLgdCode: input.districtLgdCode || match?.districtLgdCode,
        state: input.state || match?.state || 'India',
        stateLgdCode: input.stateLgdCode || match?.stateLgdCode,
        pincode: input.pincode || match?.pincode,
        latitude: input.latitude || match?.latitude,
        longitude: input.longitude || match?.longitude
      };
    }

    return null;
  }
}

export const lgdLocationService = new LgdLocationService();
