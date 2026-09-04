import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Send, Volume2, RotateCcw, Edit3, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string, isVoice: boolean) => void;
  initialPrompt?: string;
  quickOptions?: string[];
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  initialPrompt,
  quickOptions = []
}) => {
  const {
    isListening,
    isProcessingVoice,
    startListening,
    stopListening,
    recordMicrophoneAudio,
    transcript,
    clearTranscript,
    isVoiceSupported,
    voiceError
  } = useVoice();
  const { t, language } = useLanguage();
  const [manualText, setManualText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeRecordingStop, setActiveRecordingStop] = useState<(() => Promise<string>) | null>(null);

  useEffect(() => {
    if (isOpen) {
      clearTranscript();
      setManualText('');
      setIsEditing(false);

      // Start recording with MediaRecorder + IndicConformer
      recordMicrophoneAudio((result) => {
        setManualText(result);
      })
        .then((session) => {
          setActiveRecordingStop(() => session.stop);
        })
        .catch(() => {
          // Fallback to Web Speech API
          startListening((result) => {
            setManualText(result);
          });
        });
    } else {
      if (activeRecordingStop) {
        activeRecordingStop().catch(() => {});
        setActiveRecordingStop(null);
      }
      stopListening();
    }
  }, [isOpen]);

  useEffect(() => {
    if (transcript) {
      setManualText(transcript);
    }
  }, [transcript]);

  if (!isOpen) return null;

  const handleToggleListen = async () => {
    if (isListening) {
      if (activeRecordingStop) {
        try {
          const res = await activeRecordingStop();
          setManualText(res);
        } catch {}
        setActiveRecordingStop(null);
      } else {
        stopListening();
      }
    } else {
      clearTranscript();
      try {
        const session = await recordMicrophoneAudio((res) => {
          setManualText(res);
        });
        setActiveRecordingStop(() => session.stop);
      } catch {
        startListening((result) => {
          setManualText(result);
        });
      }
    }
  };

  const handleSend = () => {
    const textToSend = manualText.trim() || transcript.trim();
    if (textToSend) {
      onSendMessage(textToSend, isListening || !isEditing);
      if (activeRecordingStop) {
        activeRecordingStop().catch(() => {});
        setActiveRecordingStop(null);
      }
      stopListening();
      onClose();
    }
  };

  const handleQuickOptionClick = (opt: string) => {
    setManualText(opt);
    onSendMessage(opt, false);
    stopListening();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          width: '100%',
          maxWidth: '540px',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '24px',
          boxShadow: 'var(--shadow-floating)',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🎙️</span>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
              {language === 'mr' ? 'SAATHI शी बोला' : language === 'hi' ? 'SAATHI से बोलें' : 'Talk to SAATHI'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t.common.close}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Prompt guidance */}
        <p style={{ textAlign: 'center', fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          {initialPrompt ||
            (language === 'mr'
              ? 'व्यवसाय, नफा, कर्ज किंवा ग्राहकांबद्दल तुमचा प्रश्न मोकळेपणाने विचारा.'
              : language === 'hi'
              ? 'व्यवसाय, लाभ, ऋण या ग्राहकों के बारे में अपना प्रश्न पूछें।'
              : 'Ask anything about your business, profits, loans, or customers.')}
        </p>

        {/* Big Interactive Microphone Pulse */}
        <div style={{ position: 'relative', margin: '16px 0 24px' }}>
          {isListening && (
            <div
              className="voice-pulse-ring"
              style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                right: '-15px',
                bottom: '-15px',
                borderRadius: '50%',
                backgroundColor: 'rgba(234, 88, 12, 0.25)',
                zIndex: 1
              }}
            />
          )}

          <button
            onClick={handleToggleListen}
            disabled={isProcessingVoice}
            aria-label={isListening ? 'माइक थांबवा' : 'माइक सुरू करा'}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: isProcessingVoice ? '#9CA3AF' : isListening ? '#DC2626' : 'var(--primary)',
              color: '#FFFFFF',
              boxShadow: isListening ? '0 0 25px rgba(220, 38, 38, 0.5)' : 'var(--shadow-primary)',
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isProcessingVoice ? 'wait' : 'pointer'
            }}
          >
            {isProcessingVoice ? <Loader2 size={38} className="animate-spin" /> : isListening ? <MicOff size={38} /> : <Mic size={38} />}
          </button>
        </div>

        {/* Live Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          {isProcessingVoice ? (
            <span style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
              {language === 'mr' ? 'AI4Bharat आवाज तपासत आहे...' : language === 'hi' ? 'AI4Bharat आवाज पहचान रहा है...' : 'Processing with IndicConformer...'}
            </span>
          ) : isListening ? (
            <>
              <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                <span className="wave-bar" style={{ height: '14px', width: '3px', backgroundColor: 'var(--primary)' }}></span>
                <span className="wave-bar" style={{ height: '24px', width: '3px', backgroundColor: 'var(--primary)' }}></span>
                <span className="wave-bar" style={{ height: '18px', width: '3px', backgroundColor: 'var(--primary)' }}></span>
                <span className="wave-bar" style={{ height: '28px', width: '3px', backgroundColor: 'var(--primary)' }}></span>
                <span className="wave-bar" style={{ height: '12px', width: '3px', backgroundColor: 'var(--primary)' }}></span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
                {t.common.listening}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {language === 'mr' ? 'माइक सुरू करण्यासाठी वरील बटण दाबा' : language === 'hi' ? 'माइक शुरू करने के लिए बटन दबाएं' : 'Tap microphone button to speak'}
            </span>
          )}
        </div>

        {/* Error state display if mic fails */}
        {voiceError && (
          <div
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#991B1B',
              fontSize: '0.82rem',
              marginBottom: '12px'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{voiceError}</span>
          </div>
        )}

        {/* Transcript Box with Edit capability */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-app)',
            borderRadius: '16px',
            border: '1.5px solid var(--border-medium)',
            padding: '14px',
            marginBottom: '16px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {language === 'mr' ? 'तुमचा आवाज / प्रश्न:' : language === 'hi' ? 'आपकी आवाज / प्रश्न:' : 'Your Voice / Query:'}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {manualText && (
                <button
                  onClick={() => {
                    setManualText('');
                    clearTranscript();
                  }}
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minHeight: 'auto', padding: '2px 6px' }}
                >
                  <RotateCcw size={12} /> {language === 'mr' ? 'साफ करा' : language === 'hi' ? 'हटाएं' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          <textarea
            value={manualText}
            onChange={(e) => {
              setManualText(e.target.value);
              setIsEditing(true);
            }}
            placeholder={
              language === 'mr'
                ? 'बोला किंवा येथे थेट टाइप करा...'
                : language === 'hi'
                ? 'बोलें या सीधे यहां टाइप करें...'
                : 'Speak or type here directly...'
            }
            rows={3}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              lineHeight: 1.45,
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Quick Suggestion Chips */}
        {quickOptions.length > 0 && (
          <div style={{ width: '100%', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {language === 'mr' ? 'वारंवार विचारले जाणारे प्रश्न:' : language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न:' : 'Common Quick Queries:'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {quickOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickOptionClick(opt)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    minHeight: 'auto'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSend}
          disabled={!manualText.trim() || isProcessingVoice}
          className="btn-primary"
          style={{
            width: '100%',
            minHeight: '52px',
            fontSize: '1.05rem',
            opacity: manualText.trim() && !isProcessingVoice ? 1 : 0.5,
            cursor: manualText.trim() && !isProcessingVoice ? 'pointer' : 'not-allowed'
          }}
        >
          <Send size={18} />
          <span>{language === 'mr' ? 'साथीला विचारा' : language === 'hi' ? 'साथी से पूछें' : 'Ask Saathi'}</span>
        </button>
      </div>
    </div>
  );
};
