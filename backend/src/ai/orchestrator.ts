import { SupportedLanguage } from '../config/constants.js';
import { contextEngine, AssembledBusinessContext } from './context/contextEngine.js';
import { geminiProvider } from './providers/geminiProvider.js';
import { detectIntentAndSwitch } from './intentDetector.js';
import { responseReviewer } from './validation/responseReviewer.js';
import { SkillHandler, SkillExecutionResult, StructuredCardPayload } from './skills/skillTypes.js';

// Import specialized skills
import { FinancialManagerSkill } from './skills/financialManagerSkill.js';
import { BusinessAdvisorSkill } from './skills/businessAdvisorSkill.js';
import { MarketAnalystSkill } from './skills/marketAnalystSkill.js';
import { SchemeAdvisorSkill } from './skills/schemeAdvisorSkill.js';
import { MarketingManagerSkill } from './skills/marketingManagerSkill.js';
import { RiskManagerSkill } from './skills/riskManagerSkill.js';
import { GrowthMentorSkill } from './skills/growthMentorSkill.js';
import { DistressManagerSkill } from './skills/distressManagerSkill.js';

export { StructuredCardPayload };
export interface OrchestratorResponse extends SkillExecutionResult {}

export class AiOrchestrator {
  private skills: SkillHandler[];

  constructor() {
    this.skills = [
      new DistressManagerSkill(),
      new FinancialManagerSkill(),
      new BusinessAdvisorSkill(),
      new RiskManagerSkill(),
      new SchemeAdvisorSkill(),
      new MarketAnalystSkill(),
      new MarketingManagerSkill(),
      new GrowthMentorSkill()
    ];
  }

  /**
   * Main conversational entry point
   */
  public async handleUserMessage(
    message: string,
    language: SupportedLanguage = 'mr',
    userContext?: {
      capital?: number;
      location?: string;
      businessName?: string;
    },
    userId = '00000000-0000-0000-0000-000000000001'
  ): Promise<OrchestratorResponse> {
    // 1. Initial intent and parameter extraction
    const initialBiz = userContext?.businessName || 'Mobile & Electronics Repair';
    const intentResult = detectIntentAndSwitch(message, initialBiz);

    // 2. Assemble structured canonical context with parameter overrides
    const effectiveOverrides = {
      ...userContext,
      capital: intentResult.extractedCapital !== undefined ? intentResult.extractedCapital : userContext?.capital,
      businessName: intentResult.isSwitchRequested && intentResult.targetSwitchBusiness ? intentResult.targetSwitchBusiness : (userContext?.businessName)
    };

    const context: AssembledBusinessContext = await contextEngine.getContextForUser(userId, effectiveOverrides);
    const activeBiz = context.profile.desiredBusiness || 'Mobile & Electronics Repair';

    // 3. Update conversation memory
    contextEngine.updateMemory(userId, {
      lastIntent: intentResult.intent,
      selectedBusiness: activeBiz
    });

    // 4. Attempt primary Gemini 2-Pass Reasoning if available
    if (geminiProvider.isAvailable()) {
      const maxAttempts = 2;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const geminiResult = await geminiProvider.generateAdvice(
          message,
          language,
          context,
          intentResult.isAlternativeExploration
        );

        if (geminiResult && geminiResult.answer) {
          // Pass 2: Review and validate against Active Business & Location Lock
          const review = responseReviewer.validateResponse(
            geminiResult,
            context,
            language,
            message,
            intentResult.isAlternativeExploration
          );

          if (review.isValid && review.sanitizedResult) {
            return this.applySafetyAndContractGuards(review.sanitizedResult, context);
          }
        }
      }
    }

    // 5. Specialized Deterministic Domain Expert Skills
    for (const skill of this.skills) {
      if (skill.canHandle(message, context)) {
        const rawResult = await skill.execute(message, language, context);
        const review = responseReviewer.validateResponse(
          rawResult,
          context,
          language,
          message,
          intentResult.isAlternativeExploration
        );

        if (review.isValid && review.sanitizedResult) {
          return this.applySafetyAndContractGuards(review.sanitizedResult, context);
        }
      }
    }

    // 6. Default fallback to Master Business Advisor Skill
    const defaultSkill = new BusinessAdvisorSkill();
    const fallbackRaw = await defaultSkill.execute(message, language, context);
    const fallbackReview = responseReviewer.validateResponse(
      fallbackRaw,
      context,
      language,
      message,
      intentResult.isAlternativeExploration
    );

    return this.applySafetyAndContractGuards(
      fallbackReview.sanitizedResult || fallbackRaw,
      context
    );
  }

  /**
   * Post-processing safety filter and contract compliance check
   */
  private applySafetyAndContractGuards(
    result: SkillExecutionResult,
    context: AssembledBusinessContext
  ): OrchestratorResponse {
    const activeBiz = context.profile.desiredBusiness || 'Mobile & Electronics Repair';
    const loc = context.locationCluster;

    // Ensure authoritative calculations are embedded
    if (!result.calculations) {
      result.calculations = {
        projectCost: context.financialBaseline.projectCost,
        loanComponent: context.financialBaseline.loanComponent,
        estimatedSubsidy: context.financialBaseline.estimatedSubsidy,
        regularMonthlyEMI: context.financialBaseline.regularMonthlyEMI
      };
    }

    // Dynamic Business-Specific Assumptions
    if (!result.assumptions || result.assumptions.length === 0) {
      result.assumptions = [
        `सक्रिय व्यवसाय: ${activeBiz}`,
        `स्थानिक परिसर: ${loc}`,
        `१०% स्वतःचे भांडवल इक्विटी गृहीतक`
      ];
    }

    // Guarantee source transparency
    if (!result.sources || result.sources.length === 0) {
      result.sources = [
        { title: `SAATHI Domain Intelligence Engine (${activeBiz})`, isOfficial: true }
      ];
    }

    return result;
  }
}

export const aiOrchestrator = new AiOrchestrator();
