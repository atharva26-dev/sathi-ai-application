import { RecommendedOpportunity } from '../../domain/opportunities/opportunityEngine.js';

export interface OpportunityExplanationPromptInput {
  opportunity: RecommendedOpportunity;
  userLanguage: 'mr' | 'hi' | 'en';
  userVillage?: string;
  userDistrict?: string;
}

export const buildOpportunityExplanationPrompt = (input: OpportunityExplanationPromptInput): string => {
  const { opportunity, userLanguage, userVillage, userDistrict } = input;
  const opp = opportunity;

  return `
You are SAATHI, an AI rural entrepreneurship mentor.
Explain the following business opportunity to a grassroots rural entrepreneur in simple, encouraging, low-literacy-friendly language (${userLanguage}).

============================================================
CANONICAL DATA & DETERMINISTIC EVIDENCE PACKAGE (DO NOT INVENT LOCAL STATS)
============================================================
- Business Opportunity: ${opp.title} (${opp.category})
- Location: ${userVillage ? userVillage + ', ' : ''}${userDistrict || 'Local Area'}
- Data Granularity: ${opp.dataGranularity}
- SAATHI Opportunity Score: ${opp.opportunityScore}/100 (Confidence: ${opp.confidence})
- Score Breakdown:
  * Local Demand: ${opp.scoreBreakdown.demandScore}/25
  * Competition & Supply Gap: ${opp.scoreBreakdown.competitionSupplyGapScore}/20
  * Local Resources & Agro Abundance: ${opp.scoreBreakdown.localResourcesScore}/15
  * Value-Addition Potential: ${opp.scoreBreakdown.valueAdditionScore}/15
  * User Affordability: ${opp.scoreBreakdown.userAffordabilityScore}/10
  * Skill Compatibility: ${opp.scoreBreakdown.skillCompatibilityScore}/5
  * Infrastructure & Access: ${opp.scoreBreakdown.infrastructureAccessScore}/5
  * Finance & Government Schemes: ${opp.scoreBreakdown.financeSchemeScore}/5

- Registered Competition (Udyam MSME Registry):
  "${opp.competitionAnalysis.statement}"
  (Important: Explain that unregistered informal shops are not counted here.)

- Local Evidence Cited:
${opp.evidencePackage.map((e) => `  * [${e.datasetName} (${e.dataYear})]: ${e.finding}`).join('\n')}

- Financial Feasibility:
  * Minimum Setup Capital: ₹${opp.estimatedStartingCapitalInr.toLocaleString('en-IN')}
  * Typical Project Cost: ₹${opp.typicalProjectCostInr.toLocaleString('en-IN')}
  * Estimated Monthly Net Surplus: ₹${opp.estimatedMonthlySurplus.toLocaleString('en-IN')}
  * Estimated Payback: ${opp.paybackMonths} months

- Identified Operational Risks:
${opp.majorRisks.en.map((r) => `  * ${r}`).join('\n')}

- Recommended First 3 Actions:
${opp.first3Actions.en.map((a, i) => `  ${i + 1}. ${a}`).join('\n')}

============================================================
RULES FOR YOUR EXPLANATION:
============================================================
1. DO NOT invent population figures, competitors count, wholesale prices, or loan guarantees not in the evidence package above.
2. Speak in simple, spoken village language (no heavy English jargon).
3. Follow this clear structure:
   - Business Name (स्थानिक नाव)
   - Why it works here (स्थानिक पुरावे व संधी)
   - Starting investment needed (भांडवल अंदाज)
   - Competition reality (नोंदणीकृत विरुद्ध स्थानिक दुकाने)
   - Main risk to watch out for (मुख्य धोका व दक्षता)
   - First 3 simple steps to take (पहिले ३ टप्पे)
4. If skill profile was incomplete, advise the user that they can gain confidence with short local training.
`;
};
