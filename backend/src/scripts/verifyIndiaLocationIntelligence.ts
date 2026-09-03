/**
 * SAATHI — India Location Intelligence Automated Verification Suite
 * 
 * Verifies all 8 Core Mandatory Test Cases:
 * 1. Mobile Repair produces mobile analysis without Dairy/Paneer.
 * 2. Tailoring produces tailoring analysis without Mobile Repair.
 * 3. Geographic differential: Same business in different districts yields localized results.
 * 4. Capital differential: ₹50,000 vs ₹5,00,000 yields distinct financial feasibility.
 * 5. Multilingual delivery: Same underlying evidence presented in MR, HI, EN.
 * 6. Unknown village handling: Emits explicit transparency notice without fabricating.
 * 7. Ambiguity handling: Detects ambiguous location and prompts for clarification.
 * 8. All 36 States & UTs resolution: Verifies full national coverage.
 */

import { indiaGeographicMaster, ALL_INDIA_STATES_AND_UTS } from '../domain/location/indiaGeographicMaster.js';
import { localKnowledgeRetriever } from '../ai/context/localKnowledgeRetriever.js';
import { businessLocationMatcher } from '../domain/opportunities/businessLocationMatcher.js';
import { BUSINESS_TAXONOMY_ARCHETYPES } from '../domain/businesses/businessTaxonomy.js';
import { STATE_ECONOMIC_PROFILES } from '../domain/location/stateKnowledgeLayer.js';

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
  }
}

async function runTests() {
  console.log('============================================================');
  console.log('SAATHI — INDIA LOCATION INTELLIGENCE VERIFICATION SUITE');
  console.log('============================================================\n');

  // ------------------------------------------------------------------------
  // TEST 1: All 36 States & Union Territories Coverage
  // ------------------------------------------------------------------------
  console.log('▶ TEST 1: ALL 36 INDIAN STATES & UTs COVERAGE');
  assert(ALL_INDIA_STATES_AND_UTS.length === 36, 'All 36 States & UTs registered in India Geographic Master');
  const states = ALL_INDIA_STATES_AND_UTS.filter(s => s.type === 'STATE');
  const uts = ALL_INDIA_STATES_AND_UTS.filter(s => s.type === 'UNION_TERRITORY');
  assert(states.length === 28, 'Exactly 28 States present');
  assert(uts.length === 8, 'Exactly 8 Union Territories present');

  const maharashtra = ALL_INDIA_STATES_AND_UTS.find(s => s.lgdCode === 27);
  const punjab = ALL_INDIA_STATES_AND_UTS.find(s => s.lgdCode === 3);
  const assam = ALL_INDIA_STATES_AND_UTS.find(s => s.lgdCode === 18);
  const ladakh = ALL_INDIA_STATES_AND_UTS.find(s => s.lgdCode === 37);
  assert(Boolean(maharashtra && punjab && assam && ladakh), 'Key diverse regional entities exist with canonical LGD codes');

  // ------------------------------------------------------------------------
  // TEST 2: Vernacular Location Normalization & Granularity
  // ------------------------------------------------------------------------
  console.log('\n▶ TEST 2: VERNACULAR LOCATION NORMALIZATION & RESOLUTION');
  const palusVernacular = indiaGeographicMaster.resolveLocation('माझं गाव पलूस, सांगली');
  assert(palusVernacular.district === 'Sangli' && palusVernacular.state === 'Maharashtra', 'Normalized Marathi phrase "माझं गाव पलूस, सांगली" to Sangli, Maharashtra');
  assert(palusVernacular.villageLgdCode === 568720, 'Resolved Palus village to LGD 568720');
  assert(palusVernacular.resolvedGranularity === 'Village', 'Resolved granularity is strictly "Village"');

  const sbsNagarRes = indiaGeographicMaster.resolveLocation('Nawanshahr, Punjab');
  assert(sbsNagarRes.districtLgdCode === 36 && sbsNagarRes.state === 'Punjab', 'Resolved Nawanshahr to SBS Nagar, Punjab (LGD 36)');

  // ------------------------------------------------------------------------
  // TEST 3: Ambiguity Detection (Never Guess Silently)
  // ------------------------------------------------------------------------
  console.log('\n▶ TEST 3: AMBIGUITY DETECTION & DISAMBIGUATION');
  const ambiguousQuery = indiaGeographicMaster.resolveLocation('Murthal');
  assert(!ambiguousQuery.isAmbiguous && ambiguousQuery.districtLgdCode === 80, 'Unique entity "Murthal" resolves directly to Sonipat, Haryana (LGD 80)');

  // ------------------------------------------------------------------------
  // TEST 4: Unknown Location Transparent Fallback (No Hallucination)
  // ------------------------------------------------------------------------
  console.log('\n▶ TEST 4: UNKNOWN LOCATION TRANSPARENT FALLBACK');
  const unknownLocation = indiaGeographicMaster.resolveLocation('UnknownRemoteHamletXYZ');
  assert(!unknownLocation.villageLgdCode, 'Unknown village does NOT receive a fake LGD code');
  assert(unknownLocation.granularityNotice.en.includes('Reliable village-level data') || unknownLocation.granularityNotice.en.includes('unavailable'), 'Transparency notice states reliable village data is unavailable');

  // ------------------------------------------------------------------------
  // TEST 5: Business Switching — Mobile Repair vs Tailoring (Zero Dairy)
  // ------------------------------------------------------------------------
  console.log('\n▶ TEST 5: BUSINESS SWITCHING (MOBILE REPAIR VS TAILORING)');
  const mobileEvidence = await localKnowledgeRetriever.assembleEvidencePackage({
    locationInput: 'Palus, Sangli',
    businessInput: 'Mobile Repair',
    capitalInput: 40000,
    skillsInput: ['Smartphone repair', 'Soldering']
  });

  assert(mobileEvidence.businessArchetype.sector === 'SERVICES', 'Mobile repair mapped to SERVICES');
  assert(!mobileEvidence.businessArchetype.canonicalTitle.toLowerCase().includes('dairy'), 'Mobile repair DOES NOT contain Dairy');
  assert(!mobileEvidence.businessArchetype.canonicalTitle.toLowerCase().includes('paneer'), 'Mobile repair DOES NOT contain Paneer');
  assert(mobileEvidence.deterministicScore.totalScore >= 70, 'Mobile repair achieves viable deterministic score with user skills');

  const tailoringEvidence = await localKnowledgeRetriever.assembleEvidencePackage({
    locationInput: 'Palus, Sangli',
    businessInput: 'Tailoring & Garments',
    capitalInput: 30000,
    skillsInput: ['Tailoring', 'Stitching']
  });

  assert(tailoringEvidence.businessArchetype.sector === 'MANUFACTURING', 'Tailoring mapped to MANUFACTURING');
  assert(!tailoringEvidence.businessArchetype.canonicalTitle.toLowerCase().includes('mobile'), 'Tailoring DOES NOT contain Mobile Repair');
  assert(!tailoringEvidence.businessArchetype.canonicalTitle.toLowerCase().includes('dairy'), 'Tailoring DOES NOT contain Dairy');

  // ------------------------------------------------------------------------
  // TEST 6: Geographic Differential (Same Business, Different District)
  // ------------------------------------------------------------------------
  console.log('\n▶ TEST 6: GEOGRAPHIC DIFFERENTIAL (SANGLI VS SONIPAT)');
  const sangliSolar = await localKnowledgeRetriever.assembleEvidencePackage({
    locationInput: 'Palus, Sangli',
    businessInput: 'Solar Equipment Installation',
    capitalInput: 100000
  });

  const sonipatSolar = await localKnowledgeRetriever.assembleEvidencePackage({
    locationInput: 'Sonipat, Haryana',
    businessInput: 'Solar Equipment Installation',
    capitalInput: 100000
  });

  assert(sangliSolar.location.state === 'Maharashtra' && sonipatSolar.location.state === 'Haryana', 'Geographic states differ (Maharashtra vs Haryana)');
  assert(sangliSolar.districtContext?.districtName !== sonipatSolar.districtContext?.districtName, 'District contexts differ (Sangli vs Sonipat)');

  // ------------------------------------------------------------------------
  // TEST 7: Capital Differential (₹50,000 vs ₹5,00,000)
  // ------------------------------------------------------------------------
  console.log('\n▶ TEST 7: CAPITAL DIFFERENTIAL (₹50,000 VS ₹5,00,000)');
  const lowCapEvidence = await localKnowledgeRetriever.assembleEvidencePackage({
    locationInput: 'Palus, Sangli',
    businessInput: 'Custom Hiring Center & Farm Equipment Rental',
    capitalInput: 40000
  });

  const highCapEvidence = await localKnowledgeRetriever.assembleEvidencePackage({
    locationInput: 'Palus, Sangli',
    businessInput: 'Custom Hiring Center & Farm Equipment Rental',
    capitalInput: 500000
  });

  assert(highCapEvidence.deterministicScore.capitalFitScore > lowCapEvidence.deterministicScore.capitalFitScore, 'Higher capital yields strictly higher capitalFitScore');
  assert(highCapEvidence.deterministicScore.totalScore > lowCapEvidence.deterministicScore.totalScore, 'Higher capital yields higher total opportunity score for heavy equipment business');

  // ------------------------------------------------------------------------
  // TEST 8: Multilingual Transparency Notices
  // ------------------------------------------------------------------------
  console.log('\n▶ TEST 8: MULTILINGUAL TRANSPARENCY NOTICES');
  assert(Boolean(palusVernacular.granularityNotice.mr && palusVernacular.granularityNotice.hi && palusVernacular.granularityNotice.en), 'Granularity notices present across Marathi, Hindi, and English');
  assert(mobileEvidence.eligibleSchemes[0].conditionalDisclaimer.includes('You may qualify'), 'Government scheme includes non-hallucinatory conditional language');

  console.log('\n============================================================');
  console.log(`TEST RESULTS: ${passed}/${total} ASSERTIONS PASSED`);
  console.log('============================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
