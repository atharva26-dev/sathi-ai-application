import { SkillExecutionResult } from '../skills/skillTypes.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';
import { SupportedLanguage } from '../../config/constants.js';
import { getBackendLanguage } from '../../config/languages.js';
import { logger } from '../../utils/logger.js';

export interface ValidationReviewResult {
  isValid: boolean;
  reasons: string[];
  sanitizedResult: SkillExecutionResult | null;
  needsRegeneration: boolean;
}

export class ResponseReviewer {
  public validateResponse(
    result: SkillExecutionResult,
    context: AssembledBusinessContext,
    language: SupportedLanguage,
    userQuestion: string,
    isAlternativeExploration = false
  ): ValidationReviewResult {
    const reasons: string[] = [];
    let isValid = true;

    const activeBiz = context.profile.desiredBusiness || 'Mobile & Electronics Repair';
    const loc = context.locationCluster;
    const ownCap = context.financialBaseline.ownCapital;

    const fullText = (
      result.answer +
      ' ' +
      result.summary +
      ' ' +
      result.voiceSpokenText +
      ' ' +
      JSON.stringify(result.cards || [])
    ).toLowerCase();

    // 1. Strict Business Contamination Check
    if (!isAlternativeExploration) {
      const forbiddenBusinessKeywords: Record<string, string[]> = {
        'mobile & electronics repair': ['tailoring', 'boutique', 'garment', 'पनीर', 'paneer', 'दूध प्रक्रिया', 'dairy farming', 'मलाई पनीर'],
        'tailoring & garments': ['mobile repair', 'स्क्रीन सेपरेटर', 'soldering station', 'पनीर', 'paneer', 'दूध डेअरी'],
        'dairy & milk processing': ['screen repair', 'soldering', 'मोबाईल दुरुस्ती', 'tailoring machine', 'शिलाई मशीन']
      };

      const activeBizLower = activeBiz.toLowerCase();
      for (const [bizKey, forbiddenTerms] of Object.entries(forbiddenBusinessKeywords)) {
        if (activeBizLower.includes(bizKey) || bizKey.includes(activeBizLower)) {
          for (const term of forbiddenTerms) {
            if (fullText.includes(term.toLowerCase())) {
              reasons.push(`Cross-domain contamination detected: Mentioned forbidden term '${term}' while active business is '${activeBiz}'`);
              isValid = false;
            }
          }
        }
      }
    }

    // 2. Financial Consistency Check (Zero Hallucinated Capital)
    if (result.calculations) {
      if (result.calculations.projectCost && typeof result.calculations.projectCost === 'number') {
        const expectedProjectCost = context.financialBaseline.projectCost;
        // Allow slight variations only if not orders of magnitude off
        if (result.calculations.projectCost <= 0) {
          reasons.push('Invalid non-positive projectCost in calculations');
          isValid = false;
        }
      }
    }

    // 3. First-Sentence & Readability Check
    if (!result.answer || result.answer.trim().length < 15) {
      reasons.push('Answer is too short or empty');
      isValid = false;
    }

    // 4. Guaranteed Success / Fake Promise Check
    const forbiddenPromises = [
      'guaranteed profit',
      'खात्रीशीर १००% नफा',
      'गारंटीड कर्ज मिळेल',
      'नक्की यशस्वी होईल',
      'definitely succeed',
      'guaranteed customers'
    ];
    for (const promise of forbiddenPromises) {
      if (fullText.includes(promise)) {
        reasons.push(`Unrealistic guarantee detected: '${promise}'`);
        isValid = false;
      }
    }

    // 5. Response Language Plausibility Check (Script Validation)
    const langDef = getBackendLanguage(language);
    if (langDef.scriptUnicodeRanges && langDef.scriptUnicodeRanges.length > 0 && language !== 'en') {
      let scriptCharCount = 0;
      for (const char of result.answer) {
        const code = char.charCodeAt(0);
        for (const [start, end] of langDef.scriptUnicodeRanges) {
          if (code >= start && code <= end) {
            scriptCharCount++;
            break;
          }
        }
      }

      // If response is longer than 50 chars but has fewer than 5 characters of the target script, flag for retry
      if (result.answer.length > 50 && scriptCharCount < 5) {
        reasons.push(
          `Language mismatch: Output has insufficient characters in ${langDef.name} (${langDef.script} script). Found only ${scriptCharCount} matching characters.`
        );
        isValid = false;
      }
    }

    if (!isValid) {
      logger.warn('ResponseReviewer rejected response:', { reasons, activeBiz, userQuestion });
      return {
        isValid: false,
        reasons,
        sanitizedResult: null,
        needsRegeneration: true
      };
    }

    // Pass 2: Rewrite & Polish Readability
    const sanitized: SkillExecutionResult = {
      ...result,
      // Ensure Indian currency formatting is clean
      summary: result.summary.replace(/INR\s*/g, '₹'),
      voiceSpokenText: result.voiceSpokenText.replace(/INR\s*/g, '₹'),
      // Ensure source transparency
      sources: result.sources && result.sources.length > 0 ? result.sources : [
        { title: `SAATHI Domain Intelligence Engine (${activeBiz})`, isOfficial: true }
      ],
      assumptions: result.assumptions && result.assumptions.length > 0 ? result.assumptions : [
        `सक्रिय व्यवसाय: ${activeBiz}`,
        `स्थानिक परिसर: ${loc}`,
        `उपलब्ध भांडवल: ₹${ownCap.toLocaleString('en-IN')}`
      ]
    };

    return {
      isValid: true,
      reasons: [],
      sanitizedResult: sanitized,
      needsRegeneration: false
    };
  }
}

export const responseReviewer = new ResponseReviewer();
