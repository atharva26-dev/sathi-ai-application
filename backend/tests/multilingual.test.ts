import { SUPPORTED_LANGUAGES } from '../src/config/constants.js';
import { BACKEND_LANGUAGES, getBackendLanguage } from '../src/config/languages.js';
import { responseReviewer } from '../src/ai/validation/responseReviewer.js';
import { AssembledBusinessContext } from '../src/ai/context/contextEngine.js';
import { SkillExecutionResult } from '../src/ai/skills/skillTypes.js';
import { aiOrchestrator } from '../src/ai/orchestrator.js';

jest.setTimeout(30000);

describe('SAATHI Master Indian Language & Multilingual System Test Suite', () => {
  // =========================================================================
  // 1. SCHEDULED LANGUAGES CATALOG COVERAGE
  // =========================================================================
  describe('22 Scheduled Languages + English Catalog Integrity', () => {
    it('Should contain 23 supported languages in the official catalog', () => {
      expect(SUPPORTED_LANGUAGES.length).toBe(23);
      expect(BACKEND_LANGUAGES.length).toBe(23);
    });

    it('Should verify all 22 8th Schedule Indian languages are cataloged', () => {
      const scheduledLanguages = [
        'as', 'bn', 'brx', 'doi', 'gu', 'hi', 'kn', 'ks', 'kok',
        'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'sa', 'sat',
        'sd', 'ta', 'te', 'ur'
      ];
      for (const code of scheduledLanguages) {
        expect(SUPPORTED_LANGUAGES).toContain(code);
        const def = getBackendLanguage(code);
        expect(def.code).toBe(code);
        expect(def.name).toBeDefined();
        expect(def.nativeName).toBeDefined();
        expect(def.script).toBeDefined();
        expect(def.speechLocale).toBeDefined();
      }
    });

    it('Should verify RTL direction flags for Urdu, Kashmiri, and Sindhi', () => {
      expect(getBackendLanguage('ur').direction).toBe('rtl');
      expect(getBackendLanguage('ks').direction).toBe('rtl');
      expect(getBackendLanguage('sd').direction).toBe('rtl');
      expect(getBackendLanguage('mr').direction).toBe('ltr');
      expect(getBackendLanguage('ta').direction).toBe('ltr');
      expect(getBackendLanguage('en').direction).toBe('ltr');
    });
  });

  // =========================================================================
  // 2. AI ORCHESTRATOR MULTILINGUAL EXECUTION
  // =========================================================================
  describe('AI Orchestrator Multi-Language Execution', () => {
    const testLanguages = ['mr', 'hi', 'en', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'pa', 'or', 'ur', 'as', 'ne'] as const;

    for (const lang of testLanguages) {
      it(`Should execute AI advisory for language "${lang}" without errors`, async () => {
        const res = await aiOrchestrator.handleUserMessage(
          'how to start a business',
          lang,
          {
            businessName: 'Tailoring & Garments',
            capital: 50000,
            location: 'Coimbatore, Tamil Nadu'
          },
          `user-test-${lang}`
        );

        expect(res).toBeDefined();
        expect(res.answer).toBeDefined();
        expect(res.answer.length).toBeGreaterThan(10);
        expect(res.summary).toBeDefined();
      });
    }
  });

  // =========================================================================
  // 3. RESPONSE SCRIPT & LANGUAGE PLAUSIBILITY VALIDATION
  // =========================================================================
  describe('ResponseReviewer Script Plausibility Checks', () => {
    const mockContext: AssembledBusinessContext = {
      profile: { desiredBusiness: 'Tailoring & Garments' } as any,
      locationCluster: 'Palus, Sangli',
      businessArchetype: { category: 'manufacturing', title: 'Tailoring' } as any,
      financialBaseline: { ownCapital: 50000, projectCost: 100000 } as any,
      marketRadar: {
        clusterName: 'Palus',
        targetBuyerDescription: 'Local households',
        unmetDemandUnits: '150 units',
        topCompetitorOverview: '2 local shops'
      },
      schemes: [],
      activeConversationState: { previousDecisions: [] }
    };

    const baseResult: SkillExecutionResult = {
      answer: '',
      summary: 'Summary text',
      voiceSpokenText: 'Voice text',
      cards: [],
      recommendations: ['Step 1'],
      risks: ['Risk 1'],
      assumptions: [],
      sources: [{ title: 'Official Data', isOfficial: true }],
      suggestedNextQuestions: [],
      trustLevel: 'FACT',
      confidenceScore: 95,
      skillName: 'BusinessAdvisorSkill'
    };

    it('Should PASS when Tamil response contains genuine Tamil script', () => {
      const tamilResult: SkillExecutionResult = {
        ...baseResult,
        answer: 'தையல் தொழில் தொடங்க ₹50,000 முதலீடு தேவைப்படும். ஆரம்பத்தில் 2 இயந்திரங்களை வாங்கவும்.'
      };
      const review = responseReviewer.validateResponse(tamilResult, mockContext, 'ta', 'தையல் தொழில் தொடங்க');
      expect(review.isValid).toBe(true);
    });

    it('Should REJECT when Tamil response is primarily English with zero Tamil script', () => {
      const englishResult: SkillExecutionResult = {
        ...baseResult,
        answer: 'You can start this tailoring business with fifty thousand rupees by buying two machines.'
      };
      const review = responseReviewer.validateResponse(englishResult, mockContext, 'ta', 'தையல் தொழில் தொடங்க');
      expect(review.isValid).toBe(false);
      expect(review.reasons.some((r) => r.includes('Language mismatch'))).toBe(true);
    });

    it('Should PASS when Bengali response contains genuine Bengali script', () => {
      const bengaliResult: SkillExecutionResult = {
        ...baseResult,
        answer: 'দর্জি ব্যবসা শুরু করতে ৫০,০০০ টাকা পুঁজির প্রয়োজন হবে। দুটি সেলাই মেশিন কিনুন।'
      };
      const review = responseReviewer.validateResponse(bengaliResult, mockContext, 'bn', 'দর্জি ব্যবসা');
      expect(review.isValid).toBe(true);
    });

    it('Should REJECT when Bengali response has zero Bengali script', () => {
      const mismatchedResult: SkillExecutionResult = {
        ...baseResult,
        answer: 'Tailoring business can be started with fifty thousand capital in your local area easily.'
      };
      const review = responseReviewer.validateResponse(mismatchedResult, mockContext, 'bn', 'দর্জি ব্যবসা');
      expect(review.isValid).toBe(false);
    });

    it('Should PASS English response with Latin characters', () => {
      const englishResult: SkillExecutionResult = {
        ...baseResult,
        answer: 'You can start your tailoring enterprise in Palus with ₹50,000 initial capital.'
      };
      const review = responseReviewer.validateResponse(englishResult, mockContext, 'en', 'how to start tailoring');
      expect(review.isValid).toBe(true);
    });
  });

  // =========================================================================
  // 4. LANGUAGE ≠ LOCATION INDEPENDENCE
  // =========================================================================
  describe('Language ≠ Location Cross-Matrix Independence', () => {
    it('TEST: Marathi speaker in Bihar receives Bihar location intelligence', async () => {
      const res = await aiOrchestrator.handleUserMessage(
        'व्यवसाय कसा सुरू करावा',
        'mr',
        { businessName: 'Retail Kirana Store', location: 'Bihta, Patna, Bihar', capital: 80000 },
        'test-marathi-bihar-user'
      );

      expect(res.answer).toBeDefined();
      expect(res.summary).toBeDefined();
      const fullText = (res.answer + ' ' + res.summary + ' ' + JSON.stringify(res.assumptions)).toLowerCase();
      expect(fullText).toContain('bihar');
    });

    it('TEST: Tamil speaker in Maharashtra receives Maharashtra location intelligence', async () => {
      const res = await aiOrchestrator.handleUserMessage(
        'தொழில் தொடங்குவது எப்படி',
        'ta',
        { businessName: 'Tailoring & Garments', location: 'Palus, Sangli, Maharashtra', capital: 60000 },
        'test-tamil-mh-user'
      );

      expect(res.answer).toBeDefined();
      const fullText = (res.answer + ' ' + res.summary + ' ' + JSON.stringify(res.assumptions)).toLowerCase();
      expect(fullText).toContain('palus');
    });

    it('TEST: Telugu speaker in Andhra Pradesh receives AP location intelligence', async () => {
      const res = await aiOrchestrator.handleUserMessage(
        'వ్యాపారం ఎలా ప్రారంభించాలి',
        'te',
        { businessName: 'Mobile & Electronics Repair', location: 'Tenali, Guntur, Andhra Pradesh', capital: 100000 },
        'test-telugu-ap-user'
      );

      expect(res.answer).toBeDefined();
      const fullText = (res.answer + ' ' + res.summary + ' ' + JSON.stringify(res.assumptions)).toLowerCase();
      expect(fullText).toContain('tenali');
    });
  });
});
