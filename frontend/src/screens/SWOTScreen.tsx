import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { businessService } from '../services/businessService';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface SWOTScreenProps {
  onNavigate: (route: string) => void;
}

export const SWOTScreen: React.FC<SWOTScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { swot } = businessService.getFeasibilityReport();

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {t.swot.title}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          तुमच्या व्यवसायाची ताकद, उणिवा, संधी आणि धोके सोप्या भाषेत
        </p>
      </div>

      {/* 4 Quadrants of SWOT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {/* 1. Strengths (हिरवा / Green) */}
        <div
          className="saathi-card"
          style={{
            backgroundColor: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            borderLeft: '6px solid #059669',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <ShieldCheck size={22} color="#059669" />
            <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#065F46' }}>
              {t.swot.strengths}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {swot.strengths.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #BBF7D0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {item.text}
                  </div>
                  <AudioExplainButton
                    id={`swot_s_${idx}`}
                    textToSpeak={item.audioVoiceText || item.simpleExplanation}
                    size="sm"
                  />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.simpleExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Weaknesses (पिवळा / Amber) */}
        <div
          className="saathi-card"
          style={{
            backgroundColor: '#FFFBEB',
            border: '1.5px solid #FCD34D',
            borderLeft: '6px solid #D97706',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertTriangle size={22} color="#D97706" />
            <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#92400E' }}>
              {t.swot.weaknesses}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {swot.weaknesses.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #FDE68A'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {item.text}
                  </div>
                  <AudioExplainButton
                    id={`swot_w_${idx}`}
                    textToSpeak={item.audioVoiceText || item.simpleExplanation}
                    size="sm"
                  />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.simpleExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Opportunities (निळा / Blue) */}
        <div
          className="saathi-card"
          style={{
            backgroundColor: '#EFF6FF',
            border: '1.5px solid #93C5FD',
            borderLeft: '6px solid #2563EB',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sparkles size={22} color="#2563EB" />
            <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#1E40AF' }}>
              {t.swot.opportunities}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {swot.opportunities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #BFDBFE'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {item.text}
                  </div>
                  <AudioExplainButton
                    id={`swot_o_${idx}`}
                    textToSpeak={item.audioVoiceText || item.simpleExplanation}
                    size="sm"
                  />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.simpleExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Threats (लाल / Red) */}
        <div
          className="saathi-card"
          style={{
            backgroundColor: '#FEF2F2',
            border: '1.5px solid #FCA5A5',
            borderLeft: '6px solid #DC2626',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <ShieldAlert size={22} color="#DC2626" />
            <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#991B1B' }}>
              {t.swot.threats}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {swot.threats.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #FECACA'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {item.text}
                  </div>
                  <AudioExplainButton
                    id={`swot_t_${idx}`}
                    textToSpeak={item.audioVoiceText || item.simpleExplanation}
                    size="sm"
                  />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.simpleExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/stress-test')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>⚡ कठीण काळात व्यवसाय टिकेल का?</span>
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onNavigate('/feasibility')}
          className="btn-secondary"
          style={{ flex: 1, minHeight: '48px', borderRadius: '14px' }}
        >
          <ArrowLeft size={16} />
          <span>मागे</span>
        </button>
      </div>
    </div>
  );
};
