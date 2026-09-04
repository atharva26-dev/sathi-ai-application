import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export interface TtsSynthesisResult {
  audioBase64: string;
  mimeType: string;
  language: 'hi' | 'mr' | 'en';
  durationEstimateSeconds: number;
  provider: 'indic_f5_remote' | 'indic_f5_fallback';
}

export interface ITtsProvider {
  synthesizeSpeech(
    text: string,
    language: 'hi' | 'mr' | 'en',
    speakerGender?: 'male' | 'female'
  ): Promise<TtsSynthesisResult>;
}

/**
 * Creates a minimal valid 16kHz 16-bit Mono WAV audio buffer in Base64
 * for testing and offline fallback playback in browsers.
 */
export function generateValidWavBase64(durationSeconds: number = 1.0, frequencyHz: number = 440): string {
  const sampleRate = 16000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // "fmt " chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // "data" chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Fill audio data with a subtle sine wave tone so playback is audible
  const volume = 0.15;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * frequencyHz * t) * volume;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer.toString('base64');
}

/**
 * AI4Bharat IndicF5 TTS Provider
 * IndicF5 is a diffusion and flow-matching text-to-speech architecture trained on IndicVoices / IndicVoices-R.
 * Produces high-fidelity natural Hindi and Marathi speech synthesis.
 */
export class IndicF5TtsProvider implements ITtsProvider {
  private ttsUrl: string;
  private apiKey?: string;

  constructor(ttsUrl?: string, apiKey?: string) {
    this.ttsUrl = ttsUrl || env.AI4BHARAT_TTS_URL;
    this.apiKey = apiKey || env.AI4BHARAT_API_KEY;
  }

  async synthesizeSpeech(
    text: string,
    language: 'hi' | 'mr' | 'en',
    speakerGender: 'male' | 'female' = 'female'
  ): Promise<TtsSynthesisResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      // Aligned with AI4Bharat IndicF5 FastAPI / Dhruva inference request format
      const payload = {
        input: [{ source: text }],
        config: {
          language: { sourceLanguage: language },
          gender: speakerGender,
          samplingRate: 22050,
          audioFormat: 'wav'
        }
      };

      const response = await fetch(this.ttsUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`IndicF5 TTS HTTP error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as any;

      // Extract audioBase64 from either direct or Dhruva response
      const audioBase64 =
        data.audioContent ||
        data.audio?.[0]?.audioContent ||
        data.pipelineResponse?.[0]?.audio?.[0]?.audioContent ||
        '';

      if (!audioBase64) {
        throw new Error('IndicF5 TTS response missing audioContent');
      }

      // Estimate duration based on word count (~150 words per minute)
      const wordCount = text.split(/\s+/).length;
      const durationEstimateSeconds = Math.max(1.5, Math.round((wordCount / 2.5) * 10) / 10);

      return {
        audioBase64,
        mimeType: 'audio/wav',
        language,
        durationEstimateSeconds,
        provider: 'indic_f5_remote'
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

/**
 * Fallback TTS Provider that returns valid synthesized WAV audio
 * when GPU microservice is offline, allowing complete UI testing.
 */
export class FallbackTtsProvider implements ITtsProvider {
  async synthesizeSpeech(
    text: string,
    language: 'hi' | 'mr' | 'en',
    speakerGender: 'male' | 'female' = 'female'
  ): Promise<TtsSynthesisResult> {
    logger.info(`[FallbackTtsProvider] Generating audio synthesis for text="${text.substring(0, 40)}...", language=${language}`);

    const wordCount = text.split(/\s+/).length;
    const durationSeconds = Math.min(5.0, Math.max(1.0, Math.round((wordCount / 3.0) * 10) / 10));

    // Generate valid WAV audio tone
    const audioBase64 = generateValidWavBase64(durationSeconds, language === 'mr' ? 440 : 494);

    return {
      audioBase64,
      mimeType: 'audio/wav',
      language,
      durationEstimateSeconds: durationSeconds,
      provider: 'indic_f5_fallback'
    };
  }
}

export class TtsService {
  private remoteProvider: IndicF5TtsProvider;
  private fallbackProvider: FallbackTtsProvider;

  constructor() {
    this.remoteProvider = new IndicF5TtsProvider();
    this.fallbackProvider = new FallbackTtsProvider();
  }

  async synthesize(
    text: string,
    language: 'hi' | 'mr' | 'en',
    speakerGender: 'male' | 'female' = 'female'
  ): Promise<TtsSynthesisResult> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text is required for TTS synthesis.');
    }

    // If explicit fallback mode configured
    if (env.VOICE_PIPELINE_MODE === 'fallback') {
      return this.fallbackProvider.synthesizeSpeech(text, language, speakerGender);
    }

    try {
      return await this.remoteProvider.synthesizeSpeech(text, language, speakerGender);
    } catch (err: any) {
      logger.warn(
        `[TtsService] IndicF5 remote endpoint unavailable (${err.message}). Gracefully falling back to local audio synthesizer.`
      );
      return this.fallbackProvider.synthesizeSpeech(text, language, speakerGender);
    }
  }
}

export const ttsService = new TtsService();
