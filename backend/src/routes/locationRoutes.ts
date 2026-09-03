import { Router, Request, Response } from 'express';
import { lgdLocationService } from '../domain/location/lgdLocationService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export const locationRoutes = Router();

/**
 * Search across location hierarchy (State, District, SubDistrict, Village)
 * Supports English, Marathi, Hindi, aliases, and PIN codes
 */
locationRoutes.get('/location/search', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const limit = parseInt((req.query.limit as string) || '10', 10);
  const results = lgdLocationService.searchLocation(query, limit);
  sendSuccess(res, results, 200, req.id);
});

/**
 * Get all States / UTs
 * Query parameter can optionally filter
 */
locationRoutes.get('/location/states', async (_req: Request, res: Response) => {
  try {
    // If Supabase is available in non-test mode, try fetching verified state records
    if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
      const { data, error } = await supabaseAdmin
        .from('locations')
        .select('state_code, name, display_name, lgd_code')
        .in('location_type', ['STATE', 'UT'])
        .order('name');

      if (!error && data && data.length > 0) {
        const states = data.map((row) => ({
          code: row.state_code || row.lgd_code,
          name: row.name,
          nameNative: row.display_name || { mr: row.name, hi: row.name, en: row.name }
        }));
        return sendSuccess(res, states, 200, _req.id);
      }
    }
  } catch (err) {
    logger.warn('Supabase state query failed, falling back to LGD master', { error: err });
  }

  const states = lgdLocationService.getStates();
  sendSuccess(res, states, 200, _req.id);
});

/**
 * Get Districts for a given state
 * Accepts ?stateCode=27 OR ?state_id=27 OR ?state_id=Maharashtra
 */
locationRoutes.get('/location/districts', async (req: Request, res: Response) => {
  const stateParam = (req.query.stateCode || req.query.state_id || req.query.stateId || req.query.state) as string | undefined;

  try {
    if (stateParam && process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
      const stateCode = lgdLocationService.resolveStateCode(stateParam);
      if (stateCode) {
        const { data, error } = await supabaseAdmin
          .from('locations')
          .select('district_code, state_code, name, display_name, lgd_code')
          .eq('location_type', 'DISTRICT')
          .eq('state_code', stateCode)
          .order('name');

        if (!error && data && data.length > 0) {
          const districts = data.map((row) => ({
            code: row.district_code || row.lgd_code,
            stateCode: row.state_code,
            name: row.name,
            nameNative: row.display_name || { mr: row.name, hi: row.name, en: row.name }
          }));
          return sendSuccess(res, districts, 200, req.id);
        }
      }
    }
  } catch (err) {
    logger.warn('Supabase district query failed, falling back to LGD master', { error: err });
  }

  const districts = lgdLocationService.getDistricts(stateParam);
  sendSuccess(res, districts, 200, req.id);
});

/**
 * Get Local Administrative Units (Taluka / Tehsil / Mandal / Block) for a district
 * Accepts ?districtCode=504 OR ?district_id=504 OR ?district_id=Sangli
 */
locationRoutes.get('/location/subdistricts', async (req: Request, res: Response) => {
  const districtParam = (req.query.districtCode || req.query.district_id || req.query.districtId || req.query.district) as string | undefined;

  try {
    if (districtParam && process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
      const districtCode = lgdLocationService.resolveDistrictCode(districtParam);
      if (districtCode) {
        const { data, error } = await supabaseAdmin
          .from('locations')
          .select('subdistrict_code, district_code, name, display_name, lgd_code, location_type')
          .in('location_type', ['SUBDISTRICT', 'TALUKA', 'TEHSIL', 'MANDAL', 'BLOCK'])
          .eq('district_code', districtCode)
          .order('name');

        if (!error && data && data.length > 0) {
          const subdistricts = data.map((row) => ({
            code: row.subdistrict_code || row.lgd_code,
            districtCode: row.district_code,
            name: row.name,
            nameNative: row.display_name || { mr: row.name, hi: row.name, en: row.name }
          }));
          return sendSuccess(res, subdistricts, 200, req.id);
        }
      }
    }
  } catch (err) {
    logger.warn('Supabase subdistrict query failed, falling back to LGD master', { error: err });
  }

  const subdistricts = lgdLocationService.getSubDistricts(districtParam);
  sendSuccess(res, subdistricts, 200, req.id);
});

/**
 * Get Villages under a local administrative unit
 * Accepts ?subdistrictCode=4210 OR ?subdistrict_id=4210 OR ?subdistrict_id=Palus
 * Supports search filtering via ?q=...
 */
locationRoutes.get('/location/villages', async (req: Request, res: Response) => {
  const subdistrictParam = (
    req.query.subdistrictCode ||
    req.query.subdistrict_id ||
    req.query.subdistrictId ||
    req.query.subDistrictCode ||
    req.query.subdistrict ||
    req.query.taluka_id ||
    req.query.block_id ||
    req.query.talukaCode
  ) as string | undefined;
  const query = (req.query.q as string) || '';

  try {
    if (subdistrictParam && process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
      const subdistrictCode = lgdLocationService.resolveSubDistrictCode(subdistrictParam);
      if (subdistrictCode) {
        let dbQuery = supabaseAdmin
          .from('locations')
          .select('village_code, subdistrict_code, name, display_name, postal_code, latitude, longitude, lgd_code')
          .in('location_type', ['VILLAGE', 'TOWN'])
          .eq('subdistrict_code', subdistrictCode)
          .order('name');

        if (query.trim()) {
          dbQuery = dbQuery.ilike('name', `%${query.trim()}%`);
        }

        const { data, error } = await dbQuery;

        if (!error && data && data.length > 0) {
          const villages = data.map((row) => ({
            code: row.village_code || row.lgd_code,
            subDistrictCode: row.subdistrict_code,
            name: row.name,
            nameNative: row.display_name || { mr: row.name, hi: row.name, en: row.name },
            pincode: row.postal_code || '',
            latitude: row.latitude ? parseFloat(row.latitude) : undefined,
            longitude: row.longitude ? parseFloat(row.longitude) : undefined
          }));
          return sendSuccess(res, villages, 200, req.id);
        }
      }
    }
  } catch (err) {
    logger.warn('Supabase village query failed, falling back to LGD master', { error: err });
  }

  const villages = lgdLocationService.getVillages(subdistrictParam, query);
  sendSuccess(res, villages, 200, req.id);
});

/**
 * Resolve hierarchical location into canonical LGD object
 * GET /api/v1/location/resolve?state=...&district=...&subdistrict=...&village=...
 */
locationRoutes.get('/location/resolve', (req: Request, res: Response) => {
  const state = (req.query.state || req.query.stateName || req.query.state_name) as string | undefined;
  const district = (req.query.district || req.query.districtName || req.query.district_name) as string | undefined;
  const subdistrict = (req.query.subdistrict ||
    req.query.subDistrict ||
    req.query.subdistrictName ||
    req.query.subdistrict_name ||
    req.query.block ||
    req.query.taluka ||
    req.query.tehsil ||
    req.query.mandal) as string | undefined;
  const village = (req.query.village || req.query.villageName || req.query.village_name || req.query.town) as string | undefined;

  const canonical = lgdLocationService.resolveCanonicalLocation({
    state,
    district,
    subdistrict,
    village
  });

  sendSuccess(res, canonical, 200, req.id);
});
