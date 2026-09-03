import { opportunityEngine } from '../domain/opportunities/opportunityEngine.js';
import { lgdLocationService } from '../domain/location/lgdLocationService.js';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, failureDetails: string) {
  if (condition) {
    results.push({ name: testName, passed: true, details: 'Passed' });
    console.log(`✅ [PASS] ${testName}`);
  } else {
    results.push({ name: testName, passed: false, details: failureDetails });
    console.error(`❌ [FAIL] ${testName}: ${failureDetails}`);
  }
}

async function runVerification() {
  console.log('======================================================================');
  console.log('SAATHI DATA-DRIVEN OPPORTUNITY ENGINE - VERIFICATION SUITE');
  console.log('======================================================================\n');

  // Test 1: Missing Location Gate
  const missingRes = opportunityEngine.discoverOpportunities({
    availableCapital: 50000
  });
  assert(
    !missingRes.success &&
      missingRes.message === 'Location data is required for a reliable local opportunity analysis.',
    'Test 1: Missing Location Gate',
    `Expected failure with required message, got: ${JSON.stringify(missingRes)}`
  );

  // Test 2: Incomplete Skill Profile Behavior
  const noSkillRes = opportunityEngine.discoverOpportunities({
    location: 'Palus, Sangli',
    availableCapital: 60000,
    skills: []
  });
  const firstOppNoSkill = noSkillRes.opportunities[0];
  assert(
    firstOppNoSkill &&
      firstOppNoSkill.scoreBreakdown.skillCompatibilityScore === 0 &&
      firstOppNoSkill.skillCompatibilityText.en.includes('Skill compatibility could not be evaluated because your skill profile is incomplete'),
    'Test 2: Incomplete Skill Profile Handled Strictly',
    `Expected skill score 0 and incomplete skill text, got: ${JSON.stringify(firstOppNoSkill?.skillCompatibilityText)}`
  );

  // Test 3: Sangli -> Palus (Maharashtra)
  const palusRes = opportunityEngine.discoverOpportunities({
    location: 'Palus',
    availableCapital: 60000,
    skills: ['Grading', 'Packaging']
  });
  assert(
    palusRes.success && palusRes.opportunities.length > 0,
    'Test 3.1: Palus Opportunities Found',
    'No opportunities returned for Palus'
  );
  assert(
    palusRes.dataGranularity === 'Village',
    'Test 3.2: Palus Data Granularity is Village',
    `Expected 'Village', got: ${palusRes.dataGranularity}`
  );
  assert(
    palusRes.opportunities[0].title !== 'Dairy & Fresh Paneer Unit' &&
    (palusRes.opportunities[0].title.includes('Turmeric') || palusRes.opportunities[0].title.includes('Raisin')),
    'Test 3.3: Palus Does NOT Hardcode Dairy/Paneer as #1',
    `Got top opp: ${palusRes.opportunities[0].title}`
  );

  // Test 4: Nashik (Maharashtra)
  const nashikRes = opportunityEngine.discoverOpportunities({
    location: 'Nashik',
    availableCapital: 60000,
    skills: ['Food Processing']
  });
  assert(
    nashikRes.success &&
    nashikRes.opportunities[0].title.includes('Onion') || nashikRes.opportunities[0].title.includes('Tomato'),
    'Test 4: Nashik Recommends Onion / Tomato Value-Addition',
    `Got top opp: ${nashikRes.opportunities[0]?.title}`
  );

  // Test 5: Punjab -> SBS Nagar (Nawanshahr)
  const sbsRes = opportunityEngine.discoverOpportunities({
    location: 'SBS Nagar',
    availableCapital: 60000
  });
  assert(
    sbsRes.success &&
    (sbsRes.opportunities[0].title.includes('Kinnow') || sbsRes.opportunities[0].title.includes('Maize')),
    'Test 5: SBS Nagar Recommends Kinnow / Maize Feed',
    `Got top opp: ${sbsRes.opportunities[0]?.title}`
  );

  // Test 6: Haryana -> Sonipat
  const sonipatRes = opportunityEngine.discoverOpportunities({
    location: 'Sonipat',
    availableCapital: 60000
  });
  assert(
    sonipatRes.success &&
    (sonipatRes.opportunities[0].title.includes('Mushroom') || sonipatRes.opportunities[0].title.includes('Auto')),
    'Test 6: Sonipat Recommends Mushroom Canning / Fasteners',
    `Got top opp: ${sonipatRes.opportunities[0]?.title}`
  );

  // Test 7: Andhra Pradesh -> Guntur
  const gunturRes = opportunityEngine.discoverOpportunities({
    location: 'Guntur',
    availableCapital: 60000
  });
  assert(
    gunturRes.success &&
    (gunturRes.opportunities[0].title.includes('Chilli') || gunturRes.opportunities[0].title.includes('Cottonseed')),
    'Test 7: Guntur Recommends Chilli Processing / Cottonseed Oil',
    `Got top opp: ${gunturRes.opportunities[0]?.title}`
  );

  // Test 8: Rajasthan -> Jaipur
  const jaipurRes = opportunityEngine.discoverOpportunities({
    location: 'Jaipur',
    availableCapital: 60000
  });
  assert(
    jaipurRes.success &&
    (jaipurRes.opportunities[0].title.includes('Dye') || jaipurRes.opportunities[0].title.includes('Mustard')),
    'Test 8: Jaipur Recommends Block Printing / Mustard Mill',
    `Got top opp: ${jaipurRes.opportunities[0]?.title}`
  );

  // Test 9: Assam -> Kamrup
  const kamrupRes = opportunityEngine.discoverOpportunities({
    location: 'Kamrup',
    availableCapital: 60000
  });
  assert(
    kamrupRes.success &&
    (kamrupRes.opportunities[0].title.includes('Bamboo') || kamrupRes.opportunities[0].title.includes('Ginger')),
    'Test 9: Kamrup Recommends Bamboo / Ginger Processing',
    `Got top opp: ${kamrupRes.opportunities[0]?.title}`
  );

  // Test 10: Location with Incomplete Data (Low Confidence Notice)
  const unknownRes = opportunityEngine.discoverOpportunities({
    location: 'NonExistentZillaXYZ',
    availableCapital: 50000
  });
  assert(
    Boolean(
      unknownRes.success &&
      unknownRes.confidence === 'LOW' &&
      unknownRes.message?.includes('No reliable local opportunity data is available yet')
    ),
    'Test 10: Incomplete Data Location Triggers Low Confidence Warning',
    `Got: ${unknownRes.message}`
  );

  // Test 11: Differential Check: Location A != Location B
  const locATitle = palusRes.opportunities[0].title;
  const locBTitle = nashikRes.opportunities[0].title;
  const locCTitle = sbsRes.opportunities[0].title;
  const locDTitle = gunturRes.opportunities[0].title;
  assert(
    locATitle !== locBTitle && locBTitle !== locCTitle && locCTitle !== locDTitle,
    'Test 11: Differential Analysis Guaranteed (Loc A != Loc B != Loc C != Loc D)',
    `Palus: ${locATitle}, Nashik: ${locBTitle}, SBS: ${locCTitle}, Guntur: ${locDTitle}`
  );

  // Test 12: Udyam Registered Disclaimer Presence
  const udyamStatement = palusRes.opportunities[0].competitionAnalysis.statement;
  assert(
    udyamStatement.toLowerCase().includes('registered enterprises') && udyamStatement.toLowerCase().includes('informal'),
    'Test 12: Udyam Competition Statement Distinguishes Formal from Informal',
    `Got statement: ${udyamStatement}`
  );

  // Test 13: Evidence Package Completeness
  const evPackage = palusRes.opportunities[0].evidencePackage;
  assert(
    evPackage.length >= 3 &&
    evPackage.some((e) => e.signalType === 'RESOURCES') &&
    evPackage.some((e) => e.datasetName.includes('DC-MSME')),
    'Test 13: Evidence Package Links Official DC-MSME & Resource Data',
    `Evidence items count: ${evPackage.length}`
  );

  console.log('\n======================================================================');
  const allPassed = results.every((r) => r.passed);
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${results.filter((r) => r.passed).length} | FAILED: ${results.filter((r) => !r.passed).length}`);
  console.log('======================================================================');

  if (!allPassed) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
