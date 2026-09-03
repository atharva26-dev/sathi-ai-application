import request from 'supertest';
import { createApp } from '../src/app';

jest.setTimeout(30000);

const app = createApp();

describe('Cascading Location Choice System & Canonical LGD Resolution Tests', () => {
  describe('Hierarchical Administrative Queries', () => {
    it('GET /api/v1/location/states should return all Indian states and UTs with multilingual labels', async () => {
      const res = await request(app).get('/api/v1/location/states');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(15);

      const maharashtra = res.body.data.find((s: any) => s.code === 27);
      expect(maharashtra).toBeDefined();
      expect(maharashtra.name).toBe('Maharashtra');
      expect(maharashtra.nameNative.mr).toBe('महाराष्ट्र');
      expect(maharashtra.nameNative.hi).toBe('महाराष्ट्र');

      const tamilNadu = res.body.data.find((s: any) => s.code === 33);
      expect(tamilNadu).toBeDefined();
      expect(tamilNadu.name).toBe('Tamil Nadu');
    });

    it('GET /api/v1/location/districts should return districts for Maharashtra (code 27)', async () => {
      const res = await request(app).get('/api/v1/location/districts?stateCode=27');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const sangli = res.body.data.find((d: any) => d.code === 504);
      expect(sangli).toBeDefined();
      expect(sangli.name).toBe('Sangli');
      expect(sangli.nameNative.mr).toBe('सांगली');

      const pune = res.body.data.find((d: any) => d.code === 492);
      expect(pune).toBeDefined();
      expect(pune.name).toBe('Pune');
    });

    it('GET /api/v1/location/subdistricts should return Talukas for Sangli (code 504)', async () => {
      const res = await request(app).get('/api/v1/location/subdistricts?districtCode=504');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      const palus = res.body.data.find((sd: any) => sd.code === 4210);
      expect(palus).toBeDefined();
      expect(palus.name).toBe('Palus');
      expect(palus.nameNative.mr).toBe('पलूस');
    });

    it('GET /api/v1/location/villages should return villages for Palus (code 4210)', async () => {
      const res = await request(app).get('/api/v1/location/villages?subdistrictCode=4210');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);

      const palusVillage = res.body.data.find((v: any) => v.code === 568320);
      expect(palusVillage).toBeDefined();
      expect(palusVillage.name).toBe('Palus');
      expect(palusVillage.pincode).toBe('416310');
    });

    it('GET /api/v1/location/villages with search query should filter villages instantly', async () => {
      const res = await request(app).get('/api/v1/location/villages?subdistrictCode=4210&q=Kundal');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Kundal');
      expect(res.body.data[0].pincode).toBe('416309');
    });
  });

  describe('Canonical Location Resolution & Regional Nomenclature', () => {
    it('Should resolve canonical hierarchy for Palus, Sangli with Taluka label', async () => {
      const res = await request(app).get('/api/v1/location/resolve?state=Maharashtra&district=Sangli&subdistrict=Palus&village=Palus');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const loc = res.body.data;
      expect(loc.country).toBe('India');
      expect(loc.state_name).toBe('Maharashtra');
      expect(loc.state_id).toBe(27);
      expect(loc.district_name).toBe('Sangli');
      expect(loc.district_id).toBe(504);
      expect(loc.subdistrict_name).toBe('Palus');
      expect(loc.subdistrict_id).toBe(4210);
      expect(loc.subdistrict_label).toBe('Taluka');
      expect(loc.village_name).toBe('Palus');
      expect(loc.lgd_code).toBe(568320);
      expect(loc.pincode).toBe('416310');
    });

    it('Should resolve Tamil Nadu subdistrict with "Taluk" label', async () => {
      const res = await request(app).get('/api/v1/location/resolve?state=Tamil Nadu&district=Coimbatore&subdistrict=Coimbatore South');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.state_name).toBe('Tamil Nadu');
      expect(res.body.data.subdistrict_label).toBe('Taluk');
    });

    it('Should resolve Andhra Pradesh subdistrict with "Mandal" label', async () => {
      const res = await request(app).get('/api/v1/location/resolve?state=Andhra Pradesh&district=Guntur&subdistrict=Tenali');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.state_name).toBe('Andhra Pradesh');
      expect(res.body.data.subdistrict_label).toBe('Mandal');
    });

    it('Should resolve Bihar subdistrict with "Block" label', async () => {
      const res = await request(app).get('/api/v1/location/resolve?state=Bihar&district=Patna&subdistrict=Bihta');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.state_name).toBe('Bihar');
      expect(res.body.data.subdistrict_label).toBe('Block');
    });

    it('Should resolve Rajasthan subdistrict with "Tehsil" label', async () => {
      const res = await request(app).get('/api/v1/location/resolve?state=Rajasthan&district=Jaipur&subdistrict=Sanganer');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.state_name).toBe('Rajasthan');
      expect(res.body.data.subdistrict_label).toBe('Tehsil');
    });

    it('Should handle state/district alias fallback when exact string has variations', async () => {
      const res = await request(app).get('/api/v1/location/resolve?state=MH&district=Ahmednagar&subdistrict=Sangamner');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.state_name).toBe('Maharashtra');
      expect(res.body.data.district_name).toBe('Ahmednagar');
      expect(res.body.data.subdistrict_name).toBe('Sangamner');
    });
  });
});
