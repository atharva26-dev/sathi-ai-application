import { SkillExecutionResult } from '../skills/skillTypes.js';
import { AssembledBusinessContext } from '../context/contextEngine.js';
import { SupportedLanguage } from '../../config/constants.js';

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  sanitizedResult?: SkillExecutionResult;
}

export class RelevanceValidator {
  /**
   * Check whether the generated output violates domain isolation or context rules
   */
  public validate(
    result: SkillExecutionResult,
    context: AssembledBusinessContext,
    language: SupportedLanguage,
    isAlternativeExploration = false
  ): ValidationResult {
    if (!result || !result.answer) {
      return { isValid: false, reason: 'Empty answer generated' };
    }

    const activeBiz = (context.profile.desiredBusiness || '').toLowerCase();
    const fullText = (
      result.answer +
      ' ' +
      result.summary +
      ' ' +
      JSON.stringify(result.cards) +
      ' ' +
      result.recommendations.join(' ')
    ).toLowerCase();

    // If user is explicitly exploring alternatives, skip cross-domain blocking
    if (isAlternativeExploration) {
      return { isValid: true, sanitizedResult: result };
    }

    // 1. Mobile Repair Domain Isolation
    if (activeBiz.includes('mobile') || activeBiz.includes('phone') || activeBiz.includes('मोबाईल') || activeBiz.includes('electronics')) {
      const forbiddenTokens = ['tailoring', 'टेलरिंग', 'ब्लाऊज', 'गारमेंट', 'boutique', 'शिलाई', 'paneer', 'पनीर', 'मलाई', 'दूध प्रक्रिया', 'dairy processing', 'दुग्ध'];
      for (const token of forbiddenTokens) {
        if (fullText.includes(token)) {
          return {
            isValid: false,
            reason: `Cross-domain contamination detected for Mobile Repair: found forbidden token "${token}"`
          };
        }
      }
    }

    // 2. Tailoring Domain Isolation
    if (activeBiz.includes('tailor') || activeBiz.includes('टेलरिंग') || activeBiz.includes('शिलाई') || activeBiz.includes('garment')) {
      const forbiddenTokens = ['mobile repair', 'मोबाईल दुरुस्ती', 'स्क्रीन सेपरेटर', 'smd सोल्डरिंग', 'paneer', 'पनीर', 'मलाई', 'दूध'];
      for (const token of forbiddenTokens) {
        if (fullText.includes(token)) {
          return {
            isValid: false,
            reason: `Cross-domain contamination detected for Tailoring: found forbidden token "${token}"`
          };
        }
      }
    }

    // 3. Dairy Domain Isolation
    if (activeBiz.includes('dairy') || activeBiz.includes('दूध') || activeBiz.includes('पनीर') || activeBiz.includes('दुग्ध') || activeBiz.includes('milk')) {
      const forbiddenTokens = ['mobile repair', 'मोबाईल दुरुस्ती', 'सिलाई', 'tailoring', 'ब्लाऊज'];
      for (const token of forbiddenTokens) {
        if (fullText.includes(token)) {
          return {
            isValid: false,
            reason: `Cross-domain contamination detected for Dairy: found forbidden token "${token}"`
          };
        }
      }
    }

    // 4. Card Title Isolation Check
    if (result.cards && result.cards.length > 0) {
      for (const card of result.cards) {
        const cardTitle = (card.title || '').toLowerCase();
        if (
          (activeBiz.includes('mobile') || activeBiz.includes('मोबाईल')) &&
          (cardTitle.includes('tailor') || cardTitle.includes('शिलाई') || cardTitle.includes('टेलरिंग') || cardTitle.includes('paneer') || cardTitle.includes('पनीर'))
        ) {
          return {
            isValid: false,
            reason: `Card title "${card.title}" violates active business lock for Mobile Repair`
          };
        }
      }
    }

    return { isValid: true, sanitizedResult: result };
  }
}

export const relevanceValidator = new RelevanceValidator();
