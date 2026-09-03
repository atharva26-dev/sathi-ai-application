import React from 'react';
import {
  TrendingUp,
  ShieldAlert,
  Info,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { businessService } from '../services/businessService';
import { ProgressRing } from '../components/common/ProgressRing';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface BusinessFeasibilityScreenProps {
  onNavigate: (route: string) => void;
}

export const BusinessFeasibilityScreen: React.FC<BusinessFeasibilityScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const report = businessService.getFeasibilityReport();

  const voiceSummary = `तुमच्या पनीर व्यवसायाचा अंदाजित AI अनुकूलता स्कोअर ७८ आहे. स्थानिक मागणी आणि भांडवलाच्या बाबतीत हा व्यवसाय उत्तम आहे. खेळते भांडवल आणि वीज पुरवठ्याचे योग्य नियोजन केल्यास हा व्यवसाय यशस्वी होऊ शकतो.`;

  const subMetrics = [
    { label: t.feasibility.marketDemand, score: report.marketDemandScore, color: '#059669' },
    { label: t.feasibility.capitalSuitability, score: report.capitalFitScore, color: '#059669' },
    { label: t.feasibility.growthPotential, score: report.growthScore, color: '#059669' },
    { label: t.feasibility.operationalEase, score: report.complexityScore, color: '#D97706' },
    { label: t.feasibility.lowCompetition, score: report.competitionScore, color: '#D97706' },
    { label: t.feasibility.riskLevel, score: report.riskScore, color: '#D97706' }
  ];

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.feasibility.title}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            विविध घटकांवर आधारित संपूर्ण व्यावसायिक मूल्यांकन
          </p>
        </div>

        <AudioExplainButton
          id="audio_feasibility_summary"
          textToSpeak={voiceSummary}
          size="sm"
        />
      </div>

      {/* Main Score Hero Card */}
      <div
        className="saathi-card"
        style={{
          padding: '24px 20px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '20px'
        }}
      >
        <ProgressRing score={report.overallScore} size={130} strokeWidth={12} label="" sublabel="/१००" />

        <div style={{ marginTop: '12px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.feasibility.indicativeScore}
          </h3>
          <div style={{ margin: '6px 0 10px' }}>
            <DataTrustBadge trustInfo={report.trustInfo} />
          </div>
        </div>

        {/* Mandatory Non-guarantee Disclaimer */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#FFF7ED',
            borderRadius: '10px',
            border: '1px solid #FED7AA',
            fontSize: '0.78rem',
            color: '#9A3412',
            lineHeight: 1.4,
            marginTop: '4px'
          }}
        >
          ⚠️ <strong>महत्त्वाची सूचना:</strong> {report.disclaimerText}
        </div>
      </div>

      {/* 6 Dimension Sub-scores */}
      <div className="saathi-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
          घटकनिहाय अनुकूलता स्कोअर:
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {subMetrics.map((m, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.label}</span>
                <span className="num-font" style={{ fontWeight: 800, color: m.color }}>
                  {m.score}/१००
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${m.score}%`,
                    height: '100%',
                    backgroundColor: m.color,
                    borderRadius: '4px',
                    transition: 'width 0.8s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct link to Visual SWOT Analysis */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={() => onNavigate('/swot')}
          className="btn-primary"
          style={{ width: '100%', minHeight: '52px', fontSize: '1.05rem', borderRadius: '16px' }}
        >
          <span>📊 सविस्तर SWOT विश्लेषण पाहा</span>
          <ChevronRight size={20} />
        </button>

        <button
          onClick={() => onNavigate('/stress-test')}
          className="btn-secondary"
          style={{ width: '100%', minHeight: '48px', borderRadius: '14px' }}
        >
          <span>⚡ कठीण काळात व्यवसाय कसा टिकेल? (Stress Test)</span>
        </button>
      </div>
    </div>
  );
};
