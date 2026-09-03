import React, { useState } from 'react';
import {
  Landmark,
  CheckCircle,
  FileText,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { schemeService } from '../services/schemeService';
import { SchemeInfo } from '../types';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface SchemeRouterScreenProps {
  onNavigate: (route: string) => void;
}

export const SchemeRouterScreen: React.FC<SchemeRouterScreenProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const schemes = schemeService.getSchemes();
  const [selectedScheme, setSelectedScheme] = useState<SchemeInfo>(schemes[0]); // PMEGP default

  const voiceSummary = `ग्रामीण भागातील नवीन दुग्ध प्रक्रिया युनिटसाठी PMEGP योजना सर्वात उत्तम आहे. यात १० लाखांच्या प्रकल्पावर ३५ टक्के म्हणजे साडेतीन लाख रुपयांचे थेट सरकारी अनुदान मिळते.`;

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.schemes.title}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {t.schemes.subtitle}
          </p>
        </div>

        <AudioExplainButton
          id="audio_schemes_summary"
          textToSpeak={voiceSummary}
          size="sm"
        />
      </div>

      {/* Schemes List / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {schemes.map((scheme) => {
          const isSelected = selectedScheme.id === scheme.id;

          return (
            <div
              key={scheme.id}
              className="saathi-card"
              style={{
                padding: '18px',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                backgroundColor: isSelected ? '#FFFFFF' : 'var(--bg-card)',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Landmark size={22} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {scheme.nameNative[language] || scheme.nameNative.mr || scheme.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {scheme.sponsoringAgency}
                    </div>
                  </div>
                </div>

                <DataTrustBadge trustInfo={scheme.trustInfo} />
              </div>

              {/* Subsidy Highlight Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  marginBottom: '12px'
                }}
              >
                <span>🎁 {scheme.subsidyPercent}% थेट शासकीय सबसिडी (अनुदान)</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '14px' }}>
                {scheme.whySuitable}
              </p>

              {/* Financial Quick Specs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  backgroundColor: 'var(--bg-app)',
                  padding: '10px 8px',
                  borderRadius: '10px',
                  marginBottom: '14px',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>प्रकल्प मर्यादा</div>
                  <div className="num-font" style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{(scheme.maxProjectCost / 100000).toFixed(0)} लाख
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>व्याज दर</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    {scheme.interestRateRange}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>मुदत</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--success)' }}>
                    {scheme.tenureYears} वर्षे
                  </div>
                </div>
              </div>

              {/* Eligibility checklist drawer */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  ✓ प्रमुख पात्रता निकष:
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {scheme.eligibilityConditions.map((cond, i) => (
                    <li key={i} style={{ marginBottom: '2px' }}>
                      {cond}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                  <FileText size={14} />
                  <span>लागणारी कागदपत्रे:</span>
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {scheme.requiredDocuments.map((doc, i) => (
                    <li key={i} style={{ marginBottom: '2px' }}>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact office */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '6px 10px', backgroundColor: 'var(--bg-app)', borderRadius: '8px' }}>
                📍 <strong>अर्ज कुठे करावा:</strong> {scheme.nodalContact}
              </div>
            </div>
          );
        })}
      </div>

      {/* Portal Verification Notice */}
      <div
        style={{
          padding: '12px 14px',
          backgroundColor: '#FFF7ED',
          borderRadius: '12px',
          border: '1px solid #FED7AA',
          fontSize: '0.8rem',
          color: '#9A3412',
          lineHeight: 1.4,
          marginBottom: '20px'
        }}
      >
        💡 <strong>टीप:</strong> {t.schemes.verifyEligibilityNotice}
      </div>

      {/* Next Action */}
      <button
        onClick={() => onNavigate('/emi')}
        className="btn-primary"
        style={{ width: '100%', minHeight: '52px', fontSize: '1.05rem', borderRadius: '16px' }}
      >
        <span>कर्जाचा हप्ता (EMI) समजून घ्या</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
