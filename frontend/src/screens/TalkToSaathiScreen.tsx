import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, RotateCcw, Sparkles, ChevronRight, AlertCircle, TrendingUp, IndianRupee, Landmark, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { useUser } from '../context/UserContext';
import { conversationService } from '../services/conversationService';
import { storageService } from '../services/storageService';
import { ChatMessage, StructuredCardPayload, LiveAreaContext } from '../types';
import { AudioExplainButton } from '../components/common/AudioExplainButton';
import { LiveAreaSurveyModal } from '../components/chat/LiveAreaSurveyModal';

interface TalkToSaathiScreenProps {
  onNavigate: (route: string) => void;
}

export const TalkToSaathiScreen: React.FC<TalkToSaathiScreenProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { profile } = useUser();
  const { isListening, isProcessingVoice, startListening, stopListening, recordMicrophoneAudio, transcript, clearTranscript, speak } = useVoice();
  const [activeVoiceStop, setActiveVoiceStop] = useState<(() => Promise<string>) | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    conversationService.getMessages(language)
  );
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper: check if saved survey is valid for active user's current occupation and area
  const checkIsSurveyValid = (survey: LiveAreaContext | null): boolean => {
    if (!survey) return false;
    const currentBiz = (profile.desiredBusiness || 'Mobile & Electronics Repair').trim().toLowerCase();
    const currentVillage = (profile.village || '').trim().toLowerCase();

    // Must have matching occupation and matching village (if specified)
    const matchesOcc = !survey.occupation || survey.occupation.trim().toLowerCase() === currentBiz;
    const matchesVillage = !currentVillage || !survey.villageName || survey.villageName.trim().toLowerCase() === currentVillage;

    return Boolean(matchesOcc && matchesVillage);
  };

  // User-scoped Live Area Survey Reconnaissance State
  const [liveAreaContext, setLiveAreaContext] = useState<LiveAreaContext | null>(() => {
    const saved = storageService.get<LiveAreaContext | null>('live_area_survey', null);
    return checkIsSurveyValid(saved) ? saved : null;
  });

  // Automatically pop the 5 live area questions immediately when entering if not yet settled for this user ID & occupation
  const [showSurveyModal, setShowSurveyModal] = useState<boolean>(() => {
    const saved = storageService.get<LiveAreaContext | null>('live_area_survey', null);
    return !checkIsSurveyValid(saved);
  });

  // Enforce dynamic re-check: every time a new user ID enters or occupation/village changes, ask 5 questions again
  useEffect(() => {
    const saved = storageService.get<LiveAreaContext | null>('live_area_survey', null);
    const isValid = checkIsSurveyValid(saved);
    if (isValid) {
      setLiveAreaContext(saved);
      setShowSurveyModal(false);
    } else {
      // New user ID or changed occupation/village -> ask 5 live questions again to settle live data
      setLiveAreaContext(null);
      setShowSurveyModal(true);
    }
    setMessages([...conversationService.getMessages(language)]);
  }, [profile.id, profile.mobile, profile.desiredBusiness, profile.village, language]);

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
      const response = await conversationService.sendMessage(messageContent, language, isVoice, liveAreaContext);
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

  const handleCompleteSurvey = (survey: LiveAreaContext) => {
    const currentBiz = profile.desiredBusiness || 'Mobile & Electronics Repair';
    const currentVillage = profile.village || 'तुमचे गाव';

    const enrichedSurvey: LiveAreaContext = {
      ...survey,
      occupation: currentBiz,
      villageName: currentVillage
    };

    setLiveAreaContext(enrichedSurvey);
    storageService.set('live_area_survey', enrichedSurvey);
    setShowSurveyModal(false);

    // Post acknowledgement message from SAATHI into conversation stream
    const confirmationText =
      language === 'mr'
        ? `✅ **स्थानिक पाहणी यशस्वीपणे नोंदवली!**\n• व्यवसाय: **${currentBiz}**\n• गाव/परिसर: **${currentVillage}**\n• परिसरातील थेट स्पर्धक: **${enrichedSurvey.competitorCount} दुकाने**\n• मुख्य स्थानिक अडचण: **${enrichedSurvey.localObstacles}**\n• प्रत्यक्ष परिस्थिती: **${enrichedSurvey.dynamicAnswers[0]?.answer || 'नोंद झाली'}**\n\nआता साथी AI तुमच्या प्रत्यक्ष गावातील ताज्या माहितीवर आधारित १००% अचूक मार्गदर्शन करेल. तुम्ही कोणताही प्रश्न विचारू शकता!`
        : language === 'hi'
        ? `✅ **स्थानीय सर्वेक्षण सफलतापूर्वक दर्ज हो गया!**\n• व्यापार: **${currentBiz}**\n• गांव/क्षेत्र: **${currentVillage}**\n• क्षेत्र के प्रतिस्पर्धी: **${enrichedSurvey.competitorCount} दुकानें**\n• मुख्य स्थानीय समस्या: **${enrichedSurvey.localObstacles}**\n• जमीनी स्थिति: **${enrichedSurvey.dynamicAnswers[0]?.answer || 'दर्ज हो गई'}**\n\nअब साथी AI आपके गांव की वास्तविक स्थिति के आधार पर सटीक सलाह देगा। अपना प्रश्न पूछें!`
        : `✅ **Live Area Reconnaissance Recorded!**\n• Occupation: **${currentBiz}**\n• Village/Area: **${currentVillage}**\n• Direct Local Competitors: **${enrichedSurvey.competitorCount} shops**\n• Key Local Obstacle: **${enrichedSurvey.localObstacles}**\n• Ground Factor: **${enrichedSurvey.dynamicAnswers[0]?.answer || 'Recorded'}**\n\nSAATHI AI will now provide grounded recommendations factoring in your local village reality. Ask anything!`;

    const confirmationMsg: ChatMessage = {
      id: 'survey_ack_' + Date.now(),
      sender: 'saathi',
      text: confirmationText,
      timestamp: Date.now()
    };

    const currentList = conversationService.getMessages(language);
    currentList.push(confirmationMsg);
    conversationService.saveMessages(language, currentList);
    setMessages([...currentList]);

    speak(
      language === 'mr'
        ? 'स्थानिक माहिती नोंदवली आहे. आता विचारा तुमचा कोणताही प्रश्न.'
        : language === 'hi'
        ? 'स्थानीय जानकारी दर्ज कर ली गई है। अब अपना प्रश्न पूछें।'
        : 'Live area information recorded. Ask your question now.'
    );
  };

  const handleVoiceToggle = async () => {
    if (isListening) {
      if (activeVoiceStop) {
        try {
          const res = await activeVoiceStop();
          if (res.trim()) {
            handleSend(res, true);
          }
        } catch {}
        setActiveVoiceStop(null);
      } else {
        stopListening();
        if (inputText.trim()) {
          handleSend(inputText, true);
        }
      }
    } else {
      clearTranscript();
      setInputText('');
      try {
        const session = await recordMicrophoneAudio((res) => {
          setInputText(res);
        });
        setActiveVoiceStop(() => session.stop);
      } catch {
        startListening((result) => {
          setInputText(result);
        });
      }
    }
  };

  const renderCleanMessageText = (text: string, isSaathi: boolean) => {
    if (!text) return null;

    // Client-side fail-safe sanitizer for symbols & raw markdown
    const cleaned = text
      .replace(/\b(?:INR|Rs)\.?\s*(?=\d)/gi, '₹')
      .replace(/\b(?:INR|Rs)\.\s*/gi, '₹')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[=\-_]{3,}\s*$/gm, '');

    const rawLines = cleaned.split('\n');
    const elements: React.ReactNode[] = [];

    rawLines.forEach((line, idx) => {
      let trimmed = line.trim();

      if (!trimmed) {
        elements.push(<div key={`space_${idx}`} style={{ height: '5px' }} />);
        return;
      }

      // Strip any lingering markdown headers
      if (/^#{1,6}\s+/.test(trimmed)) {
        trimmed = trimmed.replace(/^#{1,6}\s+/, '').trim();
        trimmed = trimmed.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}]\s*/u, '');
        if (!trimmed.endsWith(':') && !trimmed.endsWith('?')) {
          trimmed += ':';
        }
      }

      // Strip bold & italic markers
      trimmed = trimmed
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/~~([^~]+)~~/g, '$1')
        .replace(/<[^>]+>/g, '');

      // Check if Bullet Point (*, -, +, •)
      if (/^[•*\-+]\s+/.test(trimmed)) {
        const bulletContent = trimmed.replace(/^[•*\-+]\s+/, '').trim();
        elements.push(
          <div
            key={`bullet_${idx}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              margin: '3px 0',
              paddingLeft: '4px'
            }}
          >
            <span
              style={{
                color: isSaathi ? 'var(--primary, #047857)' : '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.05rem',
                lineHeight: 1.3
              }}
            >
              •
            </span>
            <span style={{ flex: 1, lineHeight: 1.55 }}>{bulletContent}</span>
          </div>
        );
        return;
      }

      // Check if Numbered Step (1., 2.)
      const numberMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
      if (numberMatch) {
        elements.push(
          <div
            key={`num_${idx}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              margin: '4px 0',
              paddingLeft: '4px'
            }}
          >
            <span
              style={{
                color: isSaathi ? 'var(--primary, #047857)' : '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.92rem',
                minWidth: '20px',
                lineHeight: 1.55
              }}
            >
              {numberMatch[1]}.
            </span>
            <span style={{ flex: 1, lineHeight: 1.55 }}>{numberMatch[2]}</span>
          </div>
        );
        return;
      }

      // Check if Section Header (ends with colon)
      const isHeader = trimmed.endsWith(':') && trimmed.length < 70;
      if (isHeader) {
        elements.push(
          <div
            key={`header_${idx}`}
            style={{
              fontWeight: 700,
              fontSize: '0.98rem',
              marginTop: idx === 0 ? '0px' : '8px',
              marginBottom: '4px',
              color: isSaathi ? 'var(--text-primary, #111827)' : '#FFFFFF'
            }}
          >
            {trimmed}
          </div>
        );
        return;
      }

      // Regular Sentence / Paragraph
      elements.push(
        <div key={`para_${idx}`} style={{ margin: '3px 0', lineHeight: 1.55 }}>
          {trimmed}
        </div>
      );
    });

    return elements;
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
      {/* Live Area Reconnaissance Status Banner */}
      <div
        style={{
          padding: '8px 16px',
          backgroundColor: liveAreaContext ? '#F0FDF4' : '#EFF6FF',
          borderBottom: `1.5px solid ${liveAreaContext ? '#BBF7D0' : '#BFDBFE'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} color={liveAreaContext ? '#16A34A' : '#2563EB'} />
          <div>
            <span style={{ fontWeight: 800, color: liveAreaContext ? '#166534' : '#1E40AF' }}>
              {language === 'en' ? 'Live Area Recon:' : 'थेट परिसर माहिती:'}{' '}
            </span>
            <span style={{ color: liveAreaContext ? '#15803D' : '#3B82F6', fontWeight: 600 }}>
              {liveAreaContext
                ? `${profile.desiredBusiness || 'व्यवसाय'} (${profile.village || 'गाव'}) • ${liveAreaContext.competitorCount} ${language === 'en' ? 'competitors' : 'स्पर्धक'} • ${liveAreaContext.localObstacles.slice(0, 30)}`
                : (language === 'en'
                    ? `5 live questions pending for ${profile.desiredBusiness || 'Business'} in ${profile.village || 'your area'}`
                    : `${profile.desiredBusiness || 'व्यवसाय'} (${profile.village || 'गाव'}) साठी ५ थेट प्रश्न शिल्लक आहेत`)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowSurveyModal(true)}
          style={{
            background: liveAreaContext ? '#DCFCE7' : '#DBEAFE',
            border: `1.5px solid ${liveAreaContext ? '#86EFAC' : '#93C5FD'}`,
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: liveAreaContext ? '#15803D' : '#1D4ED8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RefreshCw size={12} />
          <span>
            {liveAreaContext
              ? (language === 'en' ? 'Re-ask 5 Qs ✎' : '५ प्रश्न पुन्हा विचारा ✎')
              : (language === 'en' ? 'Answer 5 Questions ➔' : '५ प्रश्न उत्तरे द्या ➔')}
          </span>
        </button>
      </div>

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
                    <img
                      src="/vyapar-saathi-logo.png"
                      alt="Vyapar Saathi"
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        objectFit: 'contain',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(13, 148, 136, 0.3)'
                      }}
                    />
                    <span>Vyapar Saathi (व्यापार साथी)</span>
                    <AudioExplainButton
                      id={`audio_msg_${msg.id}`}
                      textToSpeak={msg.text}
                      size="sm"
                    />
                  </>
                ) : (
                  <span>👤 {profile.name ? profile.name.split(' ')[0] : 'तुम्ही'}</span>
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
                  lineHeight: 1.5,
                  wordBreak: 'break-word'
                }}
              >
                {renderCleanMessageText(msg.text, isSaathi)}

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

      {/* 5-Question Live Area Reconnaissance Modal */}
      <LiveAreaSurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onComplete={handleCompleteSurvey}
        occupation={profile.desiredBusiness || 'Mobile & Electronics Repair'}
        villageName={profile.village || 'तुमचे गाव'}
      />
    </div>
  );
};
