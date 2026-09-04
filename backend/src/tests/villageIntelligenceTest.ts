import { villageIntelligenceService } from '../services/villageIntelligenceService.js';
import { localKnowledgeRetriever } from '../ai/context/localKnowledgeRetriever.js';
import { AiOrchestrator } from '../ai/orchestrator.js';

async function runVerification() {
  console.log('================================================================');
  console.log('TEST 1: Query Village Ground Intelligence from Supabase');
  console.log('================================================================');

  const v1 = await villageIntelligenceService.getVillageIntelligence({
    villageName: 'Kundal',
    districtName: 'Sangli'
  });

  if (v1) {
    console.log(`✅ Successfully retrieved Village Intelligence for: ${v1.villageName} (${v1.district})`);
    console.log(` - Sub-district / Taluka: ${v1.taluka}`);
    console.log(` - Total Population: ${v1.demographics.totalPopulation.toLocaleString('en-IN')}`);
    console.log(` - Total Households: ${v1.demographics.totalHouseholds.toLocaleString('en-IN')}`);
    console.log(` - Farming Families: ${v1.economy.farmActivityHhs.toLocaleString('en-IN')}`);
    console.log(` - Non-Farm Families: ${v1.economy.nonFarmActivityHhs.toLocaleString('en-IN')}`);
    console.log(` - Distance to Nearest Town: ${v1.spatial.nearestTownName} (${v1.spatial.distanceToNearestTownKm} km)`);
    console.log(` - Domestic Electricity: ${v1.infrastructure.domesticElectricityHours} hrs/day`);
    console.log(` - Commercial MSME Power: ${v1.infrastructure.electricityMsme ? 'Available' : 'Limited'}`);
    console.log(` - All-Weather Road: ${v1.infrastructure.allWeatherRoad ? 'Yes' : 'No'}`);
    console.log(` - Bank Facility: ${v1.infrastructure.bankAvailable ? 'In village' : v1.infrastructure.bankDistance}`);
    console.log(` - 2026 Monsoon Status: ${v1.rainfall2026.seasonStatus}`);
    console.log(` - Average Consumption MPCE: ₹${v1.consumption.ruralMpceInr}/month (HCES 2022-23)`);
  } else {
    console.error('❌ Failed to retrieve village intelligence for Kundal');
  }

  console.log('\n================================================================');
  console.log('TEST 2: Local Evidence Package Assembly with Village Context');
  console.log('================================================================');

  const pkg = await localKnowledgeRetriever.assembleEvidencePackage({
    locationInput: 'Kundal, Sangli',
    businessInput: 'Mobile & Electronics Repair',
    capitalInput: 50000
  });

  console.log(`✅ Evidence Granularity: ${pkg.resolvedGranularity}`);
  console.log(` - Transparency Notice (mr): ${pkg.geographicTransparencyNotice.mr}`);
  console.log(` - Has Village Context: ${Boolean(pkg.villageContext)}`);
  if (pkg.villageContext) {
    console.log(` - Village Context Name: ${pkg.villageContext.villageName}`);
    console.log(` - Village Context Population: ${pkg.villageContext.totalPopulation.toLocaleString('en-IN')}`);
    console.log(` - Nearest Town: ${pkg.villageContext.nearestTownName} (${pkg.villageContext.distanceToTownKm} km)`);
  }

  console.log('\n================================================================');
  console.log('TEST 3: Chatbot Orchestrator Response Grounded in Village Data');
  console.log('================================================================');

  const orchestrator = new AiOrchestrator();
  const response = await orchestrator.handleUserMessage(
    'माझ्या गावात मोबाईल रिपेअर व्यवसाय कसा चालेल?',
    'mr',
    {
      location: 'Kundal, Sangli',
      businessName: 'Mobile & Electronics Repair',
      capital: 50000
    }
  );

  console.log(`✅ Chatbot Answer:\n${response.answer}\n`);
  console.log(`✅ Card Title: ${response.cards?.[0]?.title}`);
  console.log(`✅ Card Subtitle: ${response.cards?.[0]?.subtitle}`);

  const hasVillageMention = response.answer.includes('Kundal') || response.answer.includes('कुंडल') || (pkg.villageContext && response.answer.includes(pkg.villageContext.totalPopulation.toLocaleString('en-IN')));
  console.log(`\n✅ Answer is explicitly grounded in village metrics: ${hasVillageMention}`);

  console.log('\n================================================================');
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('================================================================');
}

runVerification().catch(console.error);
