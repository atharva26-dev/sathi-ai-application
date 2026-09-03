import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, RotateCcw, Sparkles, ChevronRight, AlertCircle, TrendingUp, IndianRupee, Landmark } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { useUser } from '../context/UserContext';
import { conversationService } from '../services/conversationService';
import { ChatMessage, StructuredCardPayload } from '../types';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface TalkToSaathiScreenProps {
  onNavigate: (route: string) => void;
}

export const TalkToSaathiScreen: React.FC<TalkToSaathiScreenProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { profile } = useUser();
  const { isListening, startListening, stopListening, transcript, clearTranscript, speak } = useVoice();

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    conversationService.getMessages(language)
  );
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = conversationService.getSuggestedQuestions(language);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSend = async (textToSend?: string, isVoice = false) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isProcessing) return;

    setInputText('');
    clearTranscript();
    stopListening();
    setIsProcessing(true);

    try {
      const response = await conversationService.sendMessage(messageContent, language, isVoice);
      setMessages([...conversationService.getMessages(language)]);

      // Auto speak the response for rural voice-first experience
      if (isVoice) {
        speak(response.text);
      }
    } catch (e) {
      console.warn('Chat error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      if (inputText.trim()) {
        handleSend(inputText, true);
      }
    } else {
      clearTranscript();
      setInputText('');
      startListening((result) => {
        setInputText(result);
      });
    }
  };

  const renderStructuredCard = (card: StructuredCardPayload, index: number) => {
    return (
      <div
        key={index}
        className="saathi-card animate-fade-in"
        style={{
          marginTop: '10px',
          padding: '14px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-dark)', marginBottom: '4px' }}>
          {card.title}
        </div>
        {card.subtitle && (
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            {card.subtitle}
          </div>
        )}

        {card.actionRoute && (
          <button
            onClick={() => onNavigate(card.actionRoute!)}
            className="btn-primary"
            style={{
              width: '100%',
              minHeight: '38px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              borderRadius: '10px',
              justifyContent: 'space-between'
            }}
          >
            <span>{card.actionText || 'सविस्तर पाहा'}</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--header-height) - var(--nav-height))',
        backgroundColor: 'var(--bg-app)'
      }}
    >
      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {messages.map((msg) => {
          const isSaathi = msg.sender === 'saathi';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isSaathi ? 'flex-start' : 'flex-end',
                maxWidth: '90%',
                alignSelf: isSaathi ? 'flex-start' : 'flex-end'
              }}
            >
              {/* Sender Name & Audio Icon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 700
                }}
              >
                {isSaathi ? (
                  <>
                    <span>🤖 SAATHI साथी</span>
                    <AudioExplainButton
                      id={`audio_msg_${msg.id}`}
                      textToSpeak={msg.text}
                      size="sm"
                    />
                  </>
                ) : (
                  <span>👤 {profile.name.split(' ')[0] || 'तुम्ही'}</span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                style={{
                  backgroundColor: isSaathi ? '#FFFFFF' : 'var(--primary)',
                  color: isSaathi ? 'var(--text-primary)' : '#FFFFFF',
                  padding: '14px 16px',
                  borderRadius: isSaathi ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
                  border: isSaathi ? '1.5px solid var(--border-medium)' : 'none',
                  boxShadow: 'var(--shadow-xs)',
                  fontSize: '0.98rem',
                  lineHeight: 1.5
                }}
              >
                {msg.text}

                {/* Render Structured Cards if available */}
                {msg.cards && msg.cards.map((card, idx) => renderStructuredCard(card, idx))}
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
            <div className="wave-bar" style={{ height: '14px', width: '3px', backgroundColor: 'var(--primary)' }} />
            <div className="wave-bar" style={{ height: '22px', width: '3px', backgroundColor: 'var(--primary)' }} />
            <div className="wave-bar" style={{ height: '16px', width: '3px', backgroundColor: 'var(--primary)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              साथी उत्तर तयार करत आहे...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Horizontal Scroller */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-card-subtle)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          flexShrink: 0
        }}
      >
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q, false)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              minHeight: '34px',
              flexShrink: 0
            }}
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Bottom Voice & Text Input Bar */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--bg-card)',
          borderTop: '1.5px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0
        }}
      >
        {/* Microphone Action Button */}
        <div style={{ position: 'relative' }}>
          {isListening && (
            <div
              className="voice-pulse-ring"
              style={{
                position: 'absolute',
                top: '-6px',
                left: '-6px',
                right: '-6px',
                bottom: '-6px',
                borderRadius: '50%',
                backgroundColor: 'rgba(234, 88, 12, 0.3)',
                zIndex: 1
              }}
            />
          )}
          <button
            onClick={handleVoiceToggle}
            aria-label={isListening ? 'माइक थांबवा' : 'माइक दाबून बोला'}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: isListening ? '#DC2626' : 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
              flexShrink: 0
            }}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
        </div>

        {/* Text Input Field */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-app)',
            borderRadius: '16px',
            border: '1.5px solid var(--border-medium)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={isListening ? 'मी ऐकत आहे... बोला' : t.chat.inputPlaceholder}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '0.98rem',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          aria-label="पाठवा"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            backgroundColor: inputText.trim() ? 'var(--primary)' : 'var(--bg-card-subtle)',
            color: inputText.trim() ? '#FFFFFF' : 'var(--text-muted)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
