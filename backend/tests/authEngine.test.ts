import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { authService } from '../src/services/authService.js';

const app = createApp();

describe('SAATHI Authentication Hardening & Active Context Tests', () => {
  it('registers a new user and returns valid session token and profile', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'अथर्व सावंत (Atharva Sawant)',
        mobile: '9876543210',
        pin: '1234',
        preferredLanguage: 'mr',
        village: 'Palus',
        district: 'Sangli',
        ownCapital: 250000,
        desiredBusiness: 'Mobile & Electronics Repair'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.session.token).toBeDefined();
    expect(res.body.data.profile.fullName).toContain('Atharva');
    expect(res.body.data.profile.desiredBusiness).toBe('Mobile & Electronics Repair');
  });

  it('logs in an existing user with valid mobile and PIN', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        mobile: '9876543210',
        pin: '1234'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.session.token).toBeDefined();
    expect(res.body.data.profile.desiredBusiness).toBe('Mobile & Electronics Repair');
  });

  it('rejects invalid mobile number or short PIN', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        mobile: '123',
        pin: '1'
      });

    expect(res.status).toBe(400); // Validation error
  });

  it('validates session token on /api/v1/auth/me', async () => {
    const regRes = await authService.register({
      fullName: 'सुरेश जाधव (Suresh Jadhav)',
      mobile: '9988776655',
      pin: '5678',
      preferredLanguage: 'mr',
      village: 'Shirur',
      district: 'Pune',
      ownCapital: 100000,
      desiredBusiness: 'Tailoring & Garments'
    });

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${regRes.session.token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profile.fullName).toContain('Suresh');
  });

  it('rejects unauthenticated request without token on /api/v1/auth/me', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
