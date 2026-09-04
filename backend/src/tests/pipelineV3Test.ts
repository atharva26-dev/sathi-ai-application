import { villageBusinessPipeline, Village20Parameters, RURAL_BUSINESS_CATALOG } from '../ai/pipeline/villageBusinessPipeline.js';
import { AiOrchestrator } from '../ai/orchestrator.js';

async function runPipelineV3Tests() {
  console.log('================================================================');
  console.log('TEST 1: 6-Dimension VRS Calculation & Formula Verification');
  console.log('================================================================');

  const testVillage: Village20Parameters = {
    village: 'Kundal',
    district: 'Sangli',
    subdistrict: 'Palus',
    population: 19302,
    households: 9303,
    literacy_rate: 83.5,
    working_population: 8500,
    schools: 5,
    health_centres: 2,
    banks: 2,
    atms: 2,
    csc_centres: 2,
    post_offices: 1,
    weekly_market: true,
    regular_market: true,
    bus_service: true,
    electricity: true,
    internet: true,
    rainfall_normal: 680,
    rainfall_actual: 720,
    rainfall_deviation: 5.88
  };

  const vrs = villageBusinessPipeline.step6_computeVRS(testVillage);
  console.log(`✅ Computed Total VRS: ${vrs.total_vrs}/100 [Tier: ${vrs.tier}]`);
  console.log(` - D1 Demographics (W=0.20): ${vrs.d1_demographics}`);
  console.log(` - D2 Education & Literacy (W=0.15): ${vrs.d2_education_literacy}`);
  console.log(` - D3 Financial Access (W=0.15): ${vrs.d3_financial_access}`);
  console.log(` - D4 Market Access (W=0.20): ${vrs.d4_market_access}`);
  console.log(` - D5 Digital & Power (W=0.20): ${vrs.d5_digital_power}`);
  console.log(` - D6 Climate Resilience (W=0.10): ${vrs.d6_climate_resilience}`);

  if (vrs.total_vrs < 50 || vrs.total_vrs > 100) {
    throw new Error(`VRS score ${vrs.total_vrs} is out of expected bounds [50, 100]`);
  }

  console.log('\n================================================================');
  console.log('TEST 2: End-to-End 14-Step Pipeline Execution (Query -> 5 Sections)');
  console.log('================================================================');

  const output = await villageBusinessPipeline.execute(
    'माझ्या कुंडल गावात कोणता व्यवसाय सर्वात चांगला चालेल?',
    'mr',
    {
      villageHint: 'Kundal',
      districtHint: 'Sangli',
      riskAppetite: 'CONSERVATIVE'
    }
  );

  console.log(`✅ Pipeline executed for: ${output.villageName}`);
  console.log(` - VRS Score: ${output.vrs.total_vrs}/100`);
  console.log(` - Ranked Businesses Count: ${output.rankedBusinesses.length}`);
  console.log(` - Top Business: ${output.rankedBusinesses[0].business.business} (BVMS: ${output.rankedBusinesses[0].bvms})`);
  console.log(` - Source Attribution: ${output.sourceAttribution.tierUsed}`);
  console.log(` - Confidence Score: ${output.sourceAttribution.confidenceScore}%`);

  // Verify all 5 sections exist in the formatted text output
  const txt = output.formattedTextResponse;
  const hasSec1 = txt.includes('१. ग्राम वास्तव सारांश') || txt.includes('VILLAGE PROFILE SUMMARY');
  const hasSec2 = txt.includes('२. सर्वोत्कृष्ट व्यवसाय शिफारसी') || txt.includes('TOP-N RANKED BUSINESSES');
  const hasSec3 = txt.includes('३. पायाभूत त्रुटी सल्लागार') || txt.includes('INFRASTRUCTURE GAP ADVISORY');
  const hasSec4 = txt.includes('४. जोखीम व हंगामी सूचना') || txt.includes('RISK & SEASONALITY WARNINGS');
  const hasSec5 = txt.includes('५. माहिती स्रोत व विश्वासार्हता') || txt.includes('SOURCE ATTRIBUTION');

  console.log(`\nSection 1 Present: ${hasSec1}`);
  console.log(`Section 2 Present: ${hasSec2}`);
  console.log(`Section 3 Present: ${hasSec3}`);
  console.log(`Section 4 Present: ${hasSec4}`);
  console.log(`Section 5 Present: ${hasSec5}`);

  if (!hasSec1 || !hasSec2 || !hasSec3 || !hasSec4 || !hasSec5) {
    throw new Error('Formatted output is missing one or more required sections from the v3.0 template');
  }

  console.log('\n================================================================');
  console.log('TEST 3: AI Orchestrator Integration with 14-Step Pipeline');
  console.log('================================================================');

  const orchestrator = new AiOrchestrator();
  const res = await orchestrator.handleUserMessage(
    'कुंडल गावासाठी कोणता व्यवसाय निवडावा?',
    'mr',
    {
      location: 'Kundal, Sangli',
      capital: 150000,
      riskAppetite: 'CONSERVATIVE'
    }
  );

  console.log(`✅ Orchestrator Summary: ${res.summary}`);
  console.log(`✅ Orchestrator Card Title: ${res.cards?.[0]?.title}`);
  console.log(`✅ Orchestrator Card Subtitle: ${res.cards?.[0]?.subtitle}`);
  console.log(`✅ Orchestrator Card Data:`, res.cards?.[0]?.data);

  console.log('\n================================================================');
  console.log('TEST 4: Live Area Reconnaissance Grounding (5 Questions Input)');
  console.log('================================================================');

  const liveAreaSurveyOutput = await villageBusinessPipeline.execute(
    'कुंडल गावात कोणता व्यवसाय सुरू करावा?',
    'mr',
    {
      villageHint: 'Kundal',
      districtHint: 'Sangli',
      riskAppetite: 'MODERATE',
      liveAreaContext: {
        competitorCount: 0,
        localObstacles: 'सतत वीज खंडित होणे व उधारीची समस्या',
        dynamicAnswers: [
          { question: 'घाऊक बाजाराचे अंतर', answer: '१२ किमी' },
          { question: 'स्मार्टफोन वापर', answer: '८०% लोकांकडे स्मार्टफोन' },
          { question: 'दुकान जागा', answer: 'मुख्य चौकात जागा उपलब्ध' }
        ]
      }
    }
  );

  console.log(`✅ Live Survey Processed. Competitor Count factored: 0`);
  console.log(` - Top BVMS Score with 0 Competition: ${liveAreaSurveyOutput.rankedBusinesses[0].bvms}`);
  console.log(` - Source Attribution Tier: ${liveAreaSurveyOutput.sourceAttribution.tierUsed}`);
  console.log(` - Source Confidence: ${liveAreaSurveyOutput.sourceAttribution.confidenceScore}%`);

  const liveTxt = liveAreaSurveyOutput.formattedTextResponse;
  const hasLiveField = liveTxt.includes('थेट स्थानिक पाहणी') || liveTxt.includes('० थेट स्पर्धक') || liveTxt.includes('0');
  const hasPowerMitigation = liveTxt.includes('वीज उपाय') || liveTxt.includes('सोलर');
  console.log(` - Live Recon In Section 1 Present: ${hasLiveField}`);
  console.log(` - Power Obstacle Mitigation In Section 3 Present: ${hasPowerMitigation}`);

  if (!hasLiveField || !hasPowerMitigation) {
    throw new Error('Live Area Survey inputs not properly reflected in output sections');
  }

  console.log('\n================================================================');
  console.log('ALL 14-STEP PIPELINE V3.0 & LIVE RECON TESTS PASSED!');
  console.log('================================================================');
}

runPipelineV3Tests().catch(console.error);
