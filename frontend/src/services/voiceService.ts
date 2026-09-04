import { LanguageCode } from '../types';

export interface VoiceStatusInfo {
  provider: string;
  mode: string;
  supportedLanguages: string[];
  models: {
    asr: {
      name: string;
      endpoint: string;
      repository: string;
    };
    tts: {
      name: string;
      endpoint: string;
      repository: string;
    };
  };
  ready: boolean;
}

export interface VoiceAsrResult {
  transcript: string;
  language: LanguageCode;
  confidence: number;
  durationSeconds?: number;
  provider: string;
}

export interface VoiceTtsResult {
  audioBase64: string;
  mimeType: string;
  language: LanguageCode;
  durationEstimateSeconds: number;
  provider: string;
}

export interface VoiceChatResult {
  userTranscript: string;
  asrConfidence: number;
  asrProvider: string;
  assistantText: string;
  audioBase64: string;
  audioMimeType: string;
  ttsProvider: string;
  language: LanguageCode;
  cards?: any[];
  followUpQuestion?: string;
  actionOptions?: string[];
}

class VoiceService {
  private baseUrl: string = '/api/v1';
  private currentAudioElement: HTMLAudioElement | null = null;
  private activeMediaRecorder: MediaRecorder | null = null;
  private activeMediaStream: MediaStream | null = null;

  /**
   * Check status and health of backend AI4Bharat models
   */
  async getStatus(): Promise<VoiceStatusInfo | null> {
    try {
      const res = await fetch(`${this.baseUrl}/voice/status`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  }

  /**
   * Start microphone recording in browser using MediaRecorder
   */
  async startRecording(): Promise<{
    stop: () => Promise<{ audioBlob: Blob; audioBase64: string; mimeType: string }>;
  }> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone access is not supported in this browser.');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      this.activeMediaStream = stream;

      // Select supported audio mimeType
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4', 'audio/wav'];
      const chosenMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || '';

      const recorder = new MediaRecorder(stream, chosenMime ? { mimeType: chosenMime } : undefined);
      this.activeMediaRecorder = recorder;

      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.start(100); // 100ms slices

      return {
        stop: () => {
          return new Promise<{ audioBlob: Blob; audioBase64: string; mimeType: string }>((resolve, reject) => {
            recorder.onstop = async () => {
              try {
                // Stop all mic tracks
                stream.getTracks().forEach((track) => track.stop());
                this.activeMediaStream = null;
                this.activeMediaRecorder = null;

                const actualMime = recorder.mimeType || chosenMime || 'audio/webm';
                const audioBlob = new Blob(audioChunks, { type: actualMime });

                // Convert blob to base64
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64Url = reader.result as string;
                  const base64Data = base64Url.split(',')[1] || '';
                  resolve({
                    audioBlob,
                    audioBase64: base64Data,
                    mimeType: actualMime
                  });
                };
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(audioBlob);
              } catch (err) {
                reject(err);
              }
            };

            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
          });
        }
      };
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Microphone permission was denied. Please allow microphone access to talk to SAATHI.');
      }
      throw err;
    }
  }

  /**
   * Transcribe recorded audio with AI4Bharat IndicConformer ASR
   */
  async transcribeAudio(
    audioBase64: string,
    language: LanguageCode,
    audioFormat: string = 'audio/webm'
  ): Promise<VoiceAsrResult> {
    const res = await fetch(`${this.baseUrl}/voice/asr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64,
        audioFormat,
        language
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Speech recognition failed: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
  }

  /**
   * Synthesize natural Hindi / Marathi speech with AI4Bharat IndicF5 TTS
   */
  async synthesizeSpeech(
    text: string,
    language: LanguageCode,
    gender: 'female' | 'male' = 'female'
  ): Promise<VoiceTtsResult> {
    const res = await fetch(`${this.baseUrl}/voice/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language,
        gender
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Speech synthesis failed: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
  }

  /**
   * Complete end-to-end voice conversation with SAATHI AI
   */
  async sendVoiceChat(params: {
    audioBase64: string;
    language: LanguageCode;
    audioFormat?: string;
    village?: string;
    userId?: string;
    liveAreaContext?: {
      competitorCount?: number;
      localObstacles?: string;
      dynamicQuestionsAnswers?: Array<{ question: string; answer: string }>;
    };
  }): Promise<VoiceChatResult> {
    const res = await fetch(`${this.baseUrl}/voice/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64: params.audioBase64,
        audioFormat: params.audioFormat || 'audio/webm',
        language: params.language,
        village: params.village,
        userId: params.userId,
        liveAreaContext: params.liveAreaContext
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Voice pipeline error: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
  }

  /**
   * Play base64 audio in browser with clear callbacks
   */
  playAudioBase64(
    audioBase64: string,
    mimeType: string = 'audio/wav',
    onEnd?: () => void,
    onError?: (err: any) => void
  ): { stop: () => void } {
    this.stopPlayback();

    const audioUrl = `data:${mimeType};base64,${audioBase64}`;
    const audio = new Audio(audioUrl);
    this.currentAudioElement = audio;

    audio.onended = () => {
      this.currentAudioElement = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      this.currentAudioElement = null;
      console.warn('Audio playback error:', e);
      if (onError) onError(e);
    };

    audio.play().catch((err) => {
      console.warn('Audio play() failed:', err);
      if (onError) onError(err);
    });

    return {
      stop: () => {
        if (this.currentAudioElement === audio) {
          audio.pause();
          audio.currentTime = 0;
          this.currentAudioElement = null;
          if (onEnd) onEnd();
        }
      }
    };
  }

  /**
   * Stop active audio playback
   */
  stopPlayback() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
  }

  /**
   * Cancel ongoing recording
   */
  cancelRecording() {
    if (this.activeMediaRecorder && this.activeMediaRecorder.state !== 'inactive') {
      this.activeMediaRecorder.stop();
    }
    if (this.activeMediaStream) {
      this.activeMediaStream.getTracks().forEach((track) => track.stop());
      this.activeMediaStream = null;
    }
    this.activeMediaRecorder = null;
  }
}

export const voiceService = new VoiceService();
