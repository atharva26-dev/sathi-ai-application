import React from 'react';
import { Store, ShieldCheck, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { marketService } from '../services/marketService';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface CompetitorMappingScreenProps {
  onNavigate: (route: string) => void;
}

export const CompetitorMappingScreen: React.FC<CompetitorMappingScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const competitors = marketService.getCompetitors();

  const audioText = `तुमच्या सुपे गावात थेट पनीर बनवणारा कोणताही मोठा स्थानिक कारखाना नाही. बारामती शहरातून येणाऱ्या व्हॅनमधून हॉटेल्सना जुने पनीर मिळते, ज्यामुळे तुमच्या ताज्या पनीरला मोठी संधी आहे.`;

  return (
    <div className="screen-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            स्थानिक स्पर्धक विश्लेषण
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            सध्या बाजारात कोण माल विकत आहे आणि त्यांच्यात काय त्रुटी आहेत
          </p>
        </div>

        <AudioExplainButton
          id="audio_competitor_summary"
          textToSpeak={audioText}
          size="sm"
        />
      </div>

      {/* Competitors list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        {competitors.map((comp) => (
          <div
            key={comp.id}
            className="saathi-card"
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--border-medium)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {comp.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {comp.category} • {comp.location}
                </div>
              </div>

              <DataTrustBadge trustInfo={comp.trustInfo} />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
                backgroundColor: 'var(--bg-app)',
                padding: '8px 10px',
                borderRadius: '10px',
                margin: '10px 0'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>अंदाजित पुरवठा:</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {comp.estimatedDailyVolume}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>विक्री दर:</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                  {comp.pricePosition}
                </div>
              </div>
            </div>

            {/* Known Service Gaps */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                💡 यांच्याकडील त्रुटी (तुमचा फायदा):
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {comp.knownGaps.map((gap, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onNavigate('/local-market')}
        className="btn-secondary"
        style={{ width: '100%', minHeight: '48px', borderRadius: '14px' }}
      >
        <ArrowLeft size={18} />
        <span>नकाशावर परत जा</span>
      </button>
    </div>
  );
};
