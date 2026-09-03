import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from './LanguageContext';

interface VoiceContextType {
  isListening: boolean;
  isVoiceSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: (onResult?: (text: string) => void) => void;
  stopListening: () => void;
  clearTranscript: () => void;
  
  // Text-To-Speech (Audio playback)
  speak: (text: string, lang?: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  speakingTextId: string | null;
  setSpeakingTextId: (id: string | null) => void;
  isNativeTtsAvailable: boolean;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, languageDef } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingTextId, setSpeakingTextId] = useState<string | null>(null);
  const [isNativeTtsAvailable, setIsNativeTtsAvailable] = useState(true);

  const recognitionRef = useRef<any>(null);
  const onResultCallbackRef = useRef<((text: string) => void) | null>(null);

  // Check and update TTS availability for current language
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

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsVoiceSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = languageDef.speechRecognitionLocale || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
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
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Failed to initialize SpeechRecognition:', e);
      setIsVoiceSupported(false);
    }
  }, [languageDef]);

  const startListening = useCallback((onResult?: (text: string) => void) => {
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
        console.warn('Recognition start failed:', err);
      }
    } else {
      // Fallback simulation mode in environments without Web Speech API
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  }, [languageDef]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Recognition stop failed:', err);
      }
    }
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Text-To-Speech
  const speak = useCallback(
    (text: string, overrideLang?: string) => {
      if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported on this device');
        return;
      }

      try {
        window.speechSynthesis.cancel(); // Cancel any existing speech

        const utterance = new SpeechSynthesisUtterance(text);
        const targetLang = overrideLang || languageDef.speechRecognitionLocale || 'en-IN';
        utterance.lang = targetLang;
        utterance.rate = 0.92; // slightly slower, clear paced cadence for rural clarity
        utterance.pitch = 1.0;

        // Find best matching voice for target language
        const voices = window.speechSynthesis.getVoices();
        const preferredLocales = languageDef.speechSynthesisLocales || [targetLang];

        let matchedVoice = voices.find((v) =>
          preferredLocales.some(
            (loc) =>
              v.lang.toLowerCase() === loc.toLowerCase() ||
              v.lang.replace('_', '-').toLowerCase() === loc.toLowerCase()
          )
        );

        if (!matchedVoice) {
          matchedVoice = voices.find(
            (v) =>
              v.lang.startsWith(targetLang.split('-')[0]) ||
              v.lang.includes('IN')
          );
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setSpeakingTextId(null);
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          setIsSpeaking(false);
          setSpeakingTextId(null);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis execution failed:', err);
        setIsSpeaking(false);
        setSpeakingTextId(null);
      }
    },
    [languageDef]
  );

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingTextId(null);
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isVoiceSupported,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        clearTranscript,
        speak,
        stopSpeaking,
        isSpeaking,
        speakingTextId,
        setSpeakingTextId,
        isNativeTtsAvailable
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
