import React, { useState } from 'react';
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Flame,
  ChevronRight,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { businessService } from '../services/businessService';
import { StressScenario } from '../types';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface StressTestScreenProps {
  onNavigate: (route: string) => void;
}

export const StressTestScreen: React.FC<StressTestScreenProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const scenarios = businessService.getStressScenarios();
  const [selectedScenario, setSelectedScenario] = useState<StressScenario>(scenarios[2]); // DIFFICULT default for challenging

  const voiceExplainer = `जरी विक्री ३० टक्क्यांनी घटली आणि दररोज केवळ १७ ते १८ किलो पनीर विकले गेले, तरी महिन्याला सर्व खर्च व कर्जाचा हप्ता जाऊन ₹१४,२०० चा नफा शिल्लक राहील. व्यवसाय सुरक्षित राहील.`;

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '2px' }}>
            <Zap size={16} />
            <span>Challenger Mode</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.stressTest.title}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {t.stressTest.subtitle}
          </p>
        </div>

        <AudioExplainButton
          id="audio_stress_summary"
          textToSpeak={voiceExplainer}
          size="sm"
        />
      </div>

      {/* 4 Scenario Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {scenarios.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          let color = '#059669';
          if (sc.type === 'DIFFICULT') color = '#D97706';
          if (sc.type === 'CRITICAL') color = '#DC2626';

          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              style={{
                padding: '12px 10px',
                borderRadius: '14px',
                backgroundColor: isSelected ? '#FFFFFF' : 'var(--bg-card)',
                border: isSelected ? `2.5px solid ${color}` : '1.5px solid var(--border-medium)',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color }}>
                {sc.type === 'NORMAL'
                  ? 'साधारण (Base)'
                  : sc.type === 'GOOD'
                  ? 'उत्तम (Peak +25%)'
                  : sc.type === 'DIFFICULT'
                  ? 'कठीण (विक्री -30%)'
                  : 'अति-गंभीर (भाववाढ)'}
              </div>
              <div className="num-font" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{sc.estimatedMonthlySurplus.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                उरणारा नफा/महिना
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Scenario Deep Dive Card */}
      <div
        className="saathi-card"
        style={{
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--border-medium)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {selectedScenario.title[language] || selectedScenario.title.mr}
          </h3>

          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.78rem',
              backgroundColor:
                selectedScenario.type === 'CRITICAL'
                  ? '#FEE2E2'
                  : selectedScenario.type === 'DIFFICULT'
                  ? '#FEF3C7'
                  : '#DCFCE7',
              color:
                selectedScenario.type === 'CRITICAL'
                  ? '#991B1B'
                  : selectedScenario.type === 'DIFFICULT'
                  ? '#92400E'
                  : '#166534'
            }}
          >
            {selectedScenario.type === 'CRITICAL'
              ? '⚠️ आपत्कालीन निधी वापरावा लागेल'
              : selectedScenario.type === 'DIFFICULT'
              ? '🟡 सुरक्षित व नफा शिल्लक'
              : '🟢 पूर्ण सुरक्षित'}
          </span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
          {selectedScenario.description[language] || selectedScenario.description.mr}
        </p>

        {/* Key Survival Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
          <div style={{ padding: '10px 8px', backgroundColor: 'var(--bg-app)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.stressTest.surplusLeft}</div>
            <div className="num-font" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '2px' }}>
              ₹{selectedScenario.estimatedMonthlySurplus.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ padding: '10px 8px', backgroundColor: 'var(--bg-app)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>खर्च निघण्याचे दिवस</div>
            <div className="num-font" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {selectedScenario.breakEvenDays} दिवस
            </div>
          </div>

          <div style={{ padding: '10px 8px', backgroundColor: 'var(--bg-app)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>व्यवसाय तग धरेल</div>
            <div className="num-font" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--success)', marginTop: '2px' }}>
              {selectedScenario.survivalRunwayMonths} महिने+
            </div>
          </div>
        </div>

        {/* Actionable Mitigation Plan */}
        <div
          style={{
            padding: '14px',
            backgroundColor: '#FFF7ED',
            borderRadius: '14px',
            border: '1px solid #FED7AA'
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#9A3412', marginBottom: '8px' }}>
            🛡️ {t.stressTest.mitigationTitle}:
          </div>
          <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            {selectedScenario.mitigationSteps.map((step, i) => (
              <li key={i} style={{ marginBottom: '4px' }}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/simulator')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>🧮 नफा-खर्च सिम्युलेटर उघडा</span>
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
