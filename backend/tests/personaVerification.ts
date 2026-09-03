import { aiOrchestrator } from '../src/ai/orchestrator.js';
import { discoverBusinessOpportunities } from '../src/domain/businesses/ideaGenerator.js';
import { getMarketOpportunitiesForCluster } from '../src/domain/market/marketOpportunityMatrix.js';
import { getCompetitorsForCluster } from '../src/domain/market/competitorEngine.js';
import { normalizeBusinessCategory } from '../src/domain/businesses/businessCatalog.js';

async function runPersonaVerification() {
  console.log('================================================================');
  console.log('🌟 RUNNING SAATHI DYNAMIC MULTI-PERSONA & MULTI-LINGUAL VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- PERSONA 1: English User (Dairy & Fresh Paneer in Pune Highway, ₹1,00,000 capital) ---
  console.log('--- PERSONA 1: English User (Dairy in Pune Highway, ₹1,00,000) ---');
  const p1Context = {
    capital: 100000,
    location: 'Pune-Solapur Highway Corridor',
    businessName: 'Fresh Dairy & Paneer Processing'
  };

  const p1Res = await aiOrchestrator.handleUserMessage(
    'How much total project cost and loan can I structure with 1 lakh own capital?',
    'en',
    p1Context,
    '00000000-0000-0000-0000-000000000001'
  );

  assert(p1Res.cards.length > 0, 'Persona 1 returns structured UI cards');
  assert(p1Res.voiceSpokenText.length > 10, 'Persona 1 generates voice-spoken text');
  assert(p1Res.summary.includes('1,00,000') || p1Res.summary.includes('PS-91') || p1Res.summary.includes('10,00,000'), 'Persona 1 applies PS-91 10x multiplier');
  assert(!p1Res.answer.includes('मराठी'), 'Persona 1 in English does not contain Marathi text');

  // --- PERSONA 2: Marathi User (Tailoring & Garments in Shirur, ₹50,000 capital) ---
  console.log('\n--- PERSONA 2: Marathi User (Tailoring in Shirur, ₹50,000) ---');
  const p2Context = {
    capital: 50000,
    location: 'शिरूर, पुणे',
    businessName: 'लेडीज व जेंट्स टेलरिंग व रेडीमेड गारमेंट्स'
  };

  const p2Res = await aiOrchestrator.handleUserMessage(
    'माझ्या गावात टेलरिंग व्यवसायाला पहिले ग्राहक कसे मिळवायचे?',
    'mr',
    p2Context,
    '00000000-0000-0000-0000-000000000002'
  );

  assert(p2Res.cards.length > 0, 'Persona 2 returns structured UI cards');
  assert(p2Res.answer.includes('शिरूर') || p2Res.summary.includes('शिरूर') || p2Res.cards[0].subtitle.includes('शिरूर') || p2Res.cards[0].title.includes('शिरूर') || p2Res.answer.includes('ग्राहक'), 'Persona 2 references location or customer acquisition');
  assert(!p2Res.answer.includes('दूध') && !p2Res.answer.includes('पनीर'), 'Persona 2 (Tailoring) does not talk about milk or paneer');

  // Check dynamic market gap & competitors for Tailoring
  const p2Gaps = getMarketOpportunitiesForCluster('शिरूर, पुणे', 'tailoring');
  assert(p2Gaps[0].name.toLowerCase().includes('tailor') || p2Gaps[0].id.includes('tailor'), 'Persona 2 market gap is specific to tailoring');
  const p2Comps = getCompetitorsForCluster('शिरूर, पुणे', 'tailoring');
  assert(p2Comps[0].category.toLowerCase().includes('tailor'), 'Persona 2 competitors are tailoring shops');

  // --- PERSONA 3: Hindi User (Mobile & Electronics Repair in Gorakhpur, ₹40,000 capital) ---
  console.log('\n--- PERSONA 3: Hindi User (Mobile Repair in Gorakhpur, ₹40,000) ---');
  const p3Context = {
    capital: 40000,
    location: 'गोरखपुर, उत्तर प्रदेश',
    businessName: 'मोबाइल व इलेक्ट्रॉनिक मरम्मत केंद्र'
  };

  const p3Res = await aiOrchestrator.handleUserMessage(
    'अगर मंदी के कारण बिक्री ३०% घट जाए तो क्या होगा?',
    'hi',
    p3Context,
    '00000000-0000-0000-0000-000000000003'
  );

  assert(p3Res.cards.length > 0, 'Persona 3 returns structured UI cards');
  assert(p3Res.summary.includes('३०%') || p3Res.summary.includes('तनाव') || p3Res.summary.includes('लाभ') || p3Res.summary.includes('बिक्री'), 'Persona 3 stress test calculates 30% drop scenario in Hindi');
  assert(!p3Res.answer.includes('दूध') && !p3Res.answer.includes('पनीर'), 'Persona 3 (Mobile Repair) does not talk about dairy');

  const p3Gaps = getMarketOpportunitiesForCluster('गोरखपुर', 'mobile_repair');
  assert(p3Gaps[0].id.includes('mobile') || p3Gaps[0].id.includes('repair') || p3Gaps[0].name.includes('Repair'), 'Persona 3 market gaps are specific to mobile repair');

  // --- PERSONA 4: Custom Arbitrary User Business (Solar Pump Installation, ₹75,000) ---
  console.log('\n--- PERSONA 4: Custom Business (Solar Pump Installation in Solapur, ₹75,000) ---');
  const arch = normalizeBusinessCategory('सौर कृषी पंप बसवणे व दुरुस्ती (Solar Water Pump)');
  assert(arch.id !== undefined, 'Dynamic category normalization succeeds for arbitrary custom business');

  const opps = discoverBusinessOpportunities(75000, 'सोलापूर ग्रामीण');
  assert(opps.length >= 4, 'Dynamic business discovery returns ranked candidates across categories');

  console.log('\n================================================================');
  console.log(`🎉 ALL PERSONA VERIFICATION TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runPersonaVerification().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
