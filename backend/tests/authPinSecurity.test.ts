import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { authService } from '../src/services/authService.js';

const app = createApp();

describe('SAATHI Multi-User Auth & PIN Security (1 Mobile = 1 Isolated User)', () => {
  const demoMobile = '9822345678';
  const demoPin = '1234';

  describe('1. Pre-seeded Demo User PIN Verification', () => {
    it('should successfully log in with correct PIN 1234 for 9822345678', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ mobile: demoMobile, pin: demoPin });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.session.token).toBeDefined();
      expect(res.body.data.profile.fullName || res.body.data.profile.name).toContain('रमेश पाटील');
      expect(res.body.data.profile.mobile).toBe(demoMobile);
      expect(res.body.data.profile.village).toContain('सुपे');
      expect(res.body.data.profile.district).toContain('पुणे');
    });

    it('should REJECT login with incorrect PIN for demo user with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ mobile: demoMobile, pin: '9999' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('चुकीचा सुरक्षा पिन');
    });
  });

  describe('2. New User Registration & Subsequent PIN Enforcement', () => {
    const newUserMobile = '9123456789';
    const newUserPin = '4321';

    it('should auto-register a new mobile on first login with clean blank isolated profile', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ mobile: newUserMobile, pin: newUserPin });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.mobile).toBe(newUserMobile);
      expect(res.body.data.profile.id).toContain(newUserMobile);
      // Must NOT contain Ramesh Patil's data
      const name = res.body.data.profile.fullName || res.body.data.profile.name || '';
      expect(name).not.toContain('रमेश पाटील');
      expect(res.body.data.profile.village).toBe('');
      expect(res.body.data.profile.isOnboarded).toBe(false);
    });

    it('should log in successfully when returning with the established PIN 4321', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ mobile: newUserMobile, pin: newUserPin });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.mobile).toBe(newUserMobile);
    });

    it('should REJECT returning login if wrong PIN is entered for this user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ mobile: newUserMobile, pin: '0000' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('चुकीचा सुरक्षा पिन');
    });
  });

  describe('3. Multi-User Isolation: Zero Cross-Account Leakage', () => {
    const userA = '9988776655';
    const pinA = '1111';
    const userB = '9988776644';
    const pinB = '2222';

    it('should keep user A and user B completely distinct and isolated', async () => {
      // Register User A
      const resA = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'अमित कांबळे (Amit Kamble)',
          mobile: userA,
          pin: pinA,
          village: 'कुर्डुवाडी',
          district: 'सोलापूर',
          ownCapital: 75000,
          desiredBusiness: 'Solar Lantern Repair'
        });

      expect(resA.status).toBe(201);
      expect(resA.body.data.profile.mobile).toBe(userA);

      // Register User B
      const resB = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'प्रिया कुलकर्णी (Priya Kulkarni)',
          mobile: userB,
          pin: pinB,
          village: 'इचलकरंजी',
          district: 'कोल्हापूर',
          ownCapital: 300000,
          desiredBusiness: 'Textile Boutique'
        });

      expect(resB.status).toBe(201);
      expect(resB.body.data.profile.mobile).toBe(userB);

      // Verify User A profile does not leak to User B
      const sessionA = await authService.getUserProfile(userA);
      const sessionB = await authService.getUserProfile(userB);

      const nameA = sessionA?.fullName || '';
      const nameB = sessionB?.fullName || '';

      expect(nameA).toContain('अमित कांबळे');
      expect(sessionA?.district).toContain('सोलापूर');
      expect(nameB).toContain('प्रिया कुलकर्णी');
      expect(sessionB?.district).toContain('कोल्हापूर');
      expect(sessionA?.ownCapital).toBe(75000);
      expect(sessionB?.ownCapital).toBe(300000);

      // User A PIN cannot unlock User B
      await expect(authService.login({ mobile: userB, pin: pinA })).rejects.toThrow('चुकीचा सुरक्षा पिन');
    });
  });

  describe('4. Input Validation Integrity', () => {
    it('should reject invalid mobile numbers (< 10 digits)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ mobile: '98223', pin: '1234' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid PINs (< 4 digits)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ mobile: '9822345678', pin: '12' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
