import { SupportedLanguage } from '../config/constants.js';
import { contextEngine, AssembledBusinessContext } from './context/contextEngine.js';
import { geminiProvider } from './providers/geminiProvider.js';
import { detectIntentAndSwitch } from './intentDetector.js';
import { responseReviewer, cleanAndFormatOutputText } from './validation/responseReviewer.js';
import { SkillHandler, SkillExecutionResult, StructuredCardPayload } from './skills/skillTypes.js';

import { villageBusinessPipeline } from './pipeline/villageBusinessPipeline.js';

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
      riskAppetite?: 'CONSERVATIVE' | 'MODERATE' | 'GROWTH';
      liveAreaContext?: {
        competitorCount?: number;
        localObstacles?: string;
        dynamicAnswers?: Array<{ question: string; answer: string }>;
      };
    },
    userId: string = '00000000-0000-0000-0000-000000000001'
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

    // 3.5 Check if query is village viability / 14-step pipeline request
    const qLower = message.toLowerCase();
    const isExplicitPipeline =
      qLower.includes('vrs') ||
      qLower.includes('bvms') ||
      qLower.includes('readiness') ||
      qLower.includes('तयारी गुणांक') ||
      qLower.includes('व्यवहार्यता गुणांक') ||
      qLower.includes('viability score') ||
      qLower.includes('गाव तयारी');

    const isVillageRecommendation =
      (qLower.includes('गाव') || qLower.includes('गावा') || qLower.includes('village')) &&
      (qLower.includes('कोणता व्यवसाय') ||
        qLower.includes('व्यवसाय निवडावा') ||
        qLower.includes('what business') ||
        qLower.includes('which business') ||
        qLower.includes('best business') ||
        qLower.includes('recommend business'));

    const isVillagePipelineQuery = isExplicitPipeline || isVillageRecommendation;

    if (isVillagePipelineQuery) {
      try {
        const vHint =
          context.localEvidencePackage?.villageContext?.villageName ||
          (userContext?.location ? userContext.location.split(',')[0].trim() : undefined) ||
          context.profile.village ||
          'Kundal';
        const dHint =
          context.localEvidencePackage?.villageContext?.district ||
          context.profile.district ||
          'Sangli';

        const pipelineOutput = await villageBusinessPipeline.execute(message, language, {
          villageHint: vHint,
          districtHint: dHint,
          userCapital: context.financialBaseline.ownCapital,
          riskAppetite: userContext?.riskAppetite || (context.profile as any)?.riskAppetite || 'MODERATE',
          liveAreaContext: userContext?.liveAreaContext
        });

        if (pipelineOutput && pipelineOutput.rankedBusinesses.length > 0) {
          const topBiz = pipelineOutput.rankedBusinesses[0];
          const topBizName = (language === 'mr' ? topBiz.business.businessNative?.mr : language === 'hi' ? topBiz.business.businessNative?.hi : topBiz.business.business) || topBiz.business.business;

          return {
            answer: pipelineOutput.formattedTextResponse,
            summary: `गाव तयारी (VRS: ${pipelineOutput.vrs.total_vrs}/100) — ${topBizName} (BVMS: ${topBiz.bvms})`,
            voiceSpokenText: language === 'en'
              ? `Based on ${pipelineOutput.villageName}'s Village Readiness Score of ${pipelineOutput.vrs.total_vrs} out of 100, the top business recommendation is ${topBiz.business.business} with a viability score of ${topBiz.bvms} from your available capital.`
              : `तुमच्या उपलब्ध ₹${context.financialBaseline.ownCapital.toLocaleString('en-IN')} भांडवलातून ${pipelineOutput.villageName} गावाच्या १०० पैकी ${pipelineOutput.vrs.total_vrs} VRS तयारी गुणांकानुसार, '${topBizName}' हा व्यवसाय ${topBiz.bvms} BVMS गुणांकासह सर्वाधिक व्यवहार्य आहे.`,
            cards: [
              {
                type: 'BUSINESS_FEASIBILITY',
                title: `📍 ${pipelineOutput.villageName} (VRS: ${pipelineOutput.vrs.total_vrs}/100) — ${topBizName}`,
                subtitle: `BVMS: ${topBiz.bvms} | भांडवल: ₹${topBiz.business.typical_project_cost.toLocaleString('en-IN')}`,
                data: {
                  projectCost: `₹${topBiz.business.typical_project_cost.toLocaleString('en-IN')}`,
                  loanComponent: `₹${Math.round(topBiz.business.typical_project_cost * 0.9).toLocaleString('en-IN')} (PMEGP 35% पात्र)`,
                  regularMonthlyEMI: `₹${Math.round(topBiz.business.typical_project_cost * 0.015).toLocaleString('en-IN')}/महिना`,
                  breakEvenDailyUnits: `${(topBiz.infra_match * 100).toFixed(0)}% पायाभूत सुसंगतता`
                },
                actionText: 'सविस्तर आराखडा पहा',
                actionRoute: '/business-plan'
              }
            ],
            recommendations: pipelineOutput.rankedBusinesses.slice(0, 3).map(
              (b) => `${(language === 'mr' ? b.business.businessNative?.mr : b.business.business)}: BVMS ${b.bvms} (${b.statusText})`
            ),
            risks: [
              `पर्जन्यमान विचलन: ${pipelineOutput.vrs.d6_climate_resilience < 0.6 ? 'हंगामी पाऊस चढउतार नियंत्रण आवश्यक' : 'हवामान अनुकूल'}`,
              'उधारीवर कडक नियंत्रण न ठेवल्यास खेळते भांडवल अडकण्याचा धोका.'
            ],
            assumptions: [
              `गाव: ${pipelineOutput.villageName}`,
              `VRS गुणांक: ${pipelineOutput.vrs.total_vrs}/100 (${pipelineOutput.vrs.tier} Readiness)`,
              `माहिती स्तर: ${pipelineOutput.sourceAttribution.tierUsed}`
            ],
            sources: pipelineOutput.sourceAttribution.citations.map((c) => ({
              title: `${c.title} (${c.sourceFile})`,
              isOfficial: true
            })),
            suggestedNextQuestions: [
              'माझ्या गावातील इंटरनेट व विजेची स्थिती काय आहे?',
              'PMEGP ३५% सबसिडीसाठी अर्ज कसा करावा?',
              'दुसऱ्या क्रमांकाचा व्यवसाय कसा निवडायचा?'
            ],
            trustLevel: 'CALCULATED',
            confidenceScore: pipelineOutput.sourceAttribution.confidenceScore,
            skillName: 'VILLAGE_BUSINESS_PIPELINE_V3'
          };
        }
      } catch (pipeErr) {
        // Fallback to standard handler if pipeline error
      }
    }

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

    // Ensure output text is clean, free of raw markdown symbols, and structured in bullet points
    result.answer = cleanAndFormatOutputText(result.answer);
    result.summary = cleanAndFormatOutputText(result.summary);
    result.voiceSpokenText = cleanAndFormatOutputText(result.voiceSpokenText);
    if (result.recommendations) {
      result.recommendations = result.recommendations.map((r) => cleanAndFormatOutputText(r));
    }
    if (result.risks) {
      result.risks = result.risks.map((r) => cleanAndFormatOutputText(r));
    }

    return result;
  }
}

export const aiOrchestrator = new AiOrchestrator();
