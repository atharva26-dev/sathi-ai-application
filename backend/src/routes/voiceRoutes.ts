import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { asrService } from '../services/voice/asrService.js';
import { ttsService } from '../services/voice/ttsService.js';
import { voicePipelineService } from '../services/voice/voicePipelineService.js';
import { env } from '../config/env.js';

export const voiceRoutes = Router();

const asrSchema = z.object({
  audioBase64: z.string().min(1, 'Audio data is required as base64 string'),
  audioFormat: z.string().default('audio/webm'),
  language: z.enum(['hi', 'mr', 'en']).default('mr')
});

const ttsSchema = z.object({
  text: z.string().min(1, 'Text to synthesize is required'),
  language: z.enum(['hi', 'mr', 'en']).default('mr'),
  gender: z.enum(['female', 'male']).default('female')
});

const voiceChatSchema = z.object({
  audioBase64: z.string().min(1, 'Audio data is required as base64 string'),
  audioFormat: z.string().default('audio/webm'),
  language: z.enum(['hi', 'mr', 'en']).default('mr'),
  village: z.string().optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  liveAreaContext: z
    .object({
      competitorCount: z.number().optional(),
      localObstacles: z.string().optional(),
      dynamicQuestionsAnswers: z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .optional()
    })
    .optional()
});

/**
 * POST /voice/asr
 * Speech-to-Text using AI4Bharat IndicConformerASR
 */
voiceRoutes.post(
  '/voice/asr',
  validate({ body: asrSchema }),
  async (req: Request, res: Response) => {
    try {
      const { audioBase64, language, audioFormat } = req.body;
      const result = await asrService.transcribe(audioBase64, language, audioFormat);
      sendSuccess(res, result, 200, req.id);
    } catch (err: any) {
      sendError(res, 'ASR_PROCESSING_FAILED', err.message, 500, {}, req.id);
    }
  }
);

// Backward compatibility alias for legacy transcribe route
voiceRoutes.post(
  '/voice/transcribe',
  validate({
    body: z.object({
      audioBase64: z.string().optional().default(''),
      audioFormat: z.string().default('audio/webm'),
      language: z.string().default('mr')
    })
  }),
  async (req: Request, res: Response) => {
    try {
      const audioBase64 = req.body.audioBase64 || 'mock-sample';
      const lang = (['hi', 'mr', 'en'].includes(req.body.language) ? req.body.language : 'mr') as 'hi' | 'mr' | 'en';
      const result = await asrService.transcribe(audioBase64, lang, req.body.audioFormat);
      sendSuccess(
        res,
        {
          transcription: result.transcript,
          confidence: result.confidence,
          detectedLanguage: result.language,
          provider: result.provider
        },
        200,
        req.id
      );
    } catch (err: any) {
      sendError(res, 'TRANSCRIBE_FAILED', err.message, 500, {}, req.id);
    }
  }
);

/**
 * POST /voice/tts
 * Text-to-Speech using AI4Bharat IndicF5 TTS
 */
voiceRoutes.post(
  '/voice/tts',
  validate({ body: ttsSchema }),
  async (req: Request, res: Response) => {
    try {
      const { text, language, gender } = req.body;
      const result = await ttsService.synthesize(text, language, gender);
      sendSuccess(res, result, 200, req.id);
    } catch (err: any) {
      sendError(res, 'TTS_SYNTHESIS_FAILED', err.message, 500, {}, req.id);
    }
  }
);

/**
 * POST /voice/chat
 * End-to-End Voice Interaction:
 * Audio -> IndicConformer ASR -> SAATHI AI Orchestrator -> IndicF5 TTS -> Audio
 */
voiceRoutes.post(
  '/voice/chat',
  validate({ body: voiceChatSchema }),
  async (req: Request, res: Response) => {
    try {
      const { audioBase64, audioFormat, language, village, userId, sessionId, liveAreaContext } = req.body;
      const result = await voicePipelineService.processVoiceInteraction({
        audioBase64,
        mimeType: audioFormat,
        language,
        village,
        userId,
        sessionId,
        liveAreaContext
      });

      sendSuccess(res, result, 200, req.id);
    } catch (err: any) {
      sendError(res, 'VOICE_PIPELINE_ERROR', err.message, 500, {}, req.id);
    }
  }
);

/**
 * GET /voice/status
 * Reports connection state and configuration of AI4Bharat models
 */
voiceRoutes.get('/voice/status', (_req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      provider: 'ai4bharat',
      mode: env.VOICE_PIPELINE_MODE,
      supportedLanguages: ['hi', 'mr', 'en'],
      models: {
        asr: {
          name: 'IndicConformerASR',
          endpoint: env.AI4BHARAT_ASR_URL,
          repository: 'https://github.com/AI4Bharat/IndicConformerASR',
          trainingDataset: 'IndicVoices / IndicVoices-R'
        },
        tts: {
          name: 'IndicF5',
          endpoint: env.AI4BHARAT_TTS_URL,
          repository: 'https://github.com/AI4Bharat/IndicF5',
          architecture: 'Flow-Matching Diffusion Mel-Spectrogram'
        }
      },
      ready: true
    },
    200
  );
});
