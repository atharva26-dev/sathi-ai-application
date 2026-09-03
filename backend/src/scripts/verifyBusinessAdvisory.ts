/**
 * SAATHI AI — BUSINESS ADVISORY KNOWLEDGE VERIFICATION SUITE
 *
 * Validates the 13 required test cases across business archetypes,
 * dynamic discovery, location switching, capital scaling, unexpected queries,
 * and multilingual vernacular adherence.
 */

import { AiOrchestrator } from '../ai/orchestrator.js';

function assert(condition: boolean, testName: string, details?: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error(`   Details: ${details}`);
    process.exit(1);
  } else {
    console.log(`✅ [PASS] ${testName}`);
  }
}

async function runAdvisoryVerification() {
  console.log('======================================================================');
  console.log('SAATHI BUSINESS ADVISORY INTELLIGENCE - 13 TEST VERIFICATION SUITE');
  console.log('======================================================================\n');

  const orchestrator = new AiOrchestrator();

  // TEST 1: User selects Dairy
  console.log('--- Test 1: User selects Dairy ---');
  const res1 = await orchestrator.handleUserMessage(
    'मी डेअरी व्यवसाय कसा सुरू करू?',
    'mr',
    { businessName: 'Dairy', location: 'Palus, Sangli, Maharashtra', capital: 80000 }
  );
  assert(
    res1.answer.includes('दुग्ध') || res1.answer.includes('पनीर') || res1.answer.includes('Dairy'),
    'Test 1.1: Response is strictly tailored to Dairy',
    `Answer snippet: ${res1.answer.slice(0, 150)}`
  );
  assert(
    res1.answer.includes('वीज खंडित') || res1.answer.includes('शीतकरण') || res1.answer.includes('नाशवंत') || res1.answer.includes('उधारी'),
    'Test 1.2: Dairy addresses operational and perishable risks'
  );

  // TEST 2: User selects Mobile Repair
  console.log('--- Test 2: User selects Mobile Repair ---');
  const res2 = await orchestrator.handleUserMessage(
    'How do I start a mobile repair shop with ₹50,000?',
    'en',
    { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli, Maharashtra', capital: 50000 }
  );
  assert(
    res2.answer.includes('Mobile') || res2.answer.includes('Repair'),
    'Test 2.1: Response is strictly tailored to Mobile Repair',
    `Answer snippet: ${res2.answer.slice(0, 150)}`
  );
  assert(
    !res2.answer.includes('Dairy') && !res2.answer.includes('Paneer'),
    'Test 2.2: Mobile Repair does NOT mention Dairy or Paneer'
  );

  // TEST 3: User selects Tailoring
  console.log('--- Test 3: User selects Tailoring ---');
  const res3 = await orchestrator.handleUserMessage(
    'सिलाई का काम कैसे शुरू करें?',
    'hi',
    { businessName: 'Tailoring & Garments', location: 'Palus, Sangli, Maharashtra', capital: 40000 }
  );
  assert(
    res3.answer.includes('सिलाई') || res3.answer.includes('वस्त्र') || res3.answer.includes('Tailoring'),
    'Test 3.1: Response is strictly tailored to Tailoring',
    `Answer snippet: ${res3.answer.slice(0, 150)}`
  );

  // TEST 4: User selects Food Processing
  console.log('--- Test 4: User selects Food Processing ---');
  const res4 = await orchestrator.handleUserMessage(
    'अन्न प्रक्रिया व्यवसाय कसा सुरू करावा?',
    'mr',
    { businessName: 'Food Processing & Spices', location: 'Palus, Sangli, Maharashtra', capital: 60000 }
  );
  assert(
    res4.answer.includes('प्रक्रिया') || res4.answer.includes('मसाले') || res4.answer.includes('Food'),
    'Test 4.1: Response is tailored to Food Processing'
  );

  // TEST 5: User selects Solar Services
  console.log('--- Test 5: User selects Solar Services ---');
  const res5 = await orchestrator.handleUserMessage(
    'How to start a solar equipment installation business?',
    'en',
    { businessName: 'Solar Services', location: 'Palus, Sangli, Maharashtra', capital: 100000 }
  );
  assert(
    res5.answer.includes('Solar') || res5.answer.includes('सोलर') || res5.answer.includes('सौर'),
    'Test 5.1: Response is tailored to Solar Services',
    `Answer snippet: ${res5.answer.slice(0, 150)}`
  );

  // TEST 6: User gives a business NOT in the knowledge base
  console.log('--- Test 6: Business not present in KB (Custom Micro-Enterprise) ---');
  const res6 = await orchestrator.handleUserMessage(
    'How do I start a drone agricultural spraying service?',
    'en',
    { businessName: 'Drone Agricultural Spraying Service', location: 'Palus, Sangli, Maharashtra', capital: 150000 }
  );
  assert(
    res6.answer.includes('Drone') || res6.answer.includes('Spraying') || res6.answer.includes('PS-91'),
    'Test 6.1: Handles custom non-KB business without crashing or reverting to Dairy',
    `Answer snippet: ${res6.answer.slice(0, 150)}`
  );
  assert(
    !res6.answer.includes('Fresh Dairy') && !res6.answer.includes('Paneer Processing'),
    'Test 6.2: Custom business does NOT force Dairy/Paneer'
  );

  // TEST 7: User asks "What business should I start?"
  console.log('--- Test 7: User asks "What business should I start?" ---');
  const res7 = await orchestrator.handleUserMessage(
    'माझ्या गावात कोणता व्यवसाय करावा?',
    'mr',
    { location: 'Palus, Sangli, Maharashtra', capital: 50000 }
  );
  assert(
    res7.answer.includes('संधी स्कोअर') || res7.answer.includes('हळद') || res7.answer.includes('बेदाणा') || res7.answer.includes('संधी'),
    'Test 7.1: Dynamically discovers local opportunities for Palus',
    `Answer snippet: ${res7.answer.slice(0, 200)}`
  );
  assert(
    res7.cards && res7.cards.length > 0,
    'Test 7.2: Returns structured cards for discovery'
  );

  // TEST 8: User changes village
  console.log('--- Test 8: User changes village (Palus vs Nashik) ---');
  const res8Palus = await orchestrator.handleUserMessage(
    'Find business for me',
    'en',
    { location: 'Palus, Sangli, Maharashtra', capital: 50000 }
  );
  const res8Nashik = await orchestrator.handleUserMessage(
    'Find business for me',
    'en',
    { location: 'Lasalgaon, Nashik, Maharashtra', capital: 50000 }
  );
  assert(
    res8Palus.answer !== res8Nashik.answer,
    'Test 8.1: Opportunity discovery differs between Palus and Nashik'
  );
  assert(
    res8Nashik.answer.includes('Nashik') || res8Nashik.answer.includes('Onion') || res8Nashik.answer.includes('Tomato') || res8Nashik.answer.includes('Dehydrated'),
    'Test 8.2: Nashik reflects local horticultural strengths (Onion/Tomato)'
  );

  // TEST 9: User changes available capital
  console.log('--- Test 9: User changes available capital (₹25,000 vs ₹2,00,000) ---');
  const res9Low = await orchestrator.handleUserMessage(
    'How do I start?',
    'en',
    { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli, Maharashtra', capital: 25000 }
  );
  const res9High = await orchestrator.handleUserMessage(
    'How do I start?',
    'en',
    { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli, Maharashtra', capital: 200000 }
  );
  assert(
    res9Low.answer.includes('25,000') && res9High.answer.includes('2,00,000'),
    'Test 9.1: Financial calculations dynamically reflect user available capital'
  );

  // TEST 10: User asks an unexpected business question
  console.log('--- Test 10: Unexpected business question ---');
  const res10 = await orchestrator.handleUserMessage(
    'स्पर्धकाने अचानक खूप स्वस्त दर केले तर मी काय करू?',
    'mr',
    { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli, Maharashtra', capital: 50000 }
  );
  assert(
    res10.answer.includes('दर') && (res10.answer.includes('वॉरंटी') || res10.answer.includes('गुणवत्ता')),
    'Test 10.1: Answers unexpected price war query with quality/warranty strategy'
  );

  // TEST 11: User asks in Marathi
  console.log('--- Test 11: Marathi Language Response ---');
  const res11 = await orchestrator.handleUserMessage(
    'ग्राहकांना उधारी द्यावी का?',
    'mr',
    { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli, Maharashtra', capital: 50000 }
  );
  assert(
    res11.answer.includes('उधारी') && res11.answer.includes('खेळते भांडवल'),
    'Test 11.1: Generates vernacular Marathi response on credit control'
  );

  // TEST 12: User asks in Hindi
  console.log('--- Test 12: Hindi Language Response ---');
  const res12 = await orchestrator.handleUserMessage(
    'ग्राहकों को उधारी देनी चाहिए क्या?',
    'hi',
    { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli, Maharashtra', capital: 50000 }
  );
  assert(
    res12.answer.includes('उधारी') && res12.answer.includes('कार्यशील पूंजी'),
    'Test 12.1: Generates vernacular Hindi response on credit control'
  );

  // TEST 13: User asks in English
  console.log('--- Test 13: English Language Response ---');
  const res13 = await orchestrator.handleUserMessage(
    'Should I give credit to village customers?',
    'en',
    { businessName: 'Mobile & Electronics Repair', location: 'Palus, Sangli, Maharashtra', capital: 50000 }
  );
  assert(
    res13.answer.includes('credit') && res13.answer.includes('working capital'),
    'Test 13.1: Generates English response on credit control'
  );

  console.log('\n======================================================================');
  console.log('ALL 13 BUSINESS ADVISORY INTELLIGENCE TESTS PASSED SUCCESSFULLY! ✅');
  console.log('======================================================================');
}

runAdvisoryVerification().catch((err) => {
  console.error('Fatal error running advisory verification:', err);
  process.exit(1);
});
