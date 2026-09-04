import assert from 'assert';
import { aiOrchestrator } from '../ai/orchestrator.js';
import { indiaGeographicMaster } from '../domain/location/indiaGeographicMaster.js';
import { ragRetriever } from '../ai/rag/ragRetriever.js';

async function runVerification() {
  console.log('============================================================');
  console.log('🧪 SAATHI DYNAMIC LOCATION & PARALLEL RAG VERIFICATION SUITE');
  console.log('============================================================\n');

  // TEST 1: Direct Geographic Resolution Tests
  console.log('--- TEST 1: Strict Unicode Boundary Geographic Resolution ---');
  const testLocations = [
    { input: 'मी कोल्हापूरचा आहे, मला व्यवसाय सुरू करायचा आहे', expectedDistrict: 'Kolhapur', expectedState: 'Maharashtra' },
    { input: 'पुण्यात काय संधी आहे?', expectedDistrict: 'Pune', expectedState: 'Maharashtra' },
    { input: 'बेंगळुरू मध्ये कोणता व्यवसाय चांगला चालेल?', expectedDistrict: 'Bengaluru Urban', expectedState: 'Karnataka' },
    { input: 'वाराणसी मध्ये काय करता येईल?', expectedDistrict: 'Varanasi', expectedState: 'Uttar Pradesh' },
    { input: 'सातारा जिल्ह्यातील संधी', expectedDistrict: 'Satara', expectedState: 'Maharashtra' },
    { input: 'यासाठी भांडवल किती लागेल?', expectedUnknown: true },
    { input: 'स्पर्धक कसे हाताळावेत?', expectedUnknown: true },
    { input: 'नफा किती मिळू शकतो?', expectedUnknown: true }
  ];

  for (const t of testLocations) {
    const res = indiaGeographicMaster.resolveLocation(t.input);
    if (t.expectedUnknown) {
      assert(res.isUnknown === true || res.resolvedGranularity === 'Unknown', `Expected non-location query "${t.input}" to resolve as Unknown, got ${res.district}`);
      console.log(`  ✓ Correctly rejected non-location query as Unknown: "${t.input}"`);
    } else {
      assert.strictEqual(res.district, t.expectedDistrict, `District mismatch for "${t.input}". Expected: ${t.expectedDistrict}, Got: ${res.district}`);
      assert.strictEqual(res.state, t.expectedState, `State mismatch for "${t.input}". Expected: ${t.expectedState}, Got: ${res.state}`);
      console.log(`  ✓ Dynamic location resolved accurately: "${t.input}" -> ${res.district}, ${res.state}`);
    }
  }

  // TEST 2: Parallel Sathi Docs RAG Retrieval across Marathi/Hindi keywords
  console.log('\n--- TEST 2: Parallel Sathi Docs RAG Retrieval Engine ---');
  const status = ragRetriever.getStatus();
  console.log(`  Status: Loaded=${status.isLoaded}, Total Chunks=${status.totalChunks}, Index Terms=${status.totalTerms}`);
  assert(status.isLoaded && status.totalChunks > 0, 'RAG index must be loaded with chunks from Sathi Docs');

  const ragQueries = ['भांडवल व कर्ज नियोजन', 'स्पर्धक व ग्राहक', 'ग्रामीण व्यवसाय संधी'];
  for (const q of ragQueries) {
    const ragRes = await ragRetriever.retrieve(q, 3);
    assert(ragRes.chunks.length > 0, `RAG should retrieve chunks for query "${q}"`);
    assert(ragRes.citedSources.length > 0, `RAG should cite sources for query "${q}"`);
    console.log(`  ✓ Query "${q}" matched ${ragRes.totalCandidates} chunks; Top source: "${ragRes.citedSources[0]?.title}" (${ragRes.citedSources[0]?.sourceFile})`);
  }

  // TEST 3: Multi-Turn Orchestration with Dynamic Location & No Location Drift
  console.log('\n--- TEST 3: Multi-Turn Conversation & Location Continuity ---');
  const testUserId = 'test_usr_dyn_' + Date.now();

  // Turn 1: User says they are from Kolhapur and want grocery retail
  console.log('  Turn 1: User specifies Kolhapur...');
  const turn1 = await aiOrchestrator.handleUserMessage(
    'मी कोल्हापूरचा आहे, मला किराणा दुकान सुरू करायचे आहे',
    'mr',
    undefined,
    testUserId
  );
  assert(
    turn1.answer.includes('कोल्हापूर') || (turn1.assumptions && turn1.assumptions.some((a) => a.includes('Kolhapur') || a.includes('कोल्हापूर'))),
    'Turn 1 must be strictly grounded to Kolhapur'
  );
  assert(
    !turn1.answer.includes('बेंगळुरू') && !turn1.answer.includes('पलूस'),
    'Turn 1 must NOT drift to Bengaluru or Palus'
  );
  assert(turn1.sources && turn1.sources.length > 0, 'Turn 1 must cite research / official sources');
  console.log('  ✓ Turn 1 grounded strictly in Kolhapur, Maharashtra with empirical sources cited.');

  // Turn 2: Follow-up question on capital without specifying location
  console.log('  Turn 2: Follow-up question on capital (location not mentioned)...');
  const historyTurn2 = [
    { role: 'user' as const, content: 'मी कोल्हापूरचा आहे, मला किराणा दुकान सुरू करायचे आहे' },
    { role: 'assistant' as const, content: turn1.answer }
  ];
  const turn2 = await aiOrchestrator.handleUserMessage(
    'यासाठी भांडवल किती लागेल आणि कर्ज कसे मिळेल?',
    'mr',
    undefined,
    testUserId,
    historyTurn2
  );
  assert(
    !turn2.answer.includes('बेंगळुरू') && !turn2.answer.includes('पलूस'),
    'Turn 2 must NOT drift to Bengaluru or Palus on follow-up'
  );
  assert(turn2.sources && turn2.sources.length > 0, 'Turn 2 must include Sathi Docs citations');
  console.log('  ✓ Turn 2 answered follow-up on capital directly without repeating template or drifting location.');

  // Turn 3: Dynamic location switch to Bengaluru
  console.log('  Turn 3: Dynamic user location switch to Bengaluru...');
  const historyTurn3 = [
    ...historyTurn2,
    { role: 'user' as const, content: 'यासाठी भांडवल किती लागेल आणि कर्ज कसे मिळेल?' },
    { role: 'assistant' as const, content: turn2.answer }
  ];
  const turn3 = await aiOrchestrator.handleUserMessage(
    'आणि जर मी बेंगळुरू मध्ये सुरू केले तर?',
    'mr',
    undefined,
    testUserId,
    historyTurn3
  );
  assert(
    turn3.answer.includes('बेंगळुरू') ||
      turn3.answer.includes('Bengaluru') ||
      (turn3.assumptions && turn3.assumptions.some((a) => a.includes('Bengaluru') || a.includes('बेंगळुरू'))),
    'Turn 3 must dynamically switch to Bengaluru'
  );
  assert(turn3.sources && turn3.sources.length > 0, 'Turn 3 must include Sathi Docs citations');
  console.log('  ✓ Turn 3 dynamically switched location to Bengaluru Urban, Karnataka!');

  // Turn 4: Dynamic location switch to Pune
  console.log('  Turn 4: Dynamic user location switch to Pune...');
  const turn4 = await aiOrchestrator.handleUserMessage(
    'पुण्यात किराणा दुकानासाठी काय परिस्थिती आहे?',
    'mr',
    undefined,
    testUserId
  );
  assert(
    turn4.answer.includes('पुणे') ||
      turn4.answer.includes('Pune') ||
      (turn4.assumptions && turn4.assumptions.some((a) => a.includes('Pune') || a.includes('पुणे'))),
    'Turn 4 must dynamically switch to Pune'
  );
  assert(turn4.sources && turn4.sources.length > 0, 'Turn 4 must include Sathi Docs citations');
  console.log('  ✓ Turn 4 dynamically switched location to Pune, Maharashtra!');

  console.log('\n============================================================');
  console.log('🎉 ALL DYNAMIC LOCATION & PARALLEL RAG TESTS PASSED 100%!');
  console.log('============================================================');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
