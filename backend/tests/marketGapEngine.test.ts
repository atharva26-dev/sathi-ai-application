import { describe, it, expect } from '@jest/globals';
import { getMarketOpportunitiesForCluster } from '../src/domain/market/marketOpportunityMatrix.js';
import { getCompetitorsForCluster } from '../src/domain/market/competitorEngine.js';
import { lgdLocationService } from '../src/domain/location/lgdLocationService.js';
import { marketScoringEngine } from '../src/domain/market/marketScoringEngine.js';
import { marketService } from '../src/services/marketService.js';
import { normalizeBusinessCategory } from '../src/domain/businesses/businessCatalog.js';

describe('Market Gap & Opportunity Engine — Dynamic Business & Location Isolation', () => {
  it('should return mobile repair opportunities for Mobile & Electronics Repair in Palus', () => {
    const opps = getMarketOpportunitiesForCluster('Palus, Sangli', 'mobile_repair');
    expect(opps.length).toBeGreaterThanOrEqual(3);
    expect(opps[0].id).toBe('gap_doorstep_mobile_repair');

    // Strict isolation: Zero dairy or milk items
    const oppsStr = JSON.stringify(opps).toLowerCase();
    expect(oppsStr).not.toContain('paneer');
    expect(oppsStr).not.toContain('malai');
    expect(oppsStr).not.toContain('milk');
  });

  it('should return mobile repair competitors without any dairy competitors', () => {
    const comps = getCompetitorsForCluster('Palus, Sangli', 'mobile_repair');
    expect(comps.length).toBeGreaterThanOrEqual(2);
    expect(comps[0].id).toBe('comp_city_service_center');

    const compsStr = JSON.stringify(comps).toLowerCase();
    expect(compsStr).not.toContain('dairy');
    expect(compsStr).not.toContain('sweet shop');
  });

  it('should return tailoring opportunities for Tailoring in Shirur', () => {
    const opps = getMarketOpportunitiesForCluster('Shirur, Pune', 'tailoring');
    expect(opps[0].id).toBe('gap_custom_tailoring');

    const oppsStr = JSON.stringify(opps).toLowerCase();
    expect(oppsStr).not.toContain('mobile');
    expect(oppsStr).not.toContain('screen');
    expect(oppsStr).not.toContain('paneer');
  });

  it('should return dairy opportunities ONLY when Dairy is selected', () => {
    const opps = getMarketOpportunitiesForCluster('Supe, Baramati', 'dairy');
    expect(opps[0].id).toBe('gap_paneer');
    expect(opps[0].nameNative.en).toContain('Paneer');
  });

  it('should dynamically normalize and generate opportunities for arbitrary custom businesses', () => {
    const arch = normalizeBusinessCategory('Solar water pump installation and maintenance');
    expect(arch.id).toBeDefined();

    const opps = getMarketOpportunitiesForCluster('Solapur Rural', 'Solar pump installation');
    expect(opps.length).toBeGreaterThanOrEqual(2);
    expect(opps[0].name).toContain('Solar pump');
  });

  it('should search and locate official LGD hierarchy for Palus', () => {
    const results = lgdLocationService.searchLocation('Palus');
    expect(results.length).toBeGreaterThan(0);
    const palus = results[0];
    expect(palus.village).toBe('Palus');
    expect(palus.district).toBe('Sangli');
    expect(palus.state).toBe('Maharashtra');
    expect(palus.villageLgdCode).toBe(568320);
  });

  it('should calculate deterministic multi-dimensional scores', () => {
    const context = {
      userId: 'test-user-1',
      language: 'en' as const,
      businessName: 'Mobile & Electronics Repair',
      businessCategory: 'Services & Repair',
      location: { village: 'Palus', subDistrict: 'Palus', district: 'Sangli', state: 'Maharashtra' },
      availableCapital: 250000,
      analysisRadiusKm: 10
    };
    const arch = normalizeBusinessCategory('Mobile Repair');
    const score = marketScoringEngine.calculateScore(context, arch, 2);

    expect(score.overallOpportunity).toBeGreaterThan(50);
    expect(score.overallOpportunity).toBeLessThanOrEqual(100);
    expect(score.demand).toBeGreaterThan(0);
    expect(score.capitalFit).toBeGreaterThan(80); // ₹2.5L fits well
    expect(score.explanationPoints.en.length).toBeGreaterThanOrEqual(4);
  });

  it('should update score when capital or radius changes', async () => {
    const loc = { village: 'Palus', subDistrict: 'Palus', district: 'Sangli', state: 'Maharashtra' };
    const resLowCap = await marketService.analyzeMarketGap({
      userId: 'user-a',
      businessName: 'Dairy Processing',
      availableCapital: 10000, // Very low
      location: loc,
      analysisRadiusKm: 5
    });

    const resHighCap = await marketService.analyzeMarketGap({
      userId: 'user-b',
      businessName: 'Dairy Processing',
      availableCapital: 250000, // Ample
      location: loc,
      analysisRadiusKm: 10
    });

    expect(resHighCap.scoreBreakdown.capitalFit).toBeGreaterThan(resLowCap.scoreBreakdown.capitalFit);
  });
});
