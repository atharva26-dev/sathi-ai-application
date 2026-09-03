import React from 'react';
import {
  Megaphone,
  Utensils,
  MessageCircle,
  Store,
  Users,
  CheckCircle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { marketingService } from '../services/marketingService';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface MarketingManagerScreenProps {
  onNavigate: (route: string) => void;
}

export const MarketingManagerScreen: React.FC<MarketingManagerScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const channels = marketingService.getMarketingChannels();

  const voiceText = `ग्रामीण भागात सोशल मीडिया जाहिरातींऐवजी स्थानिक महामार्ग ढाब्यांना मोफत सॅम्पल देणे आणि गावच्या व्हॉट्सॲप ग्रुप्सवर सकाळी मेसेज पाठवणे हे सर्वात स्वस्त आणि जास्त ग्राहक देणारे मार्ग आहेत.`;

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.marketing.title}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {t.marketing.subtitle}
          </p>
        </div>

        <AudioExplainButton
          id="audio_marketing_summary"
          textToSpeak={voiceText}
          size="sm"
        />
      </div>

      {/* Recommended Channels List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {channels.map((ch, idx) => {
          let icon = <Utensils size={22} color="var(--primary)" />;
          if (ch.iconName === 'MessageCircle') icon = <MessageCircle size={22} color="#059669" />;
          if (ch.iconName === 'Store') icon = <Store size={22} color="#D97706" />;
          if (ch.iconName === 'Users') icon = <Users size={22} color="#2563EB" />;

          return (
            <div
              key={ch.id}
              className="saathi-card"
              style={{
                padding: '18px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--border-medium)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-app)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {ch.title}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      लक्षित ग्राहक: {ch.targetAudience}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: ch.suitability === 'BEST' ? '#DCFCE7' : '#FEF3C7',
                    color: ch.suitability === 'BEST' ? '#166534' : '#92400E',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {ch.suitability === 'BEST' ? '⭐ सर्वोत्तम मार्ग' : 'चांगला मार्ग'}
                </span>
              </div>

              {/* Why this channel */}
              <div
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#FFFBF5',
                  borderRadius: '10px',
                  border: '1px solid #FED7AA',
                  fontSize: '0.86rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.45,
                  marginBottom: '12px'
                }}
              >
                💡 <strong>फायदा:</strong> {ch.whyRecommended}
              </div>

              {/* Practical Steps */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                  {t.marketing.actionSteps}:
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {ch.practicalSteps.map((step, i) => (
                    <li key={i} style={{ marginBottom: '3px' }}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cost badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                <span>अंदाजित खर्च: <strong style={{ color: 'var(--success)' }}>{ch.costEstimate}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/pricing')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>🏷️ योग्य विक्री दर कसा ठरवायचा?</span>
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onNavigate('/home')}
          className="btn-secondary"
          style={{ flex: 1, minHeight: '48px', borderRadius: '14px' }}
        >
          <ArrowLeft size={16} />
          <span>मुख्य पान</span>
        </button>
      </div>
    </div>
  );
};
