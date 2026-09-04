import { asrService } from '../services/voice/asrService.js';
import { ttsService } from '../services/voice/ttsService.js';
import { voicePipelineService } from '../services/voice/voicePipelineService.js';
import { createApp } from '../app.js';
import request from 'supertest';

async function runVoiceTests() {
  console.log('--- STARTING AI4BHARAT VOICE PIPELINE VALIDATION ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${msg}`);
      failed++;
    }
  }

  try {
    // 1. Test ASR Service (Hindi & Marathi)
    console.log('\n--- 1. Testing IndicConformer ASR Service ---');
    const dummyAudio = Buffer.from('RIFF....WAVEfmt ....data....').toString('base64');

    const asrHi = await asrService.transcribe(dummyAudio, 'hi');
    assert(asrHi.language === 'hi', 'Hindi ASR returns language=hi');
    assert(asrHi.transcript.length > 0, `Hindi ASR produced transcript: "${asrHi.transcript}"`);

    const asrMr = await asrService.transcribe(dummyAudio, 'mr');
    assert(asrMr.language === 'mr', 'Marathi ASR returns language=mr');
    assert(asrMr.transcript.length > 0, `Marathi ASR produced transcript: "${asrMr.transcript}"`);

    // 2. Test TTS Service (IndicF5 - Hindi & Marathi)
    console.log('\n--- 2. Testing IndicF5 TTS Service ---');
    const ttsHi = await ttsService.synthesize('नमस्ते! आपके गांव में डेयरी व्यवसाय बहुत अच्छा रहेगा।', 'hi');
    assert(ttsHi.language === 'hi', 'Hindi TTS returns language=hi');
    assert(ttsHi.mimeType === 'audio/wav', 'Hindi TTS returns audio/wav mimeType');
    assert(ttsHi.audioBase64.length > 100, `Hindi TTS generated audio (${ttsHi.audioBase64.length} chars)`);

    // Validate WAV RIFF header in generated audio
    const wavBytes = Buffer.from(ttsHi.audioBase64, 'base64');
    const riffHeader = wavBytes.subarray(0, 4).toString('ascii');
    const waveHeader = wavBytes.subarray(8, 12).toString('ascii');
    assert(riffHeader === 'RIFF' && waveHeader === 'WAVE', 'Generated TTS audio contains valid RIFF/WAVE header');

    const ttsMr = await ttsService.synthesize('नमस्कार! तुमच्या गावामध्ये दूध डेअरी प्रकल्प फायदेशीर ठरेल.', 'mr');
    assert(ttsMr.language === 'mr', 'Marathi TTS returns language=mr');
    assert(ttsMr.audioBase64.length > 100, `Marathi TTS generated audio (${ttsMr.audioBase64.length} chars)`);

    // 3. Test End-to-End Voice Pipeline
    console.log('\n--- 3. Testing Complete Voice Pipeline (Audio -> IndicConformer -> AI -> IndicF5 -> Audio) ---');
    const pipelineResult = await voicePipelineService.processVoiceInteraction({
      audioBase64: dummyAudio,
      mimeType: 'audio/webm',
      language: 'mr',
      village: 'सुपे',
      liveAreaContext: {
        competitorCount: 2,
        localObstacles: 'दूध संकलन व शीतकरण केंद्राची कमतरता'
      }
    });

    assert(pipelineResult.userTranscript.length > 0, `Pipeline transcript: "${pipelineResult.userTranscript}"`);
    assert(pipelineResult.assistantText.length > 0, `Pipeline AI response length: ${pipelineResult.assistantText.length}`);
    assert(pipelineResult.audioBase64.length > 100, `Pipeline synthesized IndicF5 audio present (${pipelineResult.audioBase64.length} chars)`);
    assert(pipelineResult.language === 'mr', 'Pipeline preserved user language (mr)');

    // 4. Test Express API Endpoints
    console.log('\n--- 4. Testing Express Voice Routes ---');
    const app = createApp();

    const statusRes = await request(app).get('/api/v1/voice/status');
    assert(statusRes.status === 200, 'GET /api/v1/voice/status returns 200');
    assert(statusRes.body.data.models.asr.name === 'IndicConformerASR', 'Status reports IndicConformerASR');
    assert(statusRes.body.data.models.tts.name === 'IndicF5', 'Status reports IndicF5');

    const asrRes = await request(app)
      .post('/api/v1/voice/asr')
      .send({ audioBase64: dummyAudio, language: 'hi', audioFormat: 'audio/webm' });
    assert(asrRes.status === 200, 'POST /api/v1/voice/asr returns 200');
    assert(asrRes.body.data.language === 'hi', 'ASR route returns language=hi');

    const ttsRes = await request(app)
      .post('/api/v1/voice/tts')
      .send({ text: 'दूध उत्पादन प्रकल्प सुरू करण्यासाठी आवश्यक भांडवल', language: 'mr' });
    assert(ttsRes.status === 200, 'POST /api/v1/voice/tts returns 200');
    assert(ttsRes.body.data.audioBase64.length > 100, 'TTS route returns audioBase64');

    const chatRes = await request(app)
      .post('/api/v1/voice/chat')
      .send({
        audioBase64: dummyAudio,
        language: 'mr',
        village: 'सुपे'
      });
    assert(chatRes.status === 200, 'POST /api/v1/voice/chat returns 200');
    assert(chatRes.body.data.audioBase64.length > 100, 'Voice chat route returns synthesized audioBase64');
    assert(chatRes.body.data.assistantText.length > 0, 'Voice chat route returns assistantText');

    console.log(`\n🎉 VOICE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error('Fatal error in voice tests:', error);
    process.exit(1);
  }
}

runVoiceTests();
