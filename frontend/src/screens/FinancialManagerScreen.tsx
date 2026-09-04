import React, { useState } from 'react';
import {
  IndianRupee,
  Layers,
  ArrowDown,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { financeService } from '../services/financeService';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';
import { SimpleExplanationModal } from '../components/common/SimpleExplanationModal';

interface FinancialManagerScreenProps {
  onNavigate: (route: string) => void;
}

export const FinancialManagerScreen: React.FC<FinancialManagerScreenProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { profile, updateProfile } = useUser();
  const [selectedTermKey, setSelectedTermKey] = useState<string | null>(null);

  const ownCap = profile.ownCapital || 100000;
  const plan = financeService.calculateFinancialStructure(ownCap);

  const voiceExplainer =
    language === 'mr'
      ? `तुमच्याकडील ₹${ownCap.toLocaleString('en-IN')} च्या स्वतःच्या भांडवलावर, १० टक्के मार्जिन मनीच्या नियमानुसार एकूण ₹${plan.projectCost.toLocaleString('en-IN')} चा प्रकल्प उभारता येतो. यामध्ये ₹${plan.loanComponent.toLocaleString('en-IN')} चे बँक कर्ज व शासकीय सबसिडी मिळू शकते.`
      : language === 'hi'
      ? `आपकी ₹${ownCap.toLocaleString('en-IN')} की स्वयं की पूंजी पर, 10% मार्जिन मनी नियम के अनुसार कुल ₹${plan.projectCost.toLocaleString('en-IN')} की परियोजना स्थापित की जा सकती है। इसमें ₹${plan.loanComponent.toLocaleString('en-IN')} का बैंक ऋण व सरकारी सब्सिडी प्राप्त हो सकती है।`
      : `With your ₹${ownCap.toLocaleString('en-IN')} own capital and 10% margin money norms, a total project of ₹${plan.projectCost.toLocaleString('en-IN')} can be established with ₹${plan.loanComponent.toLocaleString('en-IN')} in bank loan and eligible subsidies.`;

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.finance.title}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {t.finance.subtitle}
          </p>
        </div>

        <AudioExplainButton
          id="audio_finance_summary"
          textToSpeak={voiceExplainer}
          size="sm"
        />
      </div>

      {/* Waterfall Capital Breakdown Card */}
      <div
        className="saathi-card"
        style={{
          padding: '20px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {language === 'mr' ? 'भांडवल रचना (Capital Structure)' : language === 'hi' ? 'पूंजी संरचना (Capital Structure)' : 'Capital Structure'}
          </span>
          <DataTrustBadge trustInfo={plan.trustInfo} />
        </div>

        {/* Step 1: Own Capital */}
        <div
          style={{
            padding: '14px',
            backgroundColor: '#EFF6FF',
            borderRadius: '14px',
            border: '1.5px solid #93C5FD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E40AF' }}>
              1. {t.finance.ownCapital}
            </div>
            <div className="num-font" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1D4ED8', marginTop: '2px' }}>
              ₹{plan.ownCapital.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            onClick={() => setSelectedTermKey('margin_money')}
            className="btn-simple-explain"
          >
            <BookOpen size={12} />
            <span>{language === 'en' ? 'Margin Money?' : 'मार्जिन मनी?'}</span>
          </button>
        </div>

        {/* Down Arrow */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowDown size={16} color="var(--primary)" />
          </div>
        </div>

        {/* Step 2: Potential Project Cost */}
        <div
          style={{
            padding: '14px',
            backgroundColor: '#FFF7ED',
            borderRadius: '14px',
            border: '2px solid #EA580C',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#9A3412' }}>
              2. {t.finance.projectCost}
            </div>
            <div className="num-font" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C2410C', marginTop: '2px' }}>
              ₹{plan.projectCost.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#9A3412', fontWeight: 700 }}>
            {language === 'mr' ? '(१० पट प्रकल्प क्षमता)' : language === 'hi' ? '(10 गुना परियोजना क्षमता)' : '(10x Project Scale)'}
          </div>
        </div>

        {/* Down Arrow */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowDown size={16} color="var(--primary)" />
          </div>
        </div>

        {/* Step 3: Loan Component */}
        <div
          style={{
            padding: '14px',
            backgroundColor: '#F3E8FF',
            borderRadius: '14px',
            border: '1.5px solid #D8B4FE',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B21A8' }}>
              3. {t.finance.loanComponent}
            </div>
            <div className="num-font" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#7C3AED', marginTop: '2px' }}>
              ₹{plan.loanComponent.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#6B21A8', fontWeight: 700 }}>
              {language === 'mr' ? 'संभाव्य सबसिडी:' : language === 'hi' ? 'संभावित सब्सिडी:' : 'Eligible Subsidy:'} ₹{plan.subsidyEstimate.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div
          style={{
            marginTop: '16px',
            padding: '10px 12px',
            backgroundColor: '#FEF3C7',
            borderRadius: '10px',
            border: '1px solid #FCD34D',
            fontSize: '0.78rem',
            color: '#92400E',
            lineHeight: 1.4
          }}
        >
          ⚠️ {plan.preliminaryNotice} <br />
          <strong>{t.finance.disclaimerNonGuarantee}</strong>
        </div>
      </div>

      {/* Navigation Buttons for EMI & Budget */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => onNavigate('/emi')}
          className="btn-primary"
          style={{ width: '100%', minHeight: '52px', fontSize: '1.05rem', borderRadius: '16px' }}
        >
          <span>
            {language === 'mr'
              ? 'कर्जाचा मासिक हप्ता (EMI) समजून घ्या'
              : language === 'hi'
              ? 'ऋण की मासिक किस्त (EMI) समझें'
              : 'Understand Monthly Loan Installment (EMI)'}
          </span>
          <ChevronRight size={20} />
        </button>

        <button
          onClick={() => onNavigate('/budget')}
          className="btn-secondary"
          style={{ width: '100%', minHeight: '48px', borderRadius: '14px' }}
        >
          <span>
            {language === 'mr'
              ? 'भांडवल वाटप तपशील पाहा (Budget Allocation)'
              : language === 'hi'
              ? 'पूंजी आवंटन विवरण देखें (Budget Allocation)'
              : 'View Capital Budget Allocation'}
          </span>
        </button>

        <button
          onClick={() => onNavigate('/working-capital')}
          className="btn-secondary"
          style={{ width: '100%', minHeight: '48px', borderRadius: '14px' }}
        >
          <span>
            {language === 'mr'
              ? 'व्यवसाय चालवणारा पैसा (Working Capital)'
              : language === 'hi'
              ? 'व्यवसाय संचालन पूंजी (Working Capital)'
              : 'Operational Working Capital'}
          </span>
        </button>
      </div>

      {/* Simple Term Explanation Modal */}
      <SimpleExplanationModal
        termKey={selectedTermKey}
        onClose={() => setSelectedTermKey(null)}
      />
    </div>
  );
};
