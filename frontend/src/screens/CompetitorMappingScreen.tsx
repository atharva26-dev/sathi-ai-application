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
  const { t, language } = useLanguage();
  const competitors = marketService.getCompetitors();

  const audioText =
    language === 'mr'
      ? `तुमच्या गावात थेट पनीर बनवणारा कोणताही मोठा स्थानिक कारखाना नाही. शहरातून येणाऱ्या व्हॅनमधून हॉटेल्सना जुने पनीर मिळते, ज्यामुळे तुमच्या ताज्या पनीरला मोठी संधी आहे.`
      : language === 'hi'
      ? `आपके क्षेत्र में सीधे पनीर बनाने वाली कोई स्थानीय इकाई नहीं है। बाहर से आने वाले पनीर की तुलना में आपके ताजे पनीर के लिए बड़ा बाजार उपलब्ध है।`
      : `There are no major local paneer manufacturing units in your immediate area. Hotels rely on deliveries from distant towns, creating high demand for your fresh local supply.`;

  return (
    <div className="screen-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {language === 'mr' ? 'स्थानिक स्पर्धक विश्लेषण' : language === 'hi' ? 'स्थानीय प्रतिस्पर्धी विश्लेषण' : 'Local Competitor Analysis'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {language === 'mr'
              ? 'सध्या बाजारात कोण माल विकत आहे आणि त्यांच्यात काय त्रुटी आहेत'
              : language === 'hi'
              ? 'वर्तमान में बाजार में कौन माल बेच रहा है और उनकी क्या कमियां हैं'
              : 'Who currently supplies the market and where their service gaps lie'}
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
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {language === 'mr' ? 'अंदाजित पुरवठा:' : language === 'hi' ? 'अनुमानित आपूर्ति:' : 'Estimated Supply:'}
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {comp.estimatedDailyVolume}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {language === 'mr' ? 'विक्री दर:' : language === 'hi' ? 'बिक्री दर:' : 'Price Point:'}
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                  {comp.pricePosition}
                </div>
              </div>
            </div>

            {/* Known Service Gaps */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                {language === 'mr'
                  ? '💡 यांच्याकडील त्रुटी (तुमचा फायदा):'
                  : language === 'hi'
                  ? '💡 प्रतिस्पर्धियों की कमियां (आपका अवसर):'
                  : '💡 Competitor Gaps (Your Advantage):'}
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
        <span>
          {language === 'mr' ? 'नकाशावर परत जा' : language === 'hi' ? 'नक्शे पर वापस जाएं' : 'Back to Market Map'}
        </span>
      </button>
    </div>
  );
};
