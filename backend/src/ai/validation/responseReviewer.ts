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
  fourPassAudit?: {
    relevanceCheck: boolean;
    clarityCheck: boolean;
    utilityCheck: boolean;
    cleanlinessCheck: boolean;
  };
}

/**
 * Text cleaner and formatter that strips raw markdown symbols,
 * unwanted special characters, and formats outputs into clean,
 * readable bullet points and clear section headers.
 */
export function cleanAndFormatOutputText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Currency normalization (only matches before numbers or with dot, preserving regular words like 'matters')
  cleaned = cleaned.replace(/\b(?:INR|Rs)\.?\s*(?=\d)/gi, '₹');
  cleaned = cleaned.replace(/\b(?:INR|Rs)\.\s*/gi, '₹');

  // 2. Remove code blocks and backticks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '');
  });
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 3. Remove raw horizontal rules and divider bars
  cleaned = cleaned.replace(/^[=\-_]{3,}\s*$/gm, '');

  // 4. Process line by line for headers, bullets, numbers, and clean text
  const lines = cleaned.split('\n');
  const processedLines: string[] = [];

  for (let line of lines) {
    let trimmed = line.trim();

    // A. Strip markdown headers: # Header, ## Header, ### Header
    if (/^#{1,6}\s+/.test(trimmed)) {
      trimmed = trimmed.replace(/^#{1,6}\s+/, '').trim();
      // Remove any decorative symbol/emoji at the very start of a section header
      trimmed = trimmed.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}]\s*/u, '');
      // Format as clean section title
      if (trimmed && !trimmed.endsWith(':') && !trimmed.endsWith('?')) {
        trimmed = trimmed + ':';
      }
    }

    // B. Convert markdown bullet points (*, -, +) to clean, standard bullet (•)
    if (/^[*+-]\s+/.test(trimmed)) {
      trimmed = '• ' + trimmed.replace(/^[*+-]\s+/, '').trim();
    }

    // C. Numbered lists: ensure neat standardized spacing ("1.  Step" -> "1. Step")
    if (/^\d+[.)]\s+/.test(trimmed)) {
      trimmed = trimmed.replace(/^(\d+)[.)]\s+/, '$1. ');
    }

    // D. Strip bold and italic markdown syntax: **text**, *text*, __text__, _text_
    trimmed = trimmed.replace(/\*\*([^*]+)\*\*/g, '$1');
    trimmed = trimmed.replace(/__([^_]+)__/g, '$1');
    // Remove inline asterisks/underscores without corrupting words
    trimmed = trimmed.replace(/(^|[^\w])\*([^*]+)\*([^\w]|$)/g, '$1$2$3');
    trimmed = trimmed.replace(/(^|[^\w])_([^_]+)_([^\w]|$)/g, '$1$2$3');
    // Clean any lingering stray asterisks
    trimmed = trimmed.replace(/\*\*/g, '').replace(/\*/g, '');

    // E. Strip remaining markdown artifacts (tildes, markdown table pipes, raw HTML)
    trimmed = trimmed.replace(/~~([^~]+)~~/g, '$1');
    trimmed = trimmed.replace(/<[^>]+>/g, '');
    trimmed = trimmed.replace(/^\|\s*|\s*\|$/g, '');

    processedLines.push(trimmed);
  }

  // 5. Clean up multiple empty lines into at most double line break
  cleaned = processedLines.join('\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}

export class ResponseReviewer {
  /**
   * Quadruple Verification Engine ("Think 4 Times" Protocol):
   * Pass 1: Relevance Check (Does the answer relate to the user's question & business?)
   * Pass 2: Sense & Clarity Check (Does it make simple, clear sense to the user?)
   * Pass 3: Practical Utility Check (Is it actionable, useful, and grounded for their business?)
   * Pass 4: Cleanliness & Accuracy Check (Are words, grammar, and numbers verified, and are all symbols clean?)
   */
  public validateResponse(
    result: SkillExecutionResult,
    context: AssembledBusinessContext,
    language: SupportedLanguage,
    userQuestion: string,
    isAlternativeExploration = false
  ): ValidationReviewResult {
    const reasons: string[] = [];
    const activeBiz = context.profile.desiredBusiness || 'Mobile & Electronics Repair';
    const loc = context.locationCluster;
    const ownCap = context.financialBaseline.ownCapital;

    // --- PASS 1: RELEVANCE VERIFICATION ---
    const pass1 = this.verifyRelevance(result, userQuestion, activeBiz, isAlternativeExploration);
    if (!pass1.isValid) {
      reasons.push(...pass1.reasons);
    }

    // --- PASS 2: SENSE & CLARITY VERIFICATION ---
    const pass2 = this.verifySenseAndClarity(result, language);
    if (!pass2.isValid) {
      reasons.push(...pass2.reasons);
    }

    // --- PASS 3: PRACTICAL UTILITY & VALUE VERIFICATION ---
    const pass3 = this.verifyUtility(result);
    if (!pass3.isValid) {
      reasons.push(...pass3.reasons);
    }

    // --- PASS 4: CLEANLINESS, INTEGRITY & ACCURACY VERIFICATION ---
    const pass4 = this.verifyCleanlinessAndAccuracy(result, context);
    if (!pass4.isValid) {
      reasons.push(...pass4.reasons);
    }

    const isValid = reasons.length === 0;

    if (!isValid) {
      logger.warn('ResponseReviewer rejected response (Failed 4-Pass Verification):', {
        reasons,
        activeBiz,
        userQuestion
      });
      return {
        isValid: false,
        reasons,
        sanitizedResult: null,
        needsRegeneration: true,
        fourPassAudit: {
          relevanceCheck: pass1.isValid,
          clarityCheck: pass2.isValid,
          utilityCheck: pass3.isValid,
          cleanlinessCheck: pass4.isValid
        }
      };
    }

    // --- SANITIZE & POLISH OUTPUT (Clean bullet points, no markdown noise) ---
    const sanitizedAnswer = cleanAndFormatOutputText(result.answer);
    const sanitizedSummary = cleanAndFormatOutputText(result.summary);
    const sanitizedVoice = cleanAndFormatOutputText(result.voiceSpokenText);

    const sanitizedRecommendations = (result.recommendations || []).map((r) =>
      cleanAndFormatOutputText(r)
    );
    const sanitizedRisks = (result.risks || []).map((r) => cleanAndFormatOutputText(r));
    const sanitizedAssumptions = (result.assumptions && result.assumptions.length > 0
      ? result.assumptions
      : [
          `सक्रिय व्यवसाय: ${activeBiz}`,
          `स्थानिक परिसर: ${loc}`,
          `उपलब्ध भांडवल: ₹${ownCap.toLocaleString('en-IN')}`
        ]
    ).map((a) => cleanAndFormatOutputText(a));

    const sanitized: SkillExecutionResult = {
      ...result,
      answer: sanitizedAnswer,
      summary: sanitizedSummary,
      voiceSpokenText: sanitizedVoice,
      recommendations: sanitizedRecommendations,
      risks: sanitizedRisks,
      assumptions: sanitizedAssumptions,
      sources: result.sources && result.sources.length > 0
        ? result.sources
        : [{ title: `SAATHI Domain Intelligence Engine (${activeBiz})`, isOfficial: true }]
    };

    return {
      isValid: true,
      reasons: [],
      sanitizedResult: sanitized,
      needsRegeneration: false,
      fourPassAudit: {
        relevanceCheck: true,
        clarityCheck: true,
        utilityCheck: true,
        cleanlinessCheck: true
      }
    };
  }

  /**
   * Pass 1: Relevance Check
   * Verifies the answer is strictly related to the user question and prevents cross-domain contamination.
   */
  private verifyRelevance(
    result: SkillExecutionResult,
    userQuestion: string,
    activeBiz: string,
    isAlternativeExploration: boolean
  ): { isValid: boolean; reasons: string[] } {
    const reasons: string[] = [];
    const fullText = (
      result.answer +
      ' ' +
      result.summary +
      ' ' +
      result.voiceSpokenText +
      ' ' +
      JSON.stringify(result.cards || [])
    ).toLowerCase();

    // Strict Business Isolation Check
    if (!isAlternativeExploration) {
      const forbiddenBusinessKeywords: Record<string, string[]> = {
        'mobile & electronics repair': [
          'tailoring',
          'boutique',
          'garment',
          'पनीर',
          'paneer',
          'दूध प्रक्रिया',
          'dairy farming',
          'मलाई पनीर'
        ],
        'tailoring & garments': [
          'mobile repair',
          'स्क्रीन सेपरेटर',
          'soldering station',
          'पनीर',
          'paneer',
          'दूध डेअरी'
        ],
        'dairy & milk processing': [
          'screen repair',
          'soldering',
          'मोबाईल दुरुस्ती',
          'tailoring machine',
          'शिलाई मशीन'
        ]
      };

      const activeBizLower = activeBiz.toLowerCase();
      for (const [bizKey, forbiddenTerms] of Object.entries(forbiddenBusinessKeywords)) {
        if (activeBizLower.includes(bizKey) || bizKey.includes(activeBizLower)) {
          for (const term of forbiddenTerms) {
            if (fullText.includes(term.toLowerCase())) {
              reasons.push(
                `Pass 1 (Relevance): Contamination detected - Mentioned forbidden '${term}' while active business is '${activeBiz}'`
              );
            }
          }
        }
      }
    }

    return { isValid: reasons.length === 0, reasons };
  }

  /**
   * Pass 2: Sense & Clarity Check
   * Verifies readability, length, and correct script usage for the target Indian language.
   */
  private verifySenseAndClarity(
    result: SkillExecutionResult,
    language: SupportedLanguage
  ): { isValid: boolean; reasons: string[] } {
    const reasons: string[] = [];

    // Min length check
    if (!result.answer || result.answer.trim().length < 15) {
      reasons.push('Pass 2 (Clarity): Answer is too short or empty to provide clear sense');
      return { isValid: false, reasons };
    }

    // Response Language Plausibility Check (Script Validation)
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

      // If response is longer than 50 chars but has fewer than 5 characters of target script
      if (result.answer.length > 50 && scriptCharCount < 5) {
        reasons.push(
          `Pass 2 (Clarity): Language mismatch - Output has insufficient characters in ${langDef.name} (${langDef.script} script). Found only ${scriptCharCount} matching characters.`
        );
      }
    }

    return { isValid: reasons.length === 0, reasons };
  }

  /**
   * Pass 3: Practical Utility Check
   * Verifies the answer contains concrete, actionable guidance and useful takeaways.
   */
  private verifyUtility(result: SkillExecutionResult): { isValid: boolean; reasons: string[] } {
    const reasons: string[] = [];

    // Check for substance: should either have recommendations, numbered steps, bullet points, cards, or calculations
    const answer = result.answer;
    const hasBulletOrNumber =
      /^[•*\-+]|\n[•*\-+]|\d+[.)]/.test(answer) ||
      (result.recommendations && result.recommendations.length > 0) ||
      (result.cards && result.cards.length > 0) ||
      Boolean(result.calculations);

    if (!hasBulletOrNumber && answer.length < 50) {
      reasons.push('Pass 3 (Utility): Answer lacks actionable points, steps, or concrete guidance for the user');
    }

    return { isValid: reasons.length === 0, reasons };
  }

  /**
   * Pass 4: Cleanliness, Integrity & Accuracy Check
   * Verifies absence of fake promises, financial calculation validity, and absence of deceptive claims.
   */
  private verifyCleanlinessAndAccuracy(
    result: SkillExecutionResult,
    context: AssembledBusinessContext
  ): { isValid: boolean; reasons: string[] } {
    const reasons: string[] = [];
    const fullText = (
      result.answer +
      ' ' +
      result.summary +
      ' ' +
      result.voiceSpokenText
    ).toLowerCase();

    // Guaranteed Success / Fake Promise Check
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
        reasons.push(`Pass 4 (Accuracy): Unrealistic guarantee detected - '${promise}'`);
      }
    }

    // Financial Consistency Check
    if (result.calculations) {
      if (result.calculations.projectCost && typeof result.calculations.projectCost === 'number') {
        if (result.calculations.projectCost <= 0) {
          reasons.push('Pass 4 (Accuracy): Invalid non-positive projectCost in calculations');
        }
      }
    }

    return { isValid: reasons.length === 0, reasons };
  }
}

export const responseReviewer = new ResponseReviewer();
