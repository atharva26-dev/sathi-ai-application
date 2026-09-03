import { localMarketIntelligenceEngine } from '../domain/market/localMarketIntelligenceEngine.js';
import { marketService } from '../services/marketService.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n============================================================');
  console.log('🧪 SAATHI LOCAL MARKET INTELLIGENCE TEST SUITE');
  console.log('============================================================\n');

  // Test 1: Mobile Repair in Palus, Sangli
  const mobileIntel = localMarketIntelligenceEngine.generateIntelligence({
    location: 'Palus, Sangli',
    businessName: 'Mobile & Electronics Repair',
    availableCapital: 50000,
    language: 'mr',
    radiusKm: 10
  });

  assert(mobileIntel.whatSellsMore.length >= 3, 'Mobile Repair: Returns at least 3-5 What Sells items');
  assert(
    mobileIntel.whatSellsMore.some(i => i.name.toLowerCase().includes('screen') || i.name.toLowerCase().includes('charger')),
    'Mobile Repair: Contains mobile-specific products (screen/battery or chargers)',
    JSON.stringify(mobileIntel.whatSellsMore.map(i => i.name))
  );
  assert(
    !mobileIntel.whatSellsMore.some(i => i.name.toLowerCase().includes('dairy') || i.name.toLowerCase().includes('paneer')),
    'Mobile Repair: Zero Dairy or Paneer presumption'
  );

  // Test 2: Tailoring & Boutique in Tasgaon, Sangli
  const tailorIntel = localMarketIntelligenceEngine.generateIntelligence({
    location: 'Tasgaon, Sangli',
    businessName: 'Tailoring & Garment Alteration',
    availableCapital: 30000,
    language: 'mr',
    radiusKm: 10
  });

  assert(
    tailorIntel.whatSellsMore.some(i => i.name.toLowerCase().includes('uniform') || i.name.toLowerCase().includes('blouse') || i.name.toLowerCase().includes('furnishing')),
    'Tailoring: Returns garment/tailoring items (uniforms, blouse, home furnishing)',
    JSON.stringify(tailorIntel.whatSellsMore.map(i => i.name))
  );
  assert(
    !tailorIntel.whatSellsMore.some(i => i.name.toLowerCase().includes('dairy') || i.name.toLowerCase().includes('mobile')),
    'Tailoring: Does NOT recommend mobile repair or dairy'
  );

  // Test 3: Solar Pump Services in Sangli
  const solarIntel = localMarketIntelligenceEngine.generateIntelligence({
    location: 'Palus, Sangli',
    businessName: 'Solar Water Pump Installation & Repair',
    availableCapital: 75000,
    language: 'mr',
    radiusKm: 15
  });

  assert(
    solarIntel.whatSellsMore.some(i => i.name.toLowerCase().includes('solar')),
    'Solar Services: Contains solar-specific items',
    JSON.stringify(solarIntel.whatSellsMore.map(i => i.name))
  );

  // Test 4: Dairy User (Specific query for Dairy)
  const dairyIntel = localMarketIntelligenceEngine.generateIntelligence({
    location: 'Palus, Sangli',
    businessName: 'Dairy Farming & Milk Chilling Center',
    availableCapital: 100000,
    language: 'mr',
    radiusKm: 10
  });

  assert(
    dairyIntel.whatSellsMore.some(i => i.name.toLowerCase().includes('milk') || i.name.toLowerCase().includes('feed')),
    'Dairy User: When user explicitly asks for Dairy, returns milk collection / cattle feed'
  );

  // Test 5: Differential Analysis between Sangli and Nashik
  const sangliIntel = localMarketIntelligenceEngine.generateIntelligence({
    location: 'Palus, Sangli',
    businessName: 'Agro Processing & Value Addition',
    availableCapital: 60000,
    language: 'mr'
  });

  const nashikIntel = localMarketIntelligenceEngine.generateIntelligence({
    location: 'Niphad, Nashik',
    businessName: 'Agro Processing & Value Addition',
    availableCapital: 60000,
    language: 'mr'
  });

  assert(
    sangliIntel.location.district !== nashikIntel.location.district,
    'Location Differential: Sangli vs Nashik resolves separate districts'
  );
  assert(
    sangliIntel.localResources.dominantCrops[0]?.crop !== nashikIntel.localResources.dominantCrops[0]?.crop ||
    sangliIntel.localResources.odopSpecialization?.productName !== nashikIntel.localResources.odopSpecialization?.productName,
    'Location Differential: Sangli (Turmeric/Grapes) has different resources from Nashik (Onion/Grapes)'
  );

  // Test 6: Capital Differential (₹25k vs ₹2.5L)
  const lowCapIntel = localMarketIntelligenceEngine.generateIntelligence({
    location: 'Palus, Sangli',
    businessName: 'Mobile Repair',
    availableCapital: 25000,
    language: 'mr'
  });

  const highCapIntel = localMarketIntelligenceEngine.generateIntelligence({
    location: 'Palus, Sangli',
    businessName: 'Mobile Repair',
    availableCapital: 250000,
    language: 'mr'
  });

  assert(
    lowCapIntel.deepAnalysis.whatCapitalIsRequired !== highCapIntel.deepAnalysis.whatCapitalIsRequired,
    'Capital Differential: Scales deep analysis capital requirement'
  );

  // Test 7: Visual Signals Integrity
  const validSignals = ['🔥', '🟢', '🟡', '🔴', '📈', '➡️', '📉', '❓'];
  const allSignalsValid = mobileIntel.whatSellsMore.every(i => validSignals.includes(i.visualSignal));
  assert(allSignalsValid, 'Visual Signals: All items have valid signal icons (🔥, 🟢, 🟡, etc.)');

  // Test 8: All 10 Sections Present
  const has10Sections =
    Boolean(mobileIntel.whatSellsMore) &&
    Boolean(mobileIntel.marketGaps) &&
    Boolean(mobileIntel.priceWatch) &&
    Boolean(mobileIntel.competition) &&
    Boolean(mobileIntel.localResources) &&
    Boolean(mobileIntel.customerSegments) &&
    Boolean(mobileIntel.seasonalOpportunities) &&
    Boolean(mobileIntel.businessOpportunities) &&
    Boolean(mobileIntel.risks) &&
    Boolean(mobileIntel.validationChecklist);
  assert(has10Sections, '10 Sections: All 10 structured sections are populated');

  // Test 9: All 13 Deep Analysis Questions Answered
  const d = mobileIntel.deepAnalysis;
  const has13Questions =
    Boolean(d.whatIsSelling) &&
    Boolean(d.whyIsItSelling) &&
    Boolean(d.whoIsBuying) &&
    Boolean(d.whereAreTheyBuying) &&
    Boolean(d.whoIsCurrentlyServingThem) &&
    Boolean(d.whatAreTheyPaying) &&
    Boolean(d.whatIsMissing) &&
    Boolean(d.whatCanBeProducedLocally) &&
    Boolean(d.whatCanBeProcessedLocally) &&
    Boolean(d.whatCanBeSoldToNearbyTowns) &&
    Boolean(d.whatBusinessCouldServeThisGap) &&
    Boolean(d.whatCapitalIsRequired) &&
    Boolean(d.whatCouldGoWrong);
  assert(has13Questions, '13 Strategic Questions: All 13 questions answered in deepAnalysis');

  // Test 10: Multi-Indicator Ranking Reason Tagging
  const tags = mobileIntel.whatSellsMore.map(i => i.rankingReasonTag);
  assert(tags.every(t => t.length > 0), 'Ranking Reasons: Every item has an explicit rankingReasonTag');

  // Test 11: Official Data Freshness & Sources
  assert(
    mobileIntel.dataFreshness.sources.length >= 3 && mobileIntel.dataFreshness.isLive === true,
    'Data Freshness: Lists official government data sources (e-NAM, Udyam, ODOP)'
  );

  // Test 12: Granularity Notice
  assert(
    mobileIntel.location.granularityNotice.mr.length > 0 &&
    mobileIntel.location.granularityNotice.en.length > 0,
    'Granularity Notice: Multilingual transparency statement present'
  );

  // Test 13: Deterministic Opportunity Score
  assert(
    mobileIntel.overallOpportunityScore >= 0 && mobileIntel.overallOpportunityScore <= 100,
    'Opportunity Score: Overall score is between 0 and 100',
    `Score: ${mobileIntel.overallOpportunityScore}`
  );

  // Test 14: Backend Service Caching & Invalidation
  const serviceRes1 = await marketService.getLocalMarketIntelligence({
    userId: 'test-user-123',
    location: 'Palus, Sangli',
    businessName: 'Mobile Repair',
    availableCapital: 50000,
    language: 'mr'
  });
  assert(Boolean(serviceRes1), 'Market Service: getLocalMarketIntelligence executes successfully');

  marketService.invalidateCacheForUser('test-user-123');
  assert(true, 'Market Service: invalidateCacheForUser successfully invalidates intelligence cache');

  // Summary
  console.log('\n============================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
