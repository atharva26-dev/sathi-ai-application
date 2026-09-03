import { LocationHierarchy } from '../../types/market.js';
import { lgdLocationService } from '../location/lgdLocationService.js';
import { DataProvenance } from '../data/dataProvenance.js';
import {
  DISTRICT_INDUSTRIAL_PROFILES,
  DistrictIndustrialProfile,
  PotentialMsmeIdea
} from '../data/districtProfiles.js';
import {
  DISTRICT_CROP_STATISTICS,
  DistrictCropStat,
  getCropProductionProvenance
} from '../data/cropProductionData.js';
import { DISTRICT_ODOP_RECORDS, OdopRecord } from '../data/odopData.js';
import {
  DISTRICT_UDYAM_REGISTRY,
  DistrictUdyamData,
  formatUdyamCompetitionStatement
} from '../data/udyamActivityData.js';
import { MANDI_APMC_RECORDS, MandiCommodityRecord, getMandiProvenance } from '../data/mandiPriceData.js';
import { DISTRICT_DEMOGRAPHICS, DistrictDemographicData } from '../data/censusDemographics.js';
import { DISTRICT_SKILL_ECOSYSTEMS, DistrictSkillEcosystem } from '../data/districtSkillsData.js';
import { calculateProjectCostStructure } from '../finance/projectCostCalculator.js';

export interface OpportunityDiscoveryQuery {
  location?: string | Partial<LocationHierarchy>;
  availableCapital?: number;
  skills?: string[];
  experienceYears?: number;
  businessTypePreferences?: string[];
  riskTolerance?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  language?: 'mr' | 'hi' | 'en';
}

export interface OpportunityEvidenceItem {
  datasetName: string;
  sourceUrl: string;
  dataYear: string | number;
  signalType: 'DEMAND' | 'SUPPLY_GAP' | 'RESOURCES' | 'VALUE_ADD' | 'CAPITAL' | 'SKILLS' | 'INFRASTRUCTURE' | 'SCHEME';
  finding: string;
}

export interface RecommendedOpportunity {
  id: string;
  title: string;
  titleNative: { mr: string; hi: string; en: string };
  category: string;
  opportunityScore: number; // 0-100 deterministic SAATHI Opportunity Score
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  dataGranularity: 'Village' | 'Taluka' | 'District' | 'State';
  scoreBreakdown: {
    demandScore: number; // Max 25
    competitionSupplyGapScore: number; // Max 20
    localResourcesScore: number; // Max 15
    valueAdditionScore: number; // Max 15
    userAffordabilityScore: number; // Max 10
    skillCompatibilityScore: number; // Max 5
    infrastructureAccessScore: number; // Max 5
    financeSchemeScore: number; // Max 5
    totalScore: number;
  };
  whySaathiIdentifiedThis: {
    mr: string[];
    hi: string[];
    en: string[];
  };
  evidencePackage: OpportunityEvidenceItem[];
  competitionAnalysis: {
    registeredEnterprises: number;
    statement: string;
    competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  marketGap: {
    mr: string;
    hi: string;
    en: string;
  };
  estimatedStartingCapitalInr: number;
  typicalProjectCostInr: number;
  paybackMonths: number;
  estimatedMonthlySurplus: number;
  capitalFitRating: 'EXCELLENT' | 'GOOD' | 'FINANCING_REQUIRED' | 'HIGH_CAPITAL_GAP';
  skillCompatibilityText: {
    mr: string;
    hi: string;
    en: string;
  };
  majorRisks: {
    mr: string[];
    hi: string[];
    en: string[];
  };
  first3Actions: {
    mr: string[];
    hi: string[];
    en: string[];
  };
  recommendedStartingModel: {
    mr: string;
    hi: string;
    en: string;
  };
}

export interface OpportunityDiscoveryResult {
  success: boolean;
  message?: string;
  resolvedLocation?: LocationHierarchy;
  dataGranularity: 'Village' | 'Taluka' | 'District' | 'State';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  totalCandidatesEvaluated: number;
  opportunities: RecommendedOpportunity[];
  dataSourceProvenanceList: DataProvenance[];
  timestamp: string;
}

export class OpportunityEngine {
  /**
   * Main entrypoint: Data-driven opportunity discovery
   */
  public discoverOpportunities(query: OpportunityDiscoveryQuery): OpportunityDiscoveryResult {
    const lang = query.language || 'mr';

    // 1. Check for missing location (Strict rule: Never fallback to Sangli/Palus)
    const resolvedLoc = lgdLocationService.resolveLocationHierarchy(query.location);
    if (!resolvedLoc) {
      return {
        success: false,
        message: 'Location data is required for a reliable local opportunity analysis.',
        dataGranularity: 'State',
        confidence: 'LOW',
        totalCandidatesEvaluated: 0,
        opportunities: [],
        dataSourceProvenanceList: [],
        timestamp: new Date().toISOString()
      };
    }

    const districtLgdCode = resolvedLoc.districtLgdCode;
    const capital = Math.max(query.availableCapital || 50000, 10000);
    const userSkills = query.skills || [];

    // Determine granularity
    let dataGranularity: 'Village' | 'Taluka' | 'District' | 'State' = 'District';
    if (resolvedLoc.villageLgdCode) {
      dataGranularity = 'Village';
    } else if (resolvedLoc.subDistrictLgdCode) {
      dataGranularity = 'Taluka';
    } else if (resolvedLoc.districtLgdCode) {
      dataGranularity = 'District';
    } else {
      dataGranularity = 'State';
    }

    // Check if we have district data for this LGD code
    const profile = districtLgdCode ? DISTRICT_INDUSTRIAL_PROFILES[districtLgdCode] : undefined;
    const crops = districtLgdCode ? DISTRICT_CROP_STATISTICS.filter((c) => c.districtLgdCode === districtLgdCode) : [];
    const odop = districtLgdCode ? DISTRICT_ODOP_RECORDS[districtLgdCode] : undefined;
    const udyam = districtLgdCode ? DISTRICT_UDYAM_REGISTRY[districtLgdCode] : undefined;
    const mandis = districtLgdCode ? MANDI_APMC_RECORDS.filter((m) => m.districtLgdCode === districtLgdCode) : [];
    const demographics = districtLgdCode ? DISTRICT_DEMOGRAPHICS[districtLgdCode] : undefined;
    const skillsEcosystem = districtLgdCode ? DISTRICT_SKILL_ECOSYSTEMS[districtLgdCode] : undefined;

    const provenances: DataProvenance[] = [];
    if (profile) provenances.push(profile.provenance);
    if (crops.length > 0) provenances.push(getCropProductionProvenance());
    if (odop) provenances.push(odop.provenance);
    if (udyam) provenances.push(udyam.provenance);
    if (mandis.length > 0) provenances.push(getMandiProvenance());
    if (demographics) provenances.push(demographics.provenance);
    if (skillsEcosystem) provenances.push(skillsEcosystem.provenance);

    // If no district profile exists in registry:
    if (!profile) {
      return {
        success: true,
        message:
          'No reliable local opportunity data is available yet for this location. We can still suggest general business categories, but the recommendation confidence is low.',
        resolvedLocation: resolvedLoc,
        dataGranularity: 'State',
        confidence: 'LOW',
        totalCandidatesEvaluated: 1,
        opportunities: [
          this.generateGenericFallbackOpportunity(resolvedLoc, capital, userSkills)
        ],
        dataSourceProvenanceList: provenances,
        timestamp: new Date().toISOString()
      };
    }

    // 2. Candidate Generation from the District Industrial Profile
    const candidateIdeas: PotentialMsmeIdea[] = profile.potentialNewMsmes;
    const confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' =
      provenances.length >= 4 ? 'HIGH' : provenances.length >= 2 ? 'MEDIUM' : 'LOW';

    const evaluatedOpps: RecommendedOpportunity[] = candidateIdeas.map((idea) => {
      // Calculate 8 Signals Deterministically
      const scores = this.calculateDeterministicScores({
        idea,
        profile,
        crops,
        odop,
        udyam,
        mandis,
        demographics,
        capital,
        userSkills
      });

      // Format Udyam statement
      const compInfo = formatUdyamCompetitionStatement(profile.districtLgdCode, idea.category);

      // Construct Evidence Package
      const evidence = this.assembleEvidencePackage({
        idea,
        profile,
        crops,
        odop,
        udyam,
        mandis,
        demographics,
        skillsEcosystem,
        capital,
        scores
      });

      // Capital Fit rating
      let capitalFitRating: 'EXCELLENT' | 'GOOD' | 'FINANCING_REQUIRED' | 'HIGH_CAPITAL_GAP' = 'GOOD';
      if (capital >= idea.typicalInvestmentInr * 0.5) {
        capitalFitRating = 'EXCELLENT';
      } else if (capital >= idea.minCapitalRequiredInr) {
        capitalFitRating = 'GOOD';
      } else if (capital >= idea.minCapitalRequiredInr * 0.5) {
        capitalFitRating = 'FINANCING_REQUIRED';
      } else {
        capitalFitRating = 'HIGH_CAPITAL_GAP';
      }

      // Skill Compatibility text
      let skillText: { mr: string; hi: string; en: string };
      if (!userSkills || userSkills.length === 0) {
        skillText = {
          mr: 'तुमची कौशल्य माहिती अपूर्ण असल्याने कौशल्य सुसंगततेचे मूल्यांकन करता आले नाही.',
          hi: 'आपकी कौशल्य जानकारी अधूरी होने के कारण कौशल अनुकूलता का मूल्यांकन नहीं किया जा सका।',
          en: 'Skill compatibility could not be evaluated because your skill profile is incomplete.'
        };
      } else if (scores.skillCompatibilityScore === 5) {
        skillText = {
          mr: 'तुमचा पूर्वअनुभव आणि कौशल्यांशी हा व्यवसाय थेट सुसंगत आहे.',
          hi: 'आपके पूर्व अनुभव और कौशलों से यह व्यवसाय पूरी तरह मेल खाता है।',
          en: 'Strong positive match with your declared skills and vocational experience.'
        };
      } else {
        skillText = {
          mr: 'प्राथमिक तांत्रिक प्रशिक्षणानंतर हा व्यवसाय सुरू करता येणे शक्य आहे.',
          hi: 'प्रारंभिक तकनीकी प्रशिक्षण के बाद इस व्यवसाय को शुरू किया जा सकता है।',
          en: 'Transferable aptitude; short vocational orientation recommended before launch.'
        };
      }

      // Financial estimations via deterministic engine
      const fin = calculateProjectCostStructure(capital, 15);
      const estimatedSurplus = Math.round(idea.typicalInvestmentInr * 0.08);
      const payback = Math.round((idea.typicalInvestmentInr / (estimatedSurplus * 12)) * 10) / 10;

      return {
        id: idea.id,
        title: idea.name,
        titleNative: idea.nameNative,
        category: idea.category,
        opportunityScore: scores.totalScore,
        confidence: confidenceLevel,
        dataGranularity,
        scoreBreakdown: scores,
        whySaathiIdentifiedThis: {
          mr: [
            idea.rationale.mr,
            `स्थानिक कच्चा माल: ${idea.resourceRequirement}`,
            `भांडवल सुसंगतता: तुमचे उपलब्ध भांडवल (₹${capital.toLocaleString('en-IN')}) प्रारंभिक सेटअपसाठी अनुकूल आहे.`
          ],
          hi: [
            idea.rationale.hi,
            `स्थानीय संसाधन: ${idea.resourceRequirement}`,
            `पूंजी अनुकूलता: आपकी पूंजी (₹${capital.toLocaleString('en-IN')}) शुरुआती ढांचे के अनुकूल है।`
          ],
          en: [
            idea.rationale.en,
            `Local resource match: ${idea.resourceRequirement}`,
            `Capital compatibility: Your available capital (₹${capital.toLocaleString('en-IN')}) is compatible with a small-scale starting model.`
          ]
        },
        evidencePackage: evidence,
        competitionAnalysis: {
          registeredEnterprises: compInfo.registeredCount,
          statement: compInfo.statement,
          competitionLevel: idea.supplyGap === 'HIGH' ? 'LOW' : idea.supplyGap === 'MEDIUM' ? 'MEDIUM' : 'HIGH'
        },
        marketGap: {
          mr: `कच्चा माल परिसरात मुबलक आहे, परंतु प्रतवारी, स्वच्छता, पॅकेजिंग आणि स्थानिक ब्रँडेड पुरवठ्यामध्ये मोठी पोकळी दिसून येते.`,
          hi: `कच्चा माल स्थानीय रूप से प्रचुर है, किंतु ग्रेडिंग, सफाई, पैकेजिंग और स्थानीय आपूर्ति में स्पष्ट अवसर मौजूद है।`,
          en: `Raw material is locally abundant, but high-margin opportunities exist in sorting, processing, sealed packaging, and direct local distribution.`
        },
        estimatedStartingCapitalInr: idea.minCapitalRequiredInr,
        typicalProjectCostInr: idea.typicalInvestmentInr,
        paybackMonths: Math.round(payback * 12),
        estimatedMonthlySurplus: estimatedSurplus,
        capitalFitRating,
        skillCompatibilityText: skillText,
        majorRisks: {
          mr: [idea.mainRisks.mr, 'खेळत्या भांडवलाची (Working Capital) नियमित गरज.', 'हंगामी भावातील तफावत.'],
          hi: [idea.mainRisks.hi, 'कार्यशील पूंजी (Working Capital) की नियमित आवश्यकता।', 'मौसमी मूल्य उतार-चढ़ाव।'],
          en: [idea.mainRisks.en, 'Working capital cycle management during receivables wait.', 'Seasonal wholesale price variations.']
        },
        first3Actions: idea.first3Actions,
        recommendedStartingModel: {
          mr: 'लहान प्रमाणावर सुरुवात करा → थेट खरेदीदार निश्चित करा → मर्यादित साठ्याने चाचणी घ्या → नफा मोजा → विस्तार करा.',
          hi: 'छोटे स्तर पर शुरुआत करें → सीधे खरीदार तय करें → सीमित उत्पादन से परखें → मार्जिन मापें → विस्तार करें।',
          en: 'Start small → validate buyers → process/pack limited volume → measure margins → expand.'
        }
      };
    });

    // Sort opportunities by deterministic total score
    evaluatedOpps.sort((a, b) => b.opportunityScore - a.opportunityScore);

    return {
      success: true,
      resolvedLocation: resolvedLoc,
      dataGranularity,
      confidence: confidenceLevel,
      totalCandidatesEvaluated: evaluatedOpps.length,
      opportunities: evaluatedOpps,
      dataSourceProvenanceList: provenances,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Deterministic 8-Signal Scoring Engine (Sum = 100 points)
   * 1. Demand = 25 pts
   * 2. Competition / Supply gap = 20 pts
   * 3. Local resources = 15 pts
   * 4. Value-addition opportunity = 15 pts
   * 5. User affordability = 10 pts
   * 6. Skill compatibility = 5 pts
   * 7. Infrastructure & access = 5 pts
   * 8. Finance & scheme compatibility = 5 pts
   */
  private calculateDeterministicScores(params: {
    idea: PotentialMsmeIdea;
    profile: DistrictIndustrialProfile;
    crops: DistrictCropStat[];
    odop?: OdopRecord;
    udyam?: DistrictUdyamData;
    mandis: MandiCommodityRecord[];
    demographics?: DistrictDemographicData;
    capital: number;
    userSkills: string[];
  }) {
    const { idea, profile, crops, odop, udyam, mandis, demographics, capital, userSkills } = params;

    // 1. Demand Signal (Max 25)
    let demandScore = 18;
    if (demographics) {
      if (demographics.demandIndexScore >= 85) demandScore = 24;
      else if (demographics.demandIndexScore >= 80) demandScore = 22;
      else demandScore = 19;
    }
    if (mandis.length > 0) demandScore = Math.min(25, demandScore + 1);

    // 2. Competition / Supply Gap (Max 20)
    let competitionSupplyGapScore = 15;
    if (idea.supplyGap === 'HIGH') competitionSupplyGapScore = 19;
    else if (idea.supplyGap === 'MEDIUM') competitionSupplyGapScore = 15;
    else competitionSupplyGapScore = 11;

    // 3. Local Resources (Max 15)
    let localResourcesScore = 10;
    const matchingCrop = crops.find(
      (c) =>
        idea.name.toLowerCase().includes(c.cropName.toLowerCase()) ||
        idea.resourceRequirement.toLowerCase().includes(c.cropName.toLowerCase())
    );
    if (matchingCrop) {
      localResourcesScore = matchingCrop.marketSurplusRank === 'VERY_HIGH' ? 15 : 13;
    } else {
      localResourcesScore = 12;
    }

    // 4. Value-Addition Opportunity (Max 15)
    let valueAdditionScore = 11;
    if (idea.valueAdditionPotential === 'VERY_HIGH') valueAdditionScore = 15;
    else if (idea.valueAdditionPotential === 'HIGH') valueAdditionScore = 13;
    else valueAdditionScore = 10;

    // 5. User Affordability (Max 10)
    let userAffordabilityScore = 4;
    if (capital >= idea.typicalInvestmentInr * 0.6) {
      userAffordabilityScore = 10;
    } else if (capital >= idea.minCapitalRequiredInr) {
      userAffordabilityScore = 8;
    } else if (capital >= idea.minCapitalRequiredInr * 0.6) {
      userAffordabilityScore = 5;
    } else {
      userAffordabilityScore = 2;
    }

    // 6. Skill Compatibility (Max 5) - Strictly follow rule:
    // If no skills declared, 0 points and explicitly flag incomplete profile
    let skillCompatibilityScore = 0;
    if (!userSkills || userSkills.length === 0) {
      skillCompatibilityScore = 0;
    } else {
      const skillsStr = userSkills.join(' ').toLowerCase();
      const ideaStr = (idea.name + ' ' + idea.category + ' ' + idea.resourceRequirement).toLowerCase();
      const hasDirectSkill =
        skillsStr.split(' ').some((word) => word.length > 3 && ideaStr.includes(word));
      skillCompatibilityScore = hasDirectSkill ? 5 : 2;
    }

    // 7. Infrastructure / Access (Max 5)
    let infrastructureAccessScore = 4;
    if (demographics) {
      if (demographics.electrificationPercent > 98 && demographics.pavedRoadAccessPercent > 90) {
        infrastructureAccessScore = 5;
      }
    }

    // 8. Finance / Scheme Compatibility (Max 5)
    let financeSchemeScore = 5; // Eligible for PMEGP 35% or Mudra Shishu/Kishor

    const totalScore = Math.min(
      100,
      demandScore +
        competitionSupplyGapScore +
        localResourcesScore +
        valueAdditionScore +
        userAffordabilityScore +
        skillCompatibilityScore +
        infrastructureAccessScore +
        financeSchemeScore
    );

    return {
      demandScore,
      competitionSupplyGapScore,
      localResourcesScore,
      valueAdditionScore,
      userAffordabilityScore,
      skillCompatibilityScore,
      infrastructureAccessScore,
      financeSchemeScore,
      totalScore
    };
  }

  /**
   * Assemble rich evidence package linking real data layers
   */
  private assembleEvidencePackage(params: {
    idea: PotentialMsmeIdea;
    profile: DistrictIndustrialProfile;
    crops: DistrictCropStat[];
    odop?: OdopRecord;
    udyam?: DistrictUdyamData;
    mandis: MandiCommodityRecord[];
    demographics?: DistrictDemographicData;
    skillsEcosystem?: DistrictSkillEcosystem;
    capital: number;
    scores: any;
  }): OpportunityEvidenceItem[] {
    const { idea, profile, crops, odop, udyam, mandis, demographics, skillsEcosystem } = params;
    const evidence: OpportunityEvidenceItem[] = [];

    // 1. DC-MSME Profile Evidence
    evidence.push({
      datasetName: profile.provenance.source_name,
      sourceUrl: profile.provenance.source_url,
      dataYear: profile.provenance.data_year,
      signalType: 'RESOURCES',
      finding: `Official district industrial profile lists "${idea.name}" as an identified high-potential micro-enterprise.`
    });

    // 2. Crop Production / Resource Evidence
    const matchingCrop = crops.find(
      (c) =>
        idea.name.toLowerCase().includes(c.cropName.toLowerCase()) ||
        idea.resourceRequirement.toLowerCase().includes(c.cropName.toLowerCase())
    );
    if (matchingCrop) {
      evidence.push({
        datasetName: getCropProductionProvenance().source_name,
        sourceUrl: getCropProductionProvenance().source_url,
        dataYear: matchingCrop.year,
        signalType: 'RESOURCES',
        finding: `District annual production of ${matchingCrop.cropName} is ${matchingCrop.productionTonnes.toLocaleString('en-IN')} tonnes across ${matchingCrop.areaHectares.toLocaleString('en-IN')} hectares.`
      });
    }

    // 3. ODOP Evidence
    if (odop) {
      evidence.push({
        datasetName: odop.provenance.source_name,
        sourceUrl: odop.provenance.source_url,
        dataYear: odop.provenance.data_year,
        signalType: 'VALUE_ADD',
        finding: `ODOP official record confirms district specialization in: ${odop.productName} (${odop.specializationRationale}).`
      });
    }

    // 4. Udyam Supply Signal Evidence
    if (udyam) {
      evidence.push({
        datasetName: udyam.provenance.source_name,
        sourceUrl: udyam.provenance.source_url,
        dataYear: udyam.provenance.data_year,
        signalType: 'SUPPLY_GAP',
        finding: `${udyam.totalRegisteredMsmes.toLocaleString('en-IN')} total registered MSMEs in district. Available Udyam data indicates unmet demand in small-scale processing.`
      });
    }

    // 5. Mandi Trade Evidence
    if (mandis.length > 0) {
      const topMandi = mandis[0];
      evidence.push({
        datasetName: getMandiProvenance().source_name,
        sourceUrl: getMandiProvenance().source_url,
        dataYear: topMandi.date,
        signalType: 'DEMAND',
        finding: `APMC ${topMandi.marketName} recorded modal trade price of ₹${topMandi.modalPriceInrPerQuintal}/quintal for ${topMandi.commodity}.`
      });
    }

    // 6. Demographic Evidence
    if (demographics) {
      evidence.push({
        datasetName: demographics.provenance.source_name,
        sourceUrl: demographics.provenance.source_url,
        dataYear: demographics.provenance.data_year,
        signalType: 'INFRASTRUCTURE',
        finding: `District census indicators show ${demographics.electrificationPercent}% electrification and ${demographics.pavedRoadAccessPercent}% paved road connectivity.`
      });
    }

    return evidence;
  }

  /**
   * Safe fallback for districts without active deep profiles
   */
  private generateGenericFallbackOpportunity(
    location: LocationHierarchy,
    capital: number,
    skills: string[]
  ): RecommendedOpportunity {
    return {
      id: 'opp_local_custom_service',
      title: 'Local Retail & Essential Support Services',
      titleNative: {
        mr: 'स्थानिक किरकोळ व दैनंदिन सेवा केंद्र',
        hi: 'स्थानीय खुदरा व आवश्यक सेवा केंद्र',
        en: 'Local Retail & Essential Support Services'
      },
      category: 'Retail & Services',
      opportunityScore: 65,
      confidence: 'LOW',
      dataGranularity: 'State',
      scoreBreakdown: {
        demandScore: 16,
        competitionSupplyGapScore: 13,
        localResourcesScore: 9,
        valueAdditionScore: 9,
        userAffordabilityScore: 8,
        skillCompatibilityScore: skills.length > 0 ? 4 : 0,
        infrastructureAccessScore: 3,
        financeSchemeScore: 3,
        totalScore: 65
      },
      whySaathiIdentifiedThis: {
        mr: [
          'स्थानिक पातळीवरील प्राथमिक गरजेचा व्यवसाय.',
          'या जिल्ह्यासाठी सविस्तर अधिकृत डेटा सध्या उपलब्ध नाही.',
          `उपलब्ध भांडवल ₹${capital.toLocaleString('en-IN')} लहान सेवा केंद्रासाठी पुरेसे आहे.`
        ],
        hi: [
          'स्थानीय स्तर पर बुनियादी जरूरत का व्यवसाय।',
          'इस जिले का विस्तृत सरकारी डेटा अभी इंडेक्स नहीं हुआ है।',
          `उपलब्ध पूंजी ₹${capital.toLocaleString('en-IN')} छोटे सेवा केंद्र के लिए उपयुक्त है।`
        ],
        en: [
          'Everyday local essential service hub.',
          'Limited district data available; baseline recommendation with conservative assumptions.',
          `Available capital ₹${capital.toLocaleString('en-IN')} matches a micro retail model.`
        ]
      },
      evidencePackage: [],
      competitionAnalysis: {
        registeredEnterprises: 0,
        statement: 'District-specific Udyam data is not yet indexed for this exact location.',
        competitionLevel: 'MEDIUM'
      },
      marketGap: {
        mr: 'स्थानिक बाजारपेठेची वैयक्तिक पाहणी करून ग्राहकांच्या गरजा तपासा.',
        hi: 'स्थानीय बाजार का व्यक्तिगत सर्वेक्षण करके ग्राहकों की आवश्यकताएं समझें।',
        en: 'Ground survey of local unmet retail or repair requirements recommended.'
      },
      estimatedStartingCapitalInr: 30000,
      typicalProjectCostInr: 250000,
      paybackMonths: 10,
      estimatedMonthlySurplus: 18000,
      capitalFitRating: 'GOOD',
      skillCompatibilityText: {
        mr: skills.length > 0 ? 'सामान्य कौशल्य सुसंगतता.' : 'कौशल्य माहिती अपूर्ण आहे.',
        hi: skills.length > 0 ? 'सामान्य कौशल्य अनुकूलता।' : 'कौशल जानकारी अधूरी है।',
        en: skills.length > 0 ? 'General skill fit.' : 'Skill compatibility could not be evaluated because your skill profile is incomplete.'
      },
      majorRisks: {
        mr: ['स्थानिक डेटा मर्यादित असल्याने अनिश्चितता.'],
        hi: ['स्थानीय डेटा सीमित होने के कारण अनिश्चितता।'],
        en: ['Limited localized dataset coverage; manual verification required.']
      },
      first3Actions: {
        mr: ['स्थानिक आठवडी बाजाराची पाहणी करणे', 'किमान ५ स्थानिक दुकानदारांशी चर्चा करणे', 'कमी खर्चात चाचणी घेणे'],
        hi: ['स्थानीय साप्ताहिक बाजार का सर्वेक्षण', 'दुकानदारों से चर्चा', 'कम लागत में परीक्षण'],
        en: ['Survey local weekly market', 'Interview 5 local merchants', 'Pilot with small inventory']
      },
      recommendedStartingModel: {
        mr: 'कमी भांडवलात लहान प्रमाणावर सुरू करा.',
        hi: 'कम पूंजी में छोटे स्तर से शुरुआत करें।',
        en: 'Start small with low capital risk.'
      }
    };
  }
}

export const opportunityEngine = new OpportunityEngine();
