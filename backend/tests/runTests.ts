import { calculateProjectCostStructure } from '../src/domain/finance/projectCostCalculator.js';
import { routeSchemeByProjectCost } from '../src/domain/finance/schemeRouter.js';
import { calculateRepaymentSchedule } from '../src/domain/finance/emiCalculator.js';
import { calculateBreakEven } from '../src/domain/finance/breakEvenCalculator.js';
import { calculateWorkingCapitalRequirements } from '../src/domain/finance/workingCapitalCalculator.js';
import { calculateCashFlowProjections } from '../src/domain/finance/cashFlowEngine.js';
import { runBusinessStressTest } from '../src/domain/finance/stressTestEngine.js';
import { getMarketOpportunitiesForCluster } from '../src/domain/market/marketOpportunityMatrix.js';
import { getCompetitorsForCluster } from '../src/domain/market/competitorEngine.js';
import { evaluateGovernmentSchemes } from '../src/domain/schemes/schemeEvaluator.js';
import { lgdLocationService } from '../src/domain/location/lgdLocationService.js';
import { marketScoringEngine } from '../src/domain/market/marketScoringEngine.js';
import { createApp } from '../src/app.js';
import request from 'supertest';

async function runAllTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING SAATHI BACKEND TEST SUITE (PURE ZERO-LLM MATH & APIS)');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. PS-91 Waterfall Structuring
  console.log('--- 1. PS-91 Project Cost Structuring ---');
  const struct = calculateProjectCostStructure(100000, 10, 0.35);
  assert(struct.projectCost === 1000000, '₹1,00,000 capital -> ₹10,00,000 project cost');
  assert(struct.loanComponent === 900000, '₹10,00,000 project -> ₹9,00,000 loan component (90%)');
  assert(struct.estimatedSubsidy === 350000, '₹10,00,000 project -> ₹3,50,000 PMEGP subsidy (35%)');
  assert(struct.netLoanAfterSubsidy === 550000, 'Net debt after subsidy = ₹5,50,000');

  const microStruct = calculateProjectCostStructure(10000, 10, 0.35);
  assert(microStruct.projectCost === 100000, '₹10,000 micro-capital -> ₹1,00,000 project cost');

  // 2. Scheme Routing & Boundary Conditions
  console.log('\n--- 2. Scheme Routing & Boundary Tests ---');
  const route100k = routeSchemeByProjectCost(100000);
  assert(route100k.category === 'MICRO_FINANCE', '₹1,00,000 project -> MICRO_FINANCE');
  assert(route100k.interestRate === 6.5, 'MICRO_FINANCE interest rate = 6.5%');
  assert(route100k.tenureYears === 3, 'MICRO_FINANCE tenure = 3 years');
  assert(route100k.moratoriumMonths === 3, 'MICRO_FINANCE moratorium = 3 months');

  const route140k = routeSchemeByProjectCost(140000);
  assert(route140k.category === 'MICRO_FINANCE', 'Exact boundary ₹1,40,000 -> MICRO_FINANCE');

  const route140kPlus1 = routeSchemeByProjectCost(140001);
  assert(route140kPlus1.category === 'TERM_LOAN', 'Boundary ₹1,40,001 -> TERM_LOAN');
  assert(route140kPlus1.interestRate === 8.0, 'TERM_LOAN interest rate = 8.0%');
  assert(route140kPlus1.tenureYears === 7, 'TERM_LOAN tenure = 7 years');
  assert(route140kPlus1.moratoriumMonths === 6, 'TERM_LOAN moratorium = 6 months');

  const route50LPlus1 = routeSchemeByProjectCost(5000001);
  assert(route50LPlus1.category === 'LARGE_ENTERPRISE_SPECIAL_APPRAISAL', '₹50,00,001 project -> LARGE_ENTERPRISE_SPECIAL_APPRAISAL');
  assert(route50LPlus1.interestRate === 9.5, 'SPECIAL_WINDOW interest rate = 9.5%');
  assert(route50LPlus1.tenureYears === 10, 'SPECIAL_WINDOW tenure = 10 years');

  // 3. Reducing Balance EMI with Moratorium
  console.log('\n--- 3. Reducing Balance EMI ---');
  const emi = calculateRepaymentSchedule(900000, 9.5, 60, 6);
  assert(emi.regularMonthlyEMI > 18000 && emi.regularMonthlyEMI < 22000, 'Regular EMI is ~₹20,000/month');
  assert(emi.moratoriumMonthlyPayment === Math.round((900000 * 0.095) / 12), 'Moratorium payment = interest only');
  assert(emi.schedule.length === 60, 'Schedule has exactly 60 months');
  assert(emi.schedule[0].isMoratorium === true, 'Month 1 is moratorium');
  assert(emi.schedule[5].isMoratorium === true, 'Month 6 is moratorium');
  assert(emi.schedule[6].isMoratorium === false, 'Month 7 is regular repayment');
  assert(emi.schedule[59].closingBalance === 0, 'Month 60 loan is fully paid off (0 balance)');
  assert(emi.totalInterestPayable > 0, 'Total interest payable calculated correctly');

  // 4. Break-Even Math
  console.log('\n--- 4. Break-Even Calculations ---');
  const be = calculateBreakEven(32000, 245, 320);
  assert(be.contributionMarginPerUnit === 75, 'Unit margin = ₹320 - ₹245 = ₹75');
  assert(be.monthlyFixedCosts === 32000, 'Total fixed cost = ₹32,000');
  assert(be.breakEvenUnitsPerMonth === Math.ceil(32000 / 75), 'Monthly break-even units calculated');
  assert(be.breakEvenUnitsPerDay === Math.ceil(be.breakEvenUnitsPerMonth / 30), 'Daily break-even units calculated');
  assert(be.isViable === true, 'Break-even analysis is viable');

  // 5. Working Capital Buffers
  console.log('\n--- 5. Working Capital Buffers ---');
  const wc = calculateWorkingCapitalRequirements(25, 245, 15000, 10000, 200000, 20);
  assert(wc.rawMaterialBufferCost === 25 * 245 * 20, '20-day raw material buffer calculated');
  assert(wc.monthlyOperatingCosts === 25000, 'Monthly operating expenses = ₹25,000');
  assert(wc.emergencyBuffer === Math.round((25000 / 30) * 15), '15-day emergency buffer calculated');
  assert(wc.hasLiquidityGap === false, '₹2,00,000 capital is adequate for working capital');

  // 6. Cash Flow & Stress Testing
  console.log('\n--- 6. Cash Flow & Stress Testing ---');
  const cf = calculateCashFlowProjections(25, 320, 245, 15000, 8000, 6000, 3000, 19000);
  assert(cf.baseCase.isCashPositive === true, 'Base case is cash positive');
  assert(cf.baseCase.debtServiceCoverageRatio > 1.0, 'DSCR > 1.0 (Bankable)');

  const st = runBusinessStressTest(25, 320, 245, 32000, 75000);
  assert(st.scenarios.length === 4, '4 stress test scenarios evaluated');
  assert(st.overallResilienceScore >= 60, 'Overall resilience score >= 60');

  // 7. Dynamic Market Gap & Business Isolation Tests
  console.log('\n--- 7. Dynamic Market Gap & Business Isolation ---');
  // 7.1 Dairy Category
  const dairyGaps = getMarketOpportunitiesForCluster('सुपे, बारामती', 'dairy');
  assert(dairyGaps.length >= 2, 'Found dairy market opportunities');
  assert(dairyGaps[0].id === 'gap_paneer', 'Dairy top opportunity is fresh paneer');

  // 7.2 Mobile Repair Category (Bug Reproduction scenario)
  const mobileGaps = getMarketOpportunitiesForCluster('पलूस, सांगली', 'mobile_repair');
  assert(mobileGaps.length >= 3, 'Found mobile repair opportunities');
  assert(mobileGaps[0].id === 'gap_doorstep_mobile_repair', 'Mobile repair top opportunity is doorstep repair');
  assert(!mobileGaps.some(g => g.name.toLowerCase().includes('paneer') || g.id.includes('paneer')), 'Mobile repair contains ZERO paneer items');

  const mobileComps = getCompetitorsForCluster('पलूस, सांगली', 'mobile_repair');
  assert(mobileComps.length >= 2, 'Found mobile repair competitors');
  assert(!mobileComps.some(c => c.name.toLowerCase().includes('dairy')), 'Mobile repair competitors contain ZERO dairy items');

  // 7.3 Tailoring Category
  const tailorGaps = getMarketOpportunitiesForCluster('शिरूर, पुणे', 'tailoring');
  assert(tailorGaps[0].id === 'gap_custom_tailoring', 'Tailoring top opportunity is custom tailoring');
  assert(!tailorGaps.some(g => g.id.includes('mobile') || g.id.includes('paneer')), 'Tailoring contains ZERO mobile or dairy items');

  // 7.4 LGD India Geographic Hierarchy
  console.log('\n--- 7.4 LGD India Location Hierarchy & Search ---');
  const palusMatch = lgdLocationService.searchLocation('Palus')[0];
  assert(palusMatch.village === 'Palus' && palusMatch.district === 'Sangli' && palusMatch.state === 'Maharashtra', 'LGD search locates Palus -> Sangli -> Maharashtra');
  assert(palusMatch.villageLgdCode === 568320, 'Palus village LGD code is 568320');

  // 8. Supertest REST API End-to-End Testing
  console.log('\n--- 8. Supertest REST API End-to-End ---');
  const app = createApp();

  const resHealth = await request(app).get('/health');
  assert(resHealth.status === 200 && resHealth.body.data.status === 'UP', 'GET /health -> 200 UP');

  // Location Search API
  const resLoc = await request(app).get('/api/v1/location/search?q=Palus');
  assert(resLoc.status === 200 && resLoc.body.data.length > 0 && resLoc.body.data[0].village === 'Palus', 'GET /location/search?q=Palus -> 200 OK');

  // Canonical Market Gap Analyze API for Mobile Repair
  const resMarketGap = await request(app)
    .post('/api/v1/market-gap/analyze')
    .send({
      userId: '00000000-0000-0000-0000-000000000001',
      businessName: 'Mobile & Electronics Repair',
      location: { village: 'Palus', district: 'Sangli', state: 'Maharashtra' },
      availableCapital: 250000,
      analysisRadiusKm: 10,
      language: 'en'
    });
  assert(resMarketGap.status === 200, 'POST /market-gap/analyze -> 200 OK');
  assert(resMarketGap.body.data.opportunities[0].id === 'gap_doorstep_mobile_repair', 'POST /market-gap/analyze returns mobile repair opportunities');
  assert(!JSON.stringify(resMarketGap.body.data).includes('Fresh Malai') && !JSON.stringify(resMarketGap.body.data).includes('Fresh Paneer'), 'POST /market-gap/analyze contains ZERO paneer data');
  assert(resMarketGap.body.data.scoreBreakdown.overallOpportunity > 0, 'POST /market-gap/analyze calculates deterministic opportunity score');

  const resStruct = await request(app)
    .post('/api/v1/finance/structure-project')
    .send({ availableCapital: 100000, marginPercent: 10, subsidyRate: 0.35 });
  assert(resStruct.status === 200 && resStruct.body.data.structure.projectCost === 1000000, 'POST /finance/structure-project -> 200 OK');

  const resEmi = await request(app)
    .post('/api/v1/finance/emi')
    .send({ loanAmount: 900000, annualInterestRate: 9.5, tenureMonths: 60, moratoriumMonths: 6 });
  assert(resEmi.status === 200 && resEmi.body.data.schedule.length === 60, 'POST /finance/emi -> 200 OK');

  const resRadar = await request(app).get('/api/v1/market/radar?location=Palus&business=Mobile%20Repair');
  assert(resRadar.status === 200 && resRadar.body.data.indicators.length > 0, 'GET /market/radar -> 200 OK');

  const resSchemes = await request(app).get('/api/v1/schemes');
  assert(resSchemes.status === 200 && resSchemes.body.data.length > 0, 'GET /schemes -> 200 OK');

  console.log('\n================================================================');
  console.log(`🎉 ALL TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runAllTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
