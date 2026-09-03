import React from 'react';
import { Rocket, AlertTriangle, CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { marketingService } from '../services/marketingService';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface ExpansionPlannerScreenProps {
  onNavigate: (route: string) => void;
}

export const ExpansionPlannerScreen: React.FC<ExpansionPlannerScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const phases = marketingService.getExpansionRoadmap();

  const voiceText = `व्यवसाय वाढवताना घाई करू नका. पहिल्या ३ महिन्यांत केवळ ५ हॉटेल्सना नियमित पुरवठा स्थिर करा आणि उधारी वेळेत वसूल होऊ द्या. बँकेचा हप्ता सलग ६ महिने वेळेत भरल्याशिवाय नवीन गुंतवणूक करू नका.`;

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.expansion.title}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {t.expansion.subtitle}
          </p>
        </div>

        <AudioExplainButton
          id="audio_expansion_summary"
          textToSpeak={voiceText}
          size="sm"
        />
      </div>

      {/* Expansion Phases Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
        {phases.map((phase, idx) => (
          <div
            key={phase.id}
            className="saathi-card"
            style={{
              padding: '18px',
              backgroundColor: '#FFFFFF',
              border: idx === 0 ? '2px solid var(--primary)' : '1.5px solid var(--border-medium)',
              boxShadow: idx === 0 ? 'var(--shadow-md)' : 'var(--shadow-xs)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: idx === 0 ? 'var(--primary)' : 'var(--bg-card-subtle)',
                    color: idx === 0 ? '#FFFFFF' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}
                >
                  {idx + 1}
                </div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {phase.timeframeLabel}
                </h3>
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)', backgroundColor: 'var(--primary-subtle)', padding: '3px 8px', borderRadius: '6px' }}>
                {phase.revenueMilestone}
              </span>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '10px' }}>
              🎯 {phase.keyTarget}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem', backgroundColor: 'var(--bg-app)', padding: '10px', borderRadius: '10px', marginBottom: '12px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>पुनर्गंतवणूक:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {phase.reinvestmentPlan}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>क्षमता वाढ:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {phase.capacityAddition}
                </div>
              </div>
            </div>

            {/* Strict Prerequisite Safety Rules */}
            <div
              style={{
                padding: '12px',
                backgroundColor: '#FFF7ED',
                borderRadius: '10px',
                border: '1px solid #FED7AA'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 800, color: '#9A3412', marginBottom: '4px' }}>
                <AlertTriangle size={14} />
                <span>{t.expansion.safetyRuleTitle}</span>
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                {phase.mustNotExpandUntil.map((gate, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>
                    {gate}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/mentor')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>👨‍🏫 माझा कृती आराखडा (टास्क) पाहा</span>
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
