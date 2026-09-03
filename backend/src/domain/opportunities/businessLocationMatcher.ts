/**
 * SAATHI — Deterministic Business-Location Matching Engine
 * 
 * Computes location-to-business fit using the canonical formula:
 * Score = Location Resources + Demand Signals + Market Access + Skill Fit + Capital Fit
 *         + Growth Potential + Value Addition - Competition - Risk
 * 
 * Generates an objective, deterministic 0–100 score on the backend.
 * Personalizes explicitly to user available capital, skills, and existing assets.
 * Gemini NEVER calculates or invents this score; Gemini explains it simply.
 */

import { BusinessTaxonomyArchetype } from '../businesses/businessTaxonomy.js';
import { LocationResolutionResult } from '../location/indiaGeographicMaster.js';
import { StateEconomicProfile } from '../location/stateKnowledgeLayer.js';
import { TalukaProfile } from '../location/talukaProfiles.js';
import { MandiCommodityRecord } from '../data/mandiPriceData.js';
import { DistrictCropStat } from '../data/cropProductionData.js';
import { OdopRecord } from '../data/odopData.js';

export interface UserPersonalizationProfile {
  availableCapital: number;
  skills: string[];
  experienceYears?: number;
  availableAssets?: string[];
  riskTolerance?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
}

export interface BusinessFitBreakdown {
  locationResourcesScore: number; // 0 to 15
  demandSignalsScore: number;     // 0 to 15
  marketAccessScore: number;      // 0 to 15
  skillFitScore: number;          // 0 to 15
  capitalFitScore: number;        // 0 to 15
  growthPotentialScore: number;   // 0 to 10
  valueAdditionScore: number;     // 0 to 15
  competitionPenalty: number;     // -5 to -15
  riskPenalty: number;            // -5 to -15
  totalScore: number;             // 0 to 100
  rankingReasonTag: string;
  rankingReasonExplanation: {
    mr: string;
    hi: string;
    en: string;
  };
}

export class BusinessLocationMatcher {
  /**
   * Calculates deterministic 0-100 business-location fit
   */
  public calculateFit(params: {
    archetype: BusinessTaxonomyArchetype;
    location: LocationResolutionResult;
    user: UserPersonalizationProfile;
    stateProfile?: StateEconomicProfile;
    talukaProfile?: TalukaProfile;
    mandiRecords?: MandiCommodityRecord[];
    cropStats?: DistrictCropStat[];
    odopRecord?: OdopRecord;
    registeredMsmeCount?: number;
  }): BusinessFitBreakdown {
    const { archetype, location, user, stateProfile, talukaProfile, cropStats, odopRecord, registeredMsmeCount = 400 } = params;

    let resScore = 8;
    let demandScore = 9;
    let accessScore = 9;
    let skillScore = 7;
    let capitalScore = 8;
    let growthScore = 7;
    let valueAddScore = 7;
    let compPenalty = 8;
    let riskPenalty = 8;
    let reasonTag = 'CONSISTENT_DEMAND';

    // 1. LOCATION RESOURCES (0 to 15)
    // Check if archetype sector matches state or district crop/ODOP specializations
    if (archetype.sector === 'FOOD_PROCESSING' && (cropStats && cropStats.length > 0 || odopRecord)) {
      resScore = 14;
      reasonTag = 'RESOURCE_AVAILABILITY';
    } else if (archetype.sector === 'AGRICULTURE' && cropStats && cropStats.length > 0) {
      resScore = 13;
    } else if (archetype.sector === 'RENEWABLE_ENERGY') {
      resScore = 12;
      reasonTag = 'VALUE_ADDITION';
    } else if (archetype.sector === 'SERVICES' || archetype.sector === 'RETAIL') {
      resScore = 10; // Service businesses depend on population rather than crops
    }

    // 2. DEMAND SIGNALS (0 to 15)
    if (archetype.sector === 'SERVICES' || archetype.sector === 'RETAIL') {
      demandScore = 13; // Daily routine demand
      reasonTag = 'RECURRING_DEMAND';
    } else if (archetype.sector === 'MANUFACTURING') {
      demandScore = 11;
    } else if (archetype.sector === 'FOOD_PROCESSING') {
      demandScore = 12;
    }

    // 3. MARKET ACCESS (0 to 15)
    if (location.resolvedGranularity === 'Village') {
      accessScore = talukaProfile?.infrastructureRating === 'HIGH' ? 14 : 11;
    } else if (location.resolvedGranularity === 'Taluka') {
      accessScore = 12;
    } else {
      accessScore = 10;
    }

    // 4. SKILL FIT (0 to 15) - USER PERSONALIZATION
    const userSkillsLower = (user.skills || []).map((s) => s.toLowerCase());
    const isSkilled = userSkillsLower.some((s) =>
      s.includes(archetype.sector.toLowerCase()) ||
      s.includes(archetype.subSector.toLowerCase()) ||
      s.includes('repair') && archetype.sector === 'SERVICES' ||
      s.includes('tailor') && archetype.id === 'tailoring' ||
      s.includes('farming') && (archetype.sector === 'AGRICULTURE' || archetype.sector === 'LIVESTOCK')
    );

    if (isSkilled) {
      skillScore = 14;
    } else if (archetype.requiredSkillLevel === 'UNSKILLED_TRAINABLE' || archetype.requiredSkillLevel === 'SEMI_SKILLED') {
      skillScore = 11; // Low skill barrier
    } else {
      skillScore = 6; // Requires technical training
    }

    // 5. CAPITAL FIT (0 to 15) - USER PERSONALIZATION
    const userCap = user.availableCapital || 50000;
    const minCap = archetype.minimumCapitalRequired;
    const recCap = archetype.recommendedStartingCapital;

    if (userCap >= recCap) {
      capitalScore = 14; // Comfortable capital match
    } else if (userCap >= minCap) {
      capitalScore = 11; // Lean startup feasible
    } else if (userCap >= minCap * 0.7) {
      capitalScore = 7; // Marginal capital, will require bank loan support
    } else {
      capitalScore = 3; // Severe capital deficit for this archetype
    }

    // 6. GROWTH POTENTIAL & VALUE ADDITION (0 to 10 and 0 to 15)
    if (archetype.sector === 'RENEWABLE_ENERGY' || archetype.sector === 'FOOD_PROCESSING') {
      growthScore = 9;
      valueAddScore = 13;
    } else if (archetype.sector === 'SERVICES') {
      growthScore = 8;
      valueAddScore = 10;
    } else {
      growthScore = 7;
      valueAddScore = 8;
    }

    // 7. COMPETITION PENALTY (-5 to -15)
    if (registeredMsmeCount > 1500) {
      compPenalty = 13; // Highly saturated formal/informal activity
    } else if (registeredMsmeCount > 500) {
      compPenalty = 9;  // Moderate competition
    } else {
      compPenalty = 5;  // Low competitive intensity
      if (reasonTag === 'CONSISTENT_DEMAND') reasonTag = 'LOW_COMPETITION';
    }

    // 8. RISK PENALTY (-5 to -15)
    if (archetype.seasonalSensitivity === 'HIGH') {
      riskPenalty = 11;
    } else if (userCap < minCap) {
      riskPenalty = 13; // High risk due to capital shortage
    } else {
      riskPenalty = 6;
    }

    // Formula calculation
    const rawTotal = (resScore + demandScore + accessScore + skillScore + capitalScore + growthScore + valueAddScore) - (compPenalty + riskPenalty);
    const totalScore = Math.max(15, Math.min(95, Math.round(rawTotal * 1.15)));

    // Multilingual Explanation
    const rankingReasonExplanation = {
      mr:
        reasonTag === 'RESOURCE_AVAILABILITY'
          ? `परिसरातील अधिकृत कृषी/कच्चा माल मुबलक असून स्थानिक मूल्यवर्धनास वाव आहे.`
          : reasonTag === 'LOW_COMPETITION'
          ? `गावात आणि जवळच्या बाजारात या सेवेचे कमी विक्रेते असून ग्राहक शहरात जातात.`
          : reasonTag === 'RECURRING_DEMAND'
          ? `दैनंदिन वापरातील निकडीची सेवा असल्याने सतत रोख उलाढाल मिळते.`
          : `स्थानिक बाजारपेठेत नियमित मागणी आणि तुमच्या भांडवलाशी सुसंगत पर्याय.`,
      hi:
        reasonTag === 'RESOURCE_AVAILABILITY'
          ? `स्थानीय कच्चा माल उपलब्ध होने से प्रसंस्करण का अच्छा अवसर है।`
          : reasonTag === 'LOW_COMPETITION'
          ? `स्थानीय स्तर पर सक्रिय प्रतिस्पर्धा कम है, ग्राहक बाहर जाते हैं।`
          : `दैनिक नकद आय और आपकी पूंजी के अनुकूल व्यावहारिक विकल्प।`,
      en:
        reasonTag === 'RESOURCE_AVAILABILITY'
          ? `Abundant local agricultural surplus allows value-addition with high gross margin.`
          : reasonTag === 'LOW_COMPETITION'
          ? `Underserved category locally; customers currently commute to sub-district hubs.`
          : `Stable daily cash-flow velocity aligned with user capital profile.`
    };

    return {
      locationResourcesScore: resScore,
      demandSignalsScore: demandScore,
      marketAccessScore: accessScore,
      skillFitScore: skillScore,
      capitalFitScore: capitalScore,
      growthPotentialScore: growthScore,
      valueAdditionScore: valueAddScore,
      competitionPenalty: compPenalty,
      riskPenalty: riskPenalty,
      totalScore,
      rankingReasonTag: reasonTag,
      rankingReasonExplanation
    };
  }
}

export const businessLocationMatcher = new BusinessLocationMatcher();
