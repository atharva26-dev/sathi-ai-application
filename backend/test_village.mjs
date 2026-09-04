import { villageBusinessPipeline } from './src/ai/pipeline/villageBusinessPipeline.js';

async function test() {
  console.log('--- TEST villageBusinessPipeline.execute ---');
  const res = await villageBusinessPipeline.execute(
    'मी कोल्हापूरचा आहे, मला व्यवसाय सुरू करायचा आहे',
    'mr',
    {
      villageHint: 'Kolhapur',
      districtHint: 'Kolhapur',
      userCapital: 100000
    }
  );
  console.log('Village Name:', res.villageName);
  console.log('District:', res.sourceAttribution.tierUsed);
  console.log('Ranked Businesses:', res.rankedBusinesses.map(b => b.business.business));
  console.log('Formatted response snippet (400 chars):', res.formattedTextResponse.substring(0, 400));
}

test();
