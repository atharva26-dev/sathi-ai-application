import React, { useState } from 'react';
import {
  IndianRupee,
  Calendar,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  HelpCircle,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { financeService } from '../services/financeService';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';
import { SimpleExplanationModal } from '../components/common/SimpleExplanationModal';

interface LoanEducationScreenProps {
  onNavigate: (route: string) => void;
}

export const LoanEducationScreen: React.FC<LoanEducationScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { profile } = useUser();
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [selectedTermKey, setSelectedTermKey] = useState<string | null>(null);

  const loanAmount = ((profile.ownCapital || 100000) * 10) * 0.9; // 90% loan
  const analysis = financeService.calculateRepayment(loanAmount, 9.5, 5, 6);

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.emi.title}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            तुमचा कर्जाचा भार समजून घेऊया
          </p>
        </div>

        <AudioExplainButton
          id="audio_emi_summary"
          textToSpeak={analysis.simpleExplanation}
          size="sm"
        />
      </div>

      {/* Main EMI Highlight Card */}
      <div
        className="saathi-card"
        style={{
          padding: '20px',
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--primary)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            अंदाजित मासिक हप्ता (EMI):
          </span>
          <DataTrustBadge
            trustInfo={{
              level: 'CALCULATED',
              confidenceScore: 95,
              assumptions: ['९.५% वार्षिक व्याज', '५ वर्षे मुदत', '६ महिने मोरेटोरियम']
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
          <div className="num-font" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
            ₹{analysis.monthlyEMI.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.common.perMonth}</span>
        </div>

        {/* Simple Explanation Box */}
        <div
          style={{
            padding: '12px',
            backgroundColor: '#FFF7ED',
            borderRadius: '12px',
            border: '1px solid #FED7AA',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A3412' }}>
              💡 {t.emi.simpleExplanationTitle}:
            </span>
            <button
              onClick={() => setSelectedTermKey('emi')}
              className="btn-simple-explain"
            >
              <BookOpen size={12} />
              <span>EMI म्हणजे काय?</span>
            </button>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
            {analysis.simpleExplanation}
          </p>
        </div>

        {/* 4 Summary Parameters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <div style={{ padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>एकूण कर्ज रक्कम</div>
            <div className="num-font" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{analysis.loanAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>एकूण व्याज (५ वर्षे)</div>
            <div className="num-font" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              ₹{analysis.totalInterestPayable.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>सवलत काळ (Moratorium)</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--success)' }}>
              ६ महिने (केवळ व्याज)
            </div>
          </div>

          <div style={{ padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>परतफेड सुलभता</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--success)' }}>
              सहज परवडणारा (Easy)
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Full Amortization Schedule */}
      <div className="saathi-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <button
          onClick={() => setShowFullSchedule(!showFullSchedule)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 800,
            fontSize: '0.98rem',
            color: 'var(--primary-dark)',
            minHeight: '44px'
          }}
        >
          <span>{showFullSchedule ? t.emi.hideSchedule : t.emi.viewFullSchedule}</span>
          {showFullSchedule ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showFullSchedule && (
          <div className="animate-fade-in" style={{ marginTop: '14px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'right' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '2px solid var(--border-medium)' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>{t.emi.month}</th>
                  <th style={{ padding: '8px' }}>{t.emi.principal}</th>
                  <th style={{ padding: '8px' }}>{t.emi.interest}</th>
                  <th style={{ padding: '8px' }}>एकूण हप्ता</th>
                  <th style={{ padding: '8px' }}>{t.emi.balance}</th>
                </tr>
              </thead>
              <tbody>
                {analysis.schedule.slice(0, 18).map((row) => (
                  <tr key={row.month} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px', textAlign: 'left', fontWeight: 700 }}>
                      महिना {row.month} {row.month <= 6 && <span style={{ fontSize: '0.68rem', color: '#D97706' }}>(सवलत)</span>}
                    </td>
                    <td className="num-font" style={{ padding: '8px' }}>₹{row.principal.toLocaleString('en-IN')}</td>
                    <td className="num-font" style={{ padding: '8px', color: 'var(--text-muted)' }}>₹{row.interest.toLocaleString('en-IN')}</td>
                    <td className="num-font" style={{ padding: '8px', fontWeight: 700, color: 'var(--primary-dark)' }}>
                      ₹{row.totalPayment.toLocaleString('en-IN')}
                    </td>
                    <td className="num-font" style={{ padding: '8px' }}>₹{row.closingBalance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              (पहिल्या १८ महिन्यांचे वेळापत्रक दर्शविले आहे • एकूण ६० महिने)
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/working-capital')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>खेळते भांडवल (Working Capital) पाहा</span>
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onNavigate('/money-loan')}
          className="btn-secondary"
          style={{ flex: 1, minHeight: '48px', borderRadius: '14px' }}
        >
          <ArrowLeft size={16} />
          <span>मागे</span>
        </button>
      </div>

      {/* Term Modal */}
      <SimpleExplanationModal
        termKey={selectedTermKey}
        onClose={() => setSelectedTermKey(null)}
      />
    </div>
  );
};
