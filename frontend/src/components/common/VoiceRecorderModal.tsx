import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Send, Volume2, RotateCcw, Edit3, Sparkles } from 'lucide-react';
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
  const { isListening, startListening, stopListening, transcript, clearTranscript, isVoiceSupported } = useVoice();
  const { t } = useLanguage();
  const [manualText, setManualText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      clearTranscript();
      setManualText('');
      setIsEditing(false);
      // Automatically begin listening when opened
      startListening((result) => {
        setManualText(result);
      });
    } else {
      stopListening();
    }
  }, [isOpen]);

  useEffect(() => {
    if (transcript) {
      setManualText(transcript);
    }
  }, [transcript]);

  if (!isOpen) return null;

  const handleToggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      startListening((result) => {
        setManualText(result);
      });
    }
  };

  const handleSend = () => {
    const textToSend = manualText.trim() || transcript.trim();
    if (textToSend) {
      onSendMessage(textToSend, isListening || !isEditing);
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
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>SAATHI शी बोला</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="बंद करा"
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
          {initialPrompt || 'व्यवसाय, नफा, कर्ज किंवा ग्राहकांबद्दल तुमचा प्रश्न मोकळेपणाने विचारा.'}
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
            aria-label={isListening ? 'माइक थांबवा' : 'माइक सुरू करा'}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: isListening ? '#DC2626' : 'var(--primary)',
              color: '#FFFFFF',
              boxShadow: isListening ? '0 0 25px rgba(220, 38, 38, 0.5)' : 'var(--shadow-primary)',
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isListening ? <MicOff size={38} /> : <Mic size={38} />}
          </button>
        </div>

        {/* Live Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          {isListening ? (
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
              माइक सुरू करण्यासाठी वरील बटण दाबा
            </span>
          )}
        </div>

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
              तुमचा आवाज / प्रश्न:
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
                  <RotateCcw size={12} /> साफ करा
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
              isVoiceSupported
                ? 'बोला किंवा येथे थेट टाइप करा...'
                : 'या फोनवर माइक उपलब्ध नाही. कृपया येथे टाइप करा.'
            }
            rows={3}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              lineHeight: 1.4,
              outline: 'none'
            }}
          />
        </div>

        {/* Quick Options chips for low literacy users */}
        {quickOptions.length > 0 && (
          <div style={{ width: '100%', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
              किंवा खालील पर्याय निवडा:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {quickOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickOptionClick(opt)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1.5px solid var(--border-medium)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    minHeight: '40px'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1, minHeight: '48px' }}
          >
            {t.common.cancel}
          </button>

          <button
            onClick={handleSend}
            disabled={!manualText.trim()}
            className="btn-primary"
            style={{
              flex: 2,
              minHeight: '48px',
              opacity: manualText.trim() ? 1 : 0.5,
              cursor: manualText.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            <Send size={18} />
            <span>उत्तर पाठवा</span>
          </button>
        </div>
      </div>
    </div>
  );
};
