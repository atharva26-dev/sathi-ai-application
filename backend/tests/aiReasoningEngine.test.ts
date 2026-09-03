import { describe, it, expect } from '@jest/globals';
import { aiOrchestrator } from '../src/ai/orchestrator.js';
import { detectIntentAndSwitch } from '../src/ai/intentDetector.js';
import { normalizeBusinessCategory, BUSINESS_ARCHETYPES } from '../src/domain/businesses/businessCatalog.js';

describe('SAATHI Master AI Advisor Engine — Comprehensive Rural Intelligence Tests', () => {
  // =========================================================================
  // SUITE 1: BUSINESS ISOLATION & ZERO DAIRY DEFAULT
  // =========================================================================
  it('TEST 1: Mobile repair asking "how to start" receives Mobile Repair roadmap with ZERO dairy', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'how to start a business',
      'en',
      { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli', capital: 200000 },
      'test-mobile-user'
    );

    expect(res.answer.toLowerCase()).toContain('mobile');
    expect(res.summary.toLowerCase()).toContain('mobile');

    const fullOutput = (res.answer + ' ' + res.summary + ' ' + JSON.stringify(res.cards)).toLowerCase();
    expect(fullOutput).not.toContain('paneer');
    expect(fullOutput).not.toContain('milk');
    expect(fullOutput).not.toContain('dairy');
    expect(fullOutput).not.toContain('tailoring');
  });

  it('TEST 2: Tailoring asking "how to start" receives Tailoring roadmap with ZERO mobile/dairy', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'how to start a business',
      'en',
      { businessName: 'Tailoring & Garments', location: 'Shirur, Pune', capital: 50000 },
      'test-tailor-user'
    );

    const fullOutput = (res.answer + ' ' + res.summary + ' ' + JSON.stringify(res.cards)).toLowerCase();
    expect(fullOutput).toContain('tailoring');
    expect(fullOutput).not.toContain('soldering');
    expect(fullOutput).not.toContain('paneer');
  });

  // =========================================================================
  // SUITE 2: COMPREHENSIVE 15+ RURAL BUSINESS ARCHETYPES
  // =========================================================================
  const testArchetypes = [
    { input: 'Goat Farming & Breeding', expectedTerm: 'goat', categoryKey: 'goat_farming' },
    { input: 'Fresh Bakery & Snacks', expectedTerm: 'bakery', categoryKey: 'bakery' },
    { input: 'Beauty Parlor & Salon', expectedTerm: 'salon', categoryKey: 'salon' },
    { input: 'Welding & Metal Fabrication', expectedTerm: 'welding', categoryKey: 'welding' },
    { input: 'CSC Digital Services & Cyber Center', expectedTerm: 'digital', categoryKey: 'digital_services' },
    { input: 'Handicrafts & Pottery', expectedTerm: 'craft', categoryKey: 'handicrafts' },
    { input: 'Spices, Pickles & Food Processing', expectedTerm: 'food', categoryKey: 'food_processing' },
    { input: 'Agri-Inputs & Seeds Center', expectedTerm: 'agri', categoryKey: 'agri_services' },
    { input: 'Rural Transport & Logistics', expectedTerm: 'transport', categoryKey: 'rural_transport' },
    { input: 'Agro-Tourism & Rural Homestay', expectedTerm: 'tourism', categoryKey: 'rural_tourism' },
    { input: 'Poultry & Broiler Farming', expectedTerm: 'poultry', categoryKey: 'poultry' },
    { input: 'Grocery & Kirana Store', expectedTerm: 'grocery', categoryKey: 'grocery' }
  ];

  testArchetypes.forEach(({ input, expectedTerm, categoryKey }) => {
    it(`TEST Archetype [${categoryKey}]: Normalizes and provides specific roadmap for '${input}'`, async () => {
      const arch = normalizeBusinessCategory(input);
      expect(arch.id).toBe(categoryKey);

      const res = await aiOrchestrator.handleUserMessage(
        `How do I start my ${input}?`,
        'en',
        { businessName: input, location: 'Palus, Sangli', capital: 100000 },
        `test-user-${categoryKey}`
      );

      expect(res.answer.toLowerCase()).toContain(expectedTerm);
      expect(res.calculations?.projectCost).toBe(1000000);
    });
  });

  // =========================================================================
  // SUITE 3: MENTOR MODE ("I DON'T KNOW WHAT BUSINESS TO START")
  // =========================================================================
  it('TEST 3: "I don\'t know what business to start" asks 3 clarifying questions instead of guessing or defaulting to dairy', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      "I don't know what business to start. Can you guide me?",
      'en',
      { location: 'Sangamner, Ahmednagar', capital: 100000 },
      'test-mentor-user-1'
    );

    expect(res.answer).toContain('Available Capital');
    expect(res.answer).toContain('Workplace / Premises');
    expect(res.answer).toContain('Core Skills & Interests');

    const fullOutput = (res.answer + ' ' + res.summary).toLowerCase();
    expect(fullOutput).not.toContain('fresh paneer');
  });

  it('TEST 3b: Marathi Mentor query "मला कोणता व्यवसाय सुरू करावा हे समजत नाही" returns 3 Marathi clarifying questions', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'मला कोणता व्यवसाय सुरू करावा हे समजत नाही',
      'mr',
      { location: 'बारामती, पुणे', capital: 50000 },
      'test-mentor-user-2'
    );

    expect(res.answer).toContain('स्वतःचे भांडवल');
    expect(res.answer).toContain('जागा/शेड');
    expect(res.answer).toContain('कौशल्य व आवड');
  });

  // =========================================================================
  // SUITE 4: DYNAMIC PARAMETER UPDATES (CAPITAL & BUSINESS SWITCH)
  // =========================================================================
  it('TEST 4: Parameter update "I have only ₹50,000" recalculates financial structure immediately to ₹5 Lakh project', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'I have only ₹50,000 for my mobile repair business',
      'en',
      { businessName: 'Mobile & Electronics Repair', location: 'Palus', capital: 200000 },
      'test-param-cap-user'
    );

    expect(res.calculations?.projectCost).toBe(500000); // ₹50k / 0.10 = ₹5L
    expect(res.calculations?.loanComponent).toBe(450000); // 90% = ₹4.5L
  });

  // =========================================================================
  // SUITE 5: OPEN-ENDED RURAL BUSINESS QUESTIONS
  // =========================================================================
  it('TEST 5: "What should I do if customers ask for credit (udhaari)?" returns strict credit discipline', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'What should I do if customers ask for credit (udhaari)?',
      'en',
      { businessName: 'Mobile & Electronics Repair', location: 'Palus', capital: 100000 },
      'test-credit-user'
    );

    expect(res.answer.toLowerCase()).toContain('credit');
    expect(res.answer).toContain('10%');
    expect(res.recommendations.length).toBeGreaterThanOrEqual(2);
  });

  it('TEST 6: "My competitor is selling cheaper than me" returns quality warranty differentiation, not destructive price cuts', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'My competitor is selling cheaper than me. Should I drop my prices?',
      'en',
      { businessName: 'Mobile & Electronics Repair', location: 'Palus', capital: 100000 },
      'test-pricewar-user'
    );

    expect(res.answer.toLowerCase()).toContain('warranty');
    expect(res.answer.toLowerCase()).toContain('quality');
  });

  it('TEST 7: "Sales are good but no money left at month end" diagnoses 4 rural cash leaks', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'Sales are good but no money left at month end. Why am I losing cash?',
      'en',
      { businessName: 'Grocery Store', location: 'Palus', capital: 100000 },
      'test-leakage-user'
    );

    expect(res.answer).toContain('Uncollected Credit');
    expect(res.answer).toContain('Household Mixing');
    expect(res.cards[0].type).toBe('RISK_ALERT');
  });

  // =========================================================================
  // SUITE 6: ANTI-HALLUCINATION & HONEST UNCERTAINTY
  // =========================================================================
  it('TEST 8: Asking for exact shop count in an unverified village explicitly acknowledges missing census data and provides 6-Step Field Validation Guide', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'How many mobile repair shops are currently open in my village?',
      'en',
      { businessName: 'Mobile & Electronics Repair', location: 'Supe Village', capital: 100000 },
      'test-unverified-census-user'
    );

    expect(res.answer).toContain('do not have verified shop-count');
    expect(res.answer).toContain('6-Step Field Validation Guide');
    expect(res.trustLevel).toBe('AI_ESTIMATE');
  });

  // =========================================================================
  // SUITE 7: MULTILINGUAL CONSISTENCY
  // =========================================================================
  it('TEST 9: English mode returns 100% English output', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'How do I start tailoring in my village?',
      'en',
      { businessName: 'Tailoring & Garments', location: 'Palus', capital: 50000 },
      'test-lang-en'
    );

    expect(res.answer).toContain('Short Answer');
    expect(res.answer).toContain('Numbers');
    expect(res.voiceSpokenText).toContain('capital');
  });

  it('TEST 10: Hindi mode returns 100% Hindi output', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'मैं अपने गांव में सिलाई का काम कैसे शुरू करूँ?',
      'hi',
      { businessName: 'Tailoring & Garments', location: 'Palus', capital: 50000 },
      'test-lang-hi'
    );

    expect(res.answer).toContain('व्यवसाय');
    expect(res.answer).toContain('पूंजी');
    expect(res.voiceSpokenText).toContain('सिलाई');
  });

  it('TEST 11: Marathi mode returns 100% Marathi output', async () => {
    const res = await aiOrchestrator.handleUserMessage(
      'माझ्या गावात टेलरिंगचा व्यवसाय कसा सुरू करू?',
      'mr',
      { businessName: 'Tailoring & Garments', location: 'Palus', capital: 50000 },
      'test-lang-mr'
    );

    expect(res.answer).toContain('व्यवसाय');
    expect(res.answer).toContain('भांडवल');
    expect(res.voiceSpokenText).toContain('भांडवलातून');
  });
});
