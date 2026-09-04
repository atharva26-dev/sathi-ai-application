import { describe, it, expect } from '@jest/globals';
import { cleanAndFormatOutputText, responseReviewer } from '../src/ai/validation/responseReviewer.js';
import { aiOrchestrator } from '../src/ai/orchestrator.js';

describe('Chatbot Clean Output & 4-Pass Verification Engine', () => {
  describe('Unit: cleanAndFormatOutputText()', () => {
    it('removes markdown headers (##, ###) and converts to clean section headers with colons', () => {
      const input = `## Short Answer\nThis is the direct response.\n\n### Why this matters\nImportant rationale here.`;
      const cleaned = cleanAndFormatOutputText(input);

      expect(cleaned).not.toContain('##');
      expect(cleaned).not.toContain('###');
      expect(cleaned).toContain('Short Answer:');
      expect(cleaned).toContain('Why this matters:');
    });

    it('removes bold and italic syntax (**bold**, *italic*, __bold__) without leaving asterisks', () => {
      const input = `The **total cost** is ₹50,000 and the *loan* is **₹45,000**. Never risk __personal savings__.`;
      const cleaned = cleanAndFormatOutputText(input);

      expect(cleaned).not.toContain('**');
      expect(cleaned).not.toContain('*');
      expect(cleaned).not.toContain('__');
      expect(cleaned).toContain('The total cost is ₹50,000 and the loan is ₹45,000. Never risk personal savings.');
    });

    it('converts markdown list symbols (*, -, +) into neat bullet points (• )', () => {
      const input = `Key takeaways:\n* Verify market gap\n- Check local competition\n+ Keep cash reserve`;
      const cleaned = cleanAndFormatOutputText(input);

      expect(cleaned).toContain('• Verify market gap');
      expect(cleaned).toContain('• Check local competition');
      expect(cleaned).toContain('• Keep cash reserve');
      expect(cleaned).not.toContain('* Verify');
      expect(cleaned).not.toContain('- Check');
      expect(cleaned).not.toContain('+ Keep');
    });

    it('removes backticks, code blocks, divider bars, and messy symbols', () => {
      const input = `Here is advice:\n---\nUse \`PMEGP Scheme\` for support.\n| col1 | col2 |\n`;
      const cleaned = cleanAndFormatOutputText(input);

      expect(cleaned).not.toContain('---');
      expect(cleaned).not.toContain('`');
      expect(cleaned).not.toContain('| col1 |');
      expect(cleaned).toContain('Use PMEGP Scheme for support.');
    });

    it('cleans and formats Marathi and Hindi responses cleanly with proper bullets and colons', () => {
      const marathiInput = `## 🧭 योग्य व्यवसाय निवडण्यासाठी ३ महत्त्वाचे प्रश्न\n\n1. **स्वतःचे भांडवल (Available Capital):** तुम्ही किती गुंतवू शकता?\n* ग्राहक गरज तपासा\n* उधारी टाळा`;
      const cleaned = cleanAndFormatOutputText(marathiInput);

      expect(cleaned).not.toContain('##');
      expect(cleaned).not.toContain('**');
      expect(cleaned).not.toContain('* ');
      expect(cleaned).toContain('योग्य व्यवसाय निवडण्यासाठी ३ महत्त्वाचे प्रश्न:');
      expect(cleaned).toContain('1. स्वतःचे भांडवल (Available Capital): तुम्ही किती गुंतवू शकता?');
      expect(cleaned).toContain('• ग्राहक गरज तपासा');
      expect(cleaned).toContain('• उधारी टाळा');
    });
  });

  describe('4-Pass Verification Engine in ResponseReviewer', () => {
    const dummyContext: any = {
      profile: { desiredBusiness: 'Mobile & Electronics Repair', fullName: 'Ramesh Patil' },
      locationCluster: 'Palus, Sangli',
      financialBaseline: {
        ownCapital: 50000,
        projectCost: 500000,
        loanComponent: 450000,
        estimatedSubsidy: 175000,
        regularMonthlyEMI: 4800,
        moratoriumMonthlyPayment: 2100,
        breakEvenDailyUnits: 5,
        requiredWorkingCapital: 150000
      },
      businessArchetype: {
        category: 'electronics_repair',
        unitName: { en: 'repair jobs', mr: 'दुरुस्ती कामे', hi: 'मरम्मत कार्य' }
      }
    };

    it('Pass 1: Rejects responses that contain cross-domain business contamination', () => {
      const contaminatedResult: any = {
        answer: 'You should buy high quality paneer and sell fresh milk in Palus.',
        summary: 'Dairy advice',
        voiceSpokenText: 'Sell paneer',
        cards: []
      };

      const review = responseReviewer.validateResponse(
        contaminatedResult,
        dummyContext,
        'en',
        'how to start',
        false
      );

      expect(review.isValid).toBe(false);
      expect(review.reasons.some((r) => r.includes('Pass 1') || r.includes('Contamination'))).toBe(true);
    });

    it('Pass 2: Rejects responses that are too short or have language script mismatch', () => {
      const shortResult: any = {
        answer: 'Hi there',
        summary: 'Hi',
        voiceSpokenText: 'Hi'
      };

      const review = responseReviewer.validateResponse(shortResult, dummyContext, 'en', 'hello', false);
      expect(review.isValid).toBe(false);
      expect(review.reasons.some((r) => r.includes('Pass 2') || r.includes('too short'))).toBe(true);
    });

    it('Pass 4: Rejects responses with fake profit guarantees or unrealistic claims', () => {
      const fakePromiseResult: any = {
        answer: 'Start mobile repair and you will get guaranteed profit of 1 lakh every month.',
        summary: 'Guaranteed success',
        voiceSpokenText: 'Guaranteed profit'
      };

      const review = responseReviewer.validateResponse(
        fakePromiseResult,
        dummyContext,
        'en',
        'profit',
        false
      );
      expect(review.isValid).toBe(false);
      expect(review.reasons.some((r) => r.includes('Pass 4') || r.includes('guarantee'))).toBe(true);
    });

    it('Successfully validates and sanitizes a valid response into clean bullet points', () => {
      const validRaw: any = {
        answer: `## Short Answer\nMobile repair is viable in Palus.\n\n## Key Guidance:\n* Invest in quality soldering station\n* Avoid unverified credit\n* Maintain daily cash register`,
        summary: 'Advice on **Mobile Repair** in INR 50000 budget',
        voiceSpokenText: 'Mobile repair in Palus with INR 50000.',
        recommendations: ['**Set fixed markup**', '*Keep cash reserve*'],
        calculations: { projectCost: 500000 }
      };

      const review = responseReviewer.validateResponse(validRaw, dummyContext, 'en', 'how to start', false);

      expect(review.isValid).toBe(true);
      expect(review.sanitizedResult).not.toBeNull();
      expect(review.sanitizedResult!.answer).not.toContain('##');
      expect(review.sanitizedResult!.answer).not.toContain('* Invest');
      expect(review.sanitizedResult!.answer).toContain('• Invest in quality soldering station');
      expect(review.sanitizedResult!.summary).not.toContain('**');
      expect(review.sanitizedResult!.summary).toContain('₹50000');
      expect(review.sanitizedResult!.recommendations![0]).toBe('Set fixed markup');
      expect(review.sanitizedResult!.recommendations![1]).toBe('Keep cash reserve');
    });
  });

  describe('End-to-End Orchestrator Output Cleanliness', () => {
    it('returns 100% clean responses with ZERO raw markdown symbols (no **, no ##) for Marathi query', async () => {
      const res = await aiOrchestrator.handleUserMessage(
        'उधारी कशी नियंत्रित करावी?',
        'mr',
        { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli', capital: 100000 },
        'test-clean-mr-user'
      );

      expect(res.answer).not.toContain('##');
      expect(res.answer).not.toContain('**');
      expect(res.summary).not.toContain('**');
      expect(res.voiceSpokenText).not.toContain('**');
      // Should have clean bullet points or numbered steps
      expect(res.answer).toMatch(/[•\d.]/);
    });

    it('returns 100% clean responses with ZERO raw markdown symbols (no **, no ##) for English query', async () => {
      const res = await aiOrchestrator.handleUserMessage(
        'how to start a business',
        'en',
        { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli', capital: 100000 },
        'test-clean-en-user'
      );

      expect(res.answer).not.toContain('##');
      expect(res.answer).not.toContain('**');
      expect(res.summary).not.toContain('**');
      expect(res.voiceSpokenText).not.toContain('**');
    });

    it('returns 100% clean responses with ZERO raw markdown symbols for Hindi query', async () => {
      const res = await aiOrchestrator.handleUserMessage(
        'व्यापार कैसे शुरू करें?',
        'hi',
        { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli', capital: 100000 },
        'test-clean-hi-user'
      );

      expect(res.answer).not.toContain('##');
      expect(res.answer).not.toContain('**');
      expect(res.summary).not.toContain('**');
      expect(res.voiceSpokenText).not.toContain('**');
    });
  });
});
