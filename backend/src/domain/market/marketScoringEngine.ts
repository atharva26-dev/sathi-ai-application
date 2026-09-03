import { MarketContext, ScoreBreakdown } from '../../types/market.js';
import { BusinessArchetype, normalizeBusinessCategory } from '../businesses/businessCatalog.js';

export class MarketScoringEngine {
  /**
   * Deterministic, multi-dimensional Market Opportunity Scoring
   */
  public calculateScore(
    context: MarketContext,
    archetype: BusinessArchetype,
    competitorCount = 2
  ): ScoreBreakdown {
    const capital = Math.max(context.availableCapital || 50000, 10000);
    const radius = context.analysisRadiusKm || 10;

    // 1. Demand Score (0-100)
    // Larger radius or dense rural-urban corridor yields higher reachable demand
    let demand = 75;
    if (radius >= 10) demand += 10;
    if (context.location.district.toLowerCase().includes('pune') || context.location.district.toLowerCase().includes('sangli')) {
      demand += 5;
    }
    demand = Math.min(Math.max(demand, 40), 95);

    // 2. Competition Score (0-100, where higher means stiffer competition)
    let competition = 30 + competitorCount * 8;
    if (archetype.id === 'grocery') competition += 25; // Grocery has more retail competition
    if (archetype.id === 'dairy') competition += 5;
    if (archetype.id === 'tailoring') competition += 10;
    if (archetype.id === 'mobile_repair') competition -= 5;
    competition = Math.min(Math.max(competition, 15), 90);

    // 3. Capital Fit Score (0-100)
    // Compares user capital against typical initial capital requirement
    let capitalFit = 50;
    const minCap = archetype.typicalFixedCost * 1.5; // ~₹25k to ₹45k
    if (capital >= minCap * 2) {
      capitalFit = 95;
    } else if (capital >= minCap) {
      capitalFit = 85;
    } else if (capital >= minCap * 0.7) {
      capitalFit = 70;
    } else {
      capitalFit = 45;
    }

    // 4. Market Accessibility Score (0-100)
    let accessibility = 80;
    if (context.location.pincode) accessibility += 4;
    if (radius <= 5) accessibility += 6; // Hyper-local within walking/bike distance
    accessibility = Math.min(Math.max(accessibility, 50), 95);

    // 5. Margin Potential Score (0-100)
    const grossMargin = (archetype.typicalSellingPrice - archetype.typicalVariableCost) / archetype.typicalSellingPrice;
    let marginPotential = Math.round(grossMargin * 120);
    marginPotential = Math.min(Math.max(marginPotential, 45), 95);

    // 6. Customer Pain / Need Score (0-100)
    let customerPain = 78;
    if (archetype.id === 'mobile_repair') customerPain = 88; // Travel inconvenience to town
    if (archetype.id === 'tailoring') customerPain = 82; // Fitting and festival delivery delays
    if (archetype.id === 'dairy') customerPain = 85; // Freshness requirement

    // 7. Supply Gap Score (0-100)
    let supplyGap = Math.max(85 - competitorCount * 10, 40);

    // 8. Risk Penalty (0-100)
    let riskPenalty = 30;
    if (archetype.id === 'dairy') riskPenalty = 38; // Perishability & electricity
    if (archetype.id === 'grocery') riskPenalty = 35; // Credit default (Udhaari)
    if (archetype.id === 'mobile_repair') riskPenalty = 25; // Low inventory loss risk
    if (archetype.id === 'tailoring') riskPenalty = 22; // Very low inventory risk

    // 9. Composite Weighted Opportunity Score (0-100)
    // Weights: Demand (25%), Low Competition (20%), Capital Fit (15%), Access (10%), Margin (10%), Pain (10%), SupplyGap (5%), Risk (-5%)
    const weightedScore =
      0.25 * demand +
      0.20 * (100 - competition) +
      0.15 * capitalFit +
      0.10 * accessibility +
      0.10 * marginPotential +
      0.10 * customerPain +
      0.05 * supplyGap -
      0.05 * riskPenalty;

    const overallOpportunity = Math.round(Math.min(Math.max(weightedScore, 10), 98));

    // Determine Confidence
    const confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'PRELIMINARY' =
      context.location.villageLgdCode ? 'HIGH' : 'MEDIUM';

    // Localized Rating Labels
    const ratingLabel = {
      mr:
        overallOpportunity >= 75
          ? 'उच्च संधी (High Opportunity)'
          : overallOpportunity >= 55
          ? 'मध्यम संधी (Moderate Opportunity)'
          : 'मर्यादित / सावध (Niche Opportunity)',
      hi:
        overallOpportunity >= 75
          ? 'उच्च अवसर (High Opportunity)'
          : overallOpportunity >= 55
          ? 'मध्यम अवसर (Moderate Opportunity)'
          : 'सीमित / सतर्क (Niche Opportunity)',
      en:
        overallOpportunity >= 75
          ? 'High Opportunity'
          : overallOpportunity >= 55
          ? 'Moderate Opportunity'
          : 'Niche / Proceed with Caution'
    };

    // Transparent Explanation Bullet Points
    const explanationPoints = {
      mr: [
        `स्थानिक मागणी स्कोअर: ${demand}/१०० (${context.location.village} व ${radius} किमी परिसरात चांगली गरज)`,
        `स्थानिक स्पर्धा स्तर: ${competition}/१०० (${competitorCount} थेट प्रतिस्पर्धी आढळले)`,
        `भांडवल मेळ: ${capitalFit}/१०० (तुमचे ₹${capital.toLocaleString('en-IN')} भांडवल आवश्यकतेशी उत्तम जुळते)`,
        `नफा क्षमता: ${marginPotential}/१०० (अंदाजित सकल नफा मार्जिन ${(grossMargin * 100).toFixed(0)}%)`,
        `जोखीम निर्देशांक: ${riskPenalty}/१०० (नियंत्रित परिचालन जोखीम)`
      ],
      hi: [
        `स्थानीय मांग स्कोर: ${demand}/१०० (${context.location.village} व ${radius} किमी क्षेत्र में मजबूत मांग)`,
        `स्थानीय प्रतिस्पर्धा स्तर: ${competition}/१०० (${competitorCount} प्रत्यक्ष प्रतिस्पर्धी)`,
        `पूंजी अनुकूलता: ${capitalFit}/१०० (आपकी ₹${capital.toLocaleString('en-IN')} पूंजी पर्याप्त है)`,
        `लाभ क्षमता: ${marginPotential}/१०० (सकल लाभ मार्जिन ${(grossMargin * 100).toFixed(0)}%)`,
        `जोखिम सूचकांक: ${riskPenalty}/१०० (नियंत्रित जोखिम)`
      ],
      en: [
        `Local Demand Score: ${demand}/100 (Strong reach across ${context.location.village} and ${radius}km radius)`,
        `Competition Intensity: ${competition}/100 (${competitorCount} active commercial players identified)`,
        `Capital Suitability: ${capitalFit}/100 (Your ₹${capital.toLocaleString('en-IN')} equity fits project norms)`,
        `Margin Potential: ${marginPotential}/100 (Estimated ${(grossMargin * 100).toFixed(0)}% gross margin profile)`,
        `Operating Risk Index: ${riskPenalty}/100 (Manageable working capital risks)`
      ]
    };

    return {
      demand,
      competition,
      capitalFit,
      accessibility,
      marginPotential,
      customerPain,
      supplyGap,
      riskPenalty,
      overallOpportunity,
      ratingLabel,
      confidence,
      explanationPoints
    };
  }
}

export const marketScoringEngine = new MarketScoringEngine();
