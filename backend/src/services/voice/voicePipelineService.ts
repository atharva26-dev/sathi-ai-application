import { asrService, AsrRecognitionResult } from './asrService.js';
import { ttsService, TtsSynthesisResult } from './ttsService.js';
import { aiOrchestrator, OrchestratorResponse } from '../../ai/orchestrator.js';
import { SupportedLanguage } from '../../config/constants.js';
import { logger } from '../../utils/logger.js';

export interface VoiceChatRequest {
  audioBase64: string;
  mimeType?: string;
  language: 'hi' | 'mr' | 'en';
  userId?: string;
  sessionId?: string;
  village?: string;
  capital?: number;
  liveAreaContext?: {
    competitorCount?: number;
    localObstacles?: string;
    dynamicQuestionsAnswers?: Array<{ question: string; answer: string }>;
  };
}

export interface VoiceChatResponse {
  userTranscript: string;
  asrConfidence: number;
  asrProvider: string;
  assistantText: string;
  audioBase64: string;
  audioMimeType: string;
  ttsProvider: string;
  language: 'hi' | 'mr' | 'en';
  cards?: any[];
  suggestedNextQuestions?: string[];
  recommendations?: string[];
}

export class VoicePipelineService {
  /**
   * Complete End-to-End Voice Interaction:
   * Audio Recording -> IndicConformer ASR -> Recognized Text -> SAATHI AI Orchestrator -> Text Response -> IndicF5 TTS -> Synthesized Audio
   */
  async processVoiceInteraction(request: VoiceChatRequest): Promise<VoiceChatResponse> {
    const startTime = Date.now();
    const {
      audioBase64,
      mimeType = 'audio/webm',
      language = 'mr',
      village,
      capital,
      userId = '00000000-0000-0000-0000-000000000001',
      liveAreaContext
    } = request;

    logger.info(
      `[VoicePipeline] Processing voice interaction: language=${language}, village=${village || 'unspecified'}, audioSize=${audioBase64.length}`
    );

    // Step 1: Automatic Speech Recognition using IndicConformer
    const asrResult: AsrRecognitionResult = await asrService.transcribe(audioBase64, language, mimeType);
    logger.info(
      `[VoicePipeline] Recognized transcript: "${asrResult.transcript}" (confidence=${asrResult.confidence}, provider=${asrResult.provider})`
    );

    // Step 2: SAATHI AI Assistant Reasoning with Village & Live Area Context
    const aiResult: OrchestratorResponse = await aiOrchestrator.handleUserMessage(
      asrResult.transcript,
      language as SupportedLanguage,
      {
        location: village,
        capital,
        liveAreaContext: liveAreaContext
          ? {
              competitorCount: liveAreaContext.competitorCount,
              localObstacles: liveAreaContext.localObstacles,
              dynamicAnswers: liveAreaContext.dynamicQuestionsAnswers
            }
          : undefined
      },
      userId
    );

    // Prefer concise, natural voiceSpokenText for IndicF5 synthesis
    const textToSynthesize = aiResult.voiceSpokenText || aiResult.summary || aiResult.answer;
    logger.info(`[VoicePipeline] AI response generated (${textToSynthesize.length} chars to synthesize)`);

    // Step 3: Text-to-Speech Synthesis using IndicF5
    const ttsResult: TtsSynthesisResult = await ttsService.synthesize(textToSynthesize, language);
    logger.info(
      `[VoicePipeline] IndicF5 synthesized audio ready (${ttsResult.audioBase64.length} chars, provider=${ttsResult.provider})`
    );

    const totalElapsedMs = Date.now() - startTime;
    logger.info(`[VoicePipeline] End-to-end voice pipeline completed in ${totalElapsedMs}ms`);

    return {
      userTranscript: asrResult.transcript,
      asrConfidence: asrResult.confidence,
      asrProvider: asrResult.provider,
      assistantText: aiResult.answer,
      audioBase64: ttsResult.audioBase64,
      audioMimeType: ttsResult.mimeType,
      ttsProvider: ttsResult.provider,
      language,
      cards: aiResult.cards,
      suggestedNextQuestions: aiResult.suggestedNextQuestions,
      recommendations: aiResult.recommendations
    };
  }
}

export const voicePipelineService = new VoicePipelineService();
