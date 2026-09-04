import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { voiceService, VoiceStatusInfo, VoiceChatResult } from '../services/voiceService';
import { LanguageCode } from '../types';

interface VoiceContextType {
  // Speech Recognition (STT - IndicConformer)
  isListening: boolean;
  isProcessingVoice: boolean;
  isVoiceSupported: boolean;
  transcript: string;
  interimTranscript: string;
  voiceError: string | null;
  startListening: (onResult?: (text: string) => void) => void;
  stopListening: () => void;
  clearTranscript: () => void;

  // MediaRecorder + IndicConformer Direct Recording
  recordMicrophoneAudio: (onComplete?: (text: string) => void) => Promise<{ stop: () => Promise<string> }>;

  // Text-To-Speech (IndicF5 TTS Audio Playback)
  speak: (text: string, lang?: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  speakingTextId: string | null;
  setSpeakingTextId: (id: string | null) => void;
  isNativeTtsAvailable: boolean;

  // End-to-End Conversational Pipeline
  executeVoiceChat: (params: {
    village?: string;
    liveAreaContext?: any;
    onResponse?: (result: VoiceChatResult) => void;
  }) => Promise<{ stopAndSend: () => Promise<VoiceChatResult> }>;

  // Model connection status
  voiceStatus: VoiceStatusInfo | null;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, languageDef } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingTextId, setSpeakingTextId] = useState<string | null>(null);
  const [isNativeTtsAvailable, setIsNativeTtsAvailable] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatusInfo | null>(null);

  const recognitionRef = useRef<any>(null);
  const onResultCallbackRef = useRef<((text: string) => void) | null>(null);
  const activeAudioPlaybackStopRef = useRef<(() => void) | null>(null);

  // Poll voice service status on mount
  useEffect(() => {
    voiceService.getStatus().then((status) => {
      if (status) setVoiceStatus(status);
    });
  }, []);

  // Check Web Speech API speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateTtsSupport = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredLocales = languageDef.speechSynthesisLocales || [];
        const found = voices.some((v) =>
          preferredLocales.some(
            (loc) =>
              v.lang.toLowerCase() === loc.toLowerCase() ||
              v.lang.replace('_', '-').toLowerCase() === loc.toLowerCase() ||
              v.lang.startsWith(loc.split('-')[0])
          )
        );
        setIsNativeTtsAvailable(found || voices.length === 0);
      };

      updateTtsSupport();
      window.speechSynthesis.onvoiceschanged = updateTtsSupport;
    }
  }, [languageDef]);

  // Setup Web Speech API fallback for continuous inline mic
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // In browsers without webkitSpeechRecognition, MediaRecorder serves as primary
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = languageDef.speechRecognitionLocale || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalStr += result[0].transcript;
          } else {
            interimStr += result[0].transcript;
          }
        }

        if (finalStr) {
          setTranscript((prev) => (prev ? prev + ' ' + finalStr : finalStr));
          if (onResultCallbackRef.current) {
            onResultCallbackRef.current(finalStr);
          }
        }
        setInterimTranscript(interimStr);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
    }
  }, [languageDef]);

  const startListening = useCallback(
    (onResult?: (text: string) => void) => {
      setVoiceError(null);
      if (onResult) {
        onResultCallbackRef.current = onResult;
      }
      setTranscript('');
      setInterimTranscript('');

      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = languageDef.speechRecognitionLocale || 'en-IN';
          recognitionRef.current.start();
        } catch (err) {
          console.warn('Recognition start caught:', err);
        }
      } else {
        setIsListening(true);
      }
    },
    [languageDef]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Recognition stop caught:', err);
      }
    }
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setVoiceError(null);
  }, []);

  /**
   * Record microphone audio using MediaRecorder and transcribe using IndicConformer ASR
   */
  const recordMicrophoneAudio = useCallback(
    async (onComplete?: (text: string) => void) => {
      setVoiceError(null);
      setIsListening(true);
      setTranscript('');

      try {
        const recordingSession = await voiceService.startRecording();

        return {
          stop: async () => {
            setIsListening(false);
            setIsProcessingVoice(true);

            try {
              const { audioBase64, mimeType } = await recordingSession.stop();
              const result = await voiceService.transcribeAudio(audioBase64, language, mimeType);

              setTranscript(result.transcript);
              if (onComplete) {
                onComplete(result.transcript);
              }
              setIsProcessingVoice(false);
              return result.transcript;
            } catch (err: any) {
              setIsProcessingVoice(false);
              setVoiceError(err.message || 'Speech recognition failed.');
              throw err;
            }
          }
        };
      } catch (err: any) {
        setIsListening(false);
        setVoiceError(err.message || 'Microphone recording could not be started.');
        throw err;
      }
    },
    [language]
  );

  /**
   * Text-To-Speech Synthesis:
   * Prioritizes AI4Bharat IndicF5 natural audio playback.
   * Gracefully falls back to browser SpeechSynthesis if network or audio decoding is hindered.
   */
  const speak = useCallback(
    async (text: string, overrideLang?: string) => {
      stopSpeaking();

      const activeLang = (overrideLang || language) as LanguageCode;

      try {
        setIsSpeaking(true);

        // Attempt server-side IndicF5 synthesis
        const ttsRes = await voiceService.synthesizeSpeech(text, activeLang);

        if (ttsRes && ttsRes.audioBase64) {
          const controller = voiceService.playAudioBase64(
            ttsRes.audioBase64,
            ttsRes.mimeType || 'audio/wav',
            () => {
              setIsSpeaking(false);
              setSpeakingTextId(null);
            },
            () => {
              // Fallback to browser TTS if audio playback fails
              fallbackBrowserTts(text, activeLang);
            }
          );
          activeAudioPlaybackStopRef.current = controller.stop;
          return;
        }

        fallbackBrowserTts(text, activeLang);
      } catch (err) {
        console.warn('[VoiceContext] IndicF5 synthesis failed, falling back to browser speech:', err);
        fallbackBrowserTts(text, activeLang);
      }
    },
    [language, languageDef]
  );

  const fallbackBrowserTts = (text: string, targetLang: LanguageCode) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setSpeakingTextId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const locale =
        targetLang === 'mr' ? 'mr-IN' : targetLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.lang = locale;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find(
        (v) => v.lang.toLowerCase().startsWith(targetLang) || v.lang.includes('IN')
      );
      if (matched) utterance.voice = matched;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingTextId(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingTextId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
      setSpeakingTextId(null);
    }
  };

  const stopSpeaking = useCallback(() => {
    if (activeAudioPlaybackStopRef.current) {
      activeAudioPlaybackStopRef.current();
      activeAudioPlaybackStopRef.current = null;
    }
    voiceService.stopPlayback();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setSpeakingTextId(null);
  }, []);

  /**
   * End-to-End Voice Chat Interaction (Audio In -> IndicConformer -> AI -> IndicF5 -> Audio Out)
   */
  const executeVoiceChat = useCallback(
    async (params: {
      village?: string;
      liveAreaContext?: any;
      onResponse?: (result: VoiceChatResult) => void;
    }) => {
      setVoiceError(null);
      setIsListening(true);
      setTranscript('');

      const recordingSession = await voiceService.startRecording();

      return {
        stopAndSend: async (): Promise<VoiceChatResult> => {
          setIsListening(false);
          setIsProcessingVoice(true);

          try {
            const { audioBase64, mimeType } = await recordingSession.stop();

            const result = await voiceService.sendVoiceChat({
              audioBase64,
              audioFormat: mimeType,
              language,
              village: params.village,
              liveAreaContext: params.liveAreaContext
            });

            setTranscript(result.userTranscript);
            setIsProcessingVoice(false);

            if (params.onResponse) {
              params.onResponse(result);
            }

            // Automatically play back the returned IndicF5 synthesized response audio
            if (result.audioBase64) {
              setIsSpeaking(true);
              const controller = voiceService.playAudioBase64(
                result.audioBase64,
                result.audioMimeType || 'audio/wav',
                () => setIsSpeaking(false),
                () => setIsSpeaking(false)
              );
              activeAudioPlaybackStopRef.current = controller.stop;
            }

            return result;
          } catch (err: any) {
            setIsProcessingVoice(false);
            setVoiceError(err.message || 'Voice interaction failed.');
            throw err;
          }
        }
      };
    },
    [language]
  );

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isProcessingVoice,
        isVoiceSupported,
        transcript,
        interimTranscript,
        voiceError,
        startListening,
        stopListening,
        clearTranscript,
        recordMicrophoneAudio,
        speak,
        stopSpeaking,
        isSpeaking,
        speakingTextId,
        setSpeakingTextId,
        isNativeTtsAvailable,
        executeVoiceChat,
        voiceStatus
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
