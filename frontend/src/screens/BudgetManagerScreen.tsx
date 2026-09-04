import React from 'react';
import { PieChart, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { financeService } from '../services/financeService';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface BudgetManagerScreenProps {
  onNavigate: (route: string) => void;
}

export const BudgetManagerScreen: React.FC<BudgetManagerScreenProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { profile } = useUser();
  const projectCost = (profile.ownCapital || 100000) * 10;
  const categories = financeService.getBudgetAllocation(projectCost);

  const voiceText =
    language === 'mr'
      ? `तुमच्या एकूण भांडवलाचे वाटप: मशिनरीसाठी ४०%, शेडसाठी २०%, कच्च्या मालाच्या खेळत्या भांडवलासाठी २५% आणि आपत्कालीन राखीव १५% ठेवणे सर्वात सुरक्षित राहील.`
      : language === 'hi'
      ? `आपकी कुल पूंजी का आवंटन: मशीनरी के लिए 40%, शेड/दुकान के लिए 20%, कार्यशील पूंजी के लिए 25% और आपातकालीन बफर के लिए 15% रखना सबसे सुरक्षित रहेगा।`
      : `Recommended capital allocation: 40% for machinery/equipment, 20% for premises, 25% for operational working capital, and 15% as emergency contingency.`;

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {language === 'mr' ? 'भांडवल वाटप नियोजन (Budget)' : language === 'hi' ? 'पूंजी आवंटन योजना (Budget)' : 'Capital Budget Allocation'}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {language === 'mr'
              ? `एकूण ₹${projectCost.toLocaleString('en-IN')} प्रकल्प खर्चाचे सुरक्षित वाटप`
              : language === 'hi'
              ? `कुल ₹${projectCost.toLocaleString('en-IN')} परियोजना लागत का सुरक्षित आवंटन`
              : `Safe allocation of total ₹${projectCost.toLocaleString('en-IN')} project capital`}
          </p>
        </div>

        <AudioExplainButton
          id="audio_budget_summary"
          textToSpeak={voiceText}
          size="sm"
        />
      </div>

      {/* Allocation List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        {categories.map((cat, idx) => {
          let barColor = '#C2410C';
          if (idx === 1) barColor = '#D97706';
          if (idx === 2) barColor = '#059669';
          if (idx === 3) barColor = '#2563EB';
          if (idx === 4) barColor = '#7C3AED';

          return (
            <div
              key={cat.id}
              className="saathi-card"
              style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                  {cat.name}
                </div>
                <div className="num-font" style={{ fontWeight: 800, fontSize: '1.1rem', color: barColor }}>
                  ₹{cat.amount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Progress visual bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden', margin: '8px 0' }}>
                <div
                  style={{
                    width: `${cat.percentage}%`,
                    height: '100%',
                    backgroundColor: barColor,
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>{cat.description}</span>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                  {language === 'mr' ? `${cat.percentage}% वाटा` : language === 'hi' ? `${cat.percentage}% हिस्सा` : `${cat.percentage}% share`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/schemes')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>
            {language === 'mr' ? '🏦 सरकारी योजना व सबसिडी पाहा' : language === 'hi' ? '🏦 सरकारी योजनाएं व सब्सिडी देखें' : '🏦 View Schemes & Subsidies'}
          </span>
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onNavigate('/money-loan')}
          className="btn-secondary"
          style={{ flex: 1, minHeight: '48px', borderRadius: '14px' }}
        >
          <ArrowLeft size={16} />
          <span>{t.common.back}</span>
        </button>
      </div>
    </div>
  );
};
