import { describe, it, expect, jest } from '@jest/globals';
import { SUPPORTED_LANGUAGES } from '../src/config/constants.js';
import { BACKEND_LANGUAGES, getBackendLanguage } from '../src/config/languages.js';
import { responseReviewer } from '../src/ai/validation/responseReviewer.js';
import { AssembledBusinessContext } from '../src/ai/context/contextEngine.js';
import { SkillExecutionResult } from '../src/ai/skills/skillTypes.js';
import { aiOrchestrator } from '../src/ai/orchestrator.js';

jest.setTimeout(30000);

describe('SAATHI Master Language System Test Suite (English, Hindi, Marathi Focused)', () => {
  // =========================================================================
  // 1. FOCUSED LANGUAGES CATALOG COVERAGE
  // =========================================================================
  describe('Focused Languages (en, hi, mr) Catalog Integrity', () => {
    it('Should contain exactly 3 supported languages in the official catalog', () => {
      expect(SUPPORTED_LANGUAGES.length).toBe(3);
      expect(BACKEND_LANGUAGES.length).toBe(3);
    });

    it('Should verify English, Hindi, and Marathi are properly cataloged', () => {
      const coreLanguages = ['en', 'hi', 'mr'] as const;
      for (const code of coreLanguages) {
        expect(SUPPORTED_LANGUAGES).toContain(code);
        const def = getBackendLanguage(code);
        expect(def.code).toBe(code);
        expect(def.name).toBeDefined();
        expect(def.nativeName).toBeDefined();
        expect(def.script).toBeDefined();
        expect(def.speechLocale).toBeDefined();
        expect(def.direction).toBe('ltr');
      }
    });
  });

  // =========================================================================
  // 2. AI ORCHESTRATOR MULTILINGUAL EXECUTION
  // =========================================================================
  describe('AI Orchestrator Execution for en, hi, mr', () => {
    const testLanguages = ['mr', 'hi', 'en'] as const;

    for (const lang of testLanguages) {
      it(`Should execute AI advisory for language "${lang}" without errors`, async () => {
        const query =
          lang === 'mr'
            ? 'व्यवसाय कसा सुरू करावा'
            : lang === 'hi'
            ? 'व्यापार कैसे शुरू करें'
            : 'how to start a business';

        const res = await aiOrchestrator.handleUserMessage(
          query,
          lang,
          {
            businessName: 'Tailoring & Garments',
            capital: 50000,
            location: 'Kundal, Sangli, Maharashtra'
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

    it('Should PASS when Marathi response contains genuine Devanagari script', () => {
      const marathiResult: SkillExecutionResult = {
        ...baseResult,
        answer: 'शिलाई व्यवसाय सुरू करण्यासाठी ₹५०,००० भांडवलाची आवश्यकता आहे. सुरुवातीला २ शिलाई मशिन खरेदी करा.'
      };
      const review = responseReviewer.validateResponse(marathiResult, mockContext, 'mr', 'व्यवसाय कसा सुरू करावा');
      expect(review.isValid).toBe(true);
    });

    it('Should PASS when Hindi response contains genuine Devanagari script', () => {
      const hindiResult: SkillExecutionResult = {
        ...baseResult,
        answer: 'सिलाई व्यवसाय शुरू करने के लिए ₹50,000 की पूंजी की आवश्यकता होगी। शुरुआत में दो मशीनें खरीदें।'
      };
      const review = responseReviewer.validateResponse(hindiResult, mockContext, 'hi', 'व्यापार कैसे शुरू करें');
      expect(review.isValid).toBe(true);
    });

    it('Should REJECT when Marathi response is primarily English with zero Devanagari script', () => {
      const englishResult: SkillExecutionResult = {
        ...baseResult,
        answer: 'You can start this tailoring business with fifty thousand rupees by buying two machines.'
      };
      const review = responseReviewer.validateResponse(englishResult, mockContext, 'mr', 'व्यवसाय कसा सुरू करावा');
      expect(review.isValid).toBe(false);
      expect(review.reasons.some((r) => r.includes('Language mismatch'))).toBe(true);
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

    it('TEST: Hindi speaker in Maharashtra receives Maharashtra location intelligence', async () => {
      const res = await aiOrchestrator.handleUserMessage(
        'व्यापार कैसे शुरू करें',
        'hi',
        { businessName: 'Tailoring & Garments', location: 'Palus, Sangli, Maharashtra', capital: 60000 },
        'test-hindi-mh-user'
      );

      expect(res.answer).toBeDefined();
      const fullText = (res.answer + ' ' + res.summary + ' ' + JSON.stringify(res.assumptions)).toLowerCase();
      expect(fullText).toContain('palus');
    });

    it('TEST: English speaker in Maharashtra receives Maharashtra location intelligence', async () => {
      const res = await aiOrchestrator.handleUserMessage(
        'how to start a business',
        'en',
        { businessName: 'Mobile & Electronics Repair', location: 'Kundal, Sangli, Maharashtra', capital: 100000 },
        'test-en-mh-user'
      );

      expect(res.answer).toBeDefined();
      const fullText = (res.answer + ' ' + res.summary + ' ' + JSON.stringify(res.assumptions)).toLowerCase();
      expect(fullText).toContain('kundal');
    });
  });
});
