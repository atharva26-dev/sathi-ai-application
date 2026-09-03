import React, { useState } from 'react';
import {
  Wallet,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BookOpen,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { financeService } from '../services/financeService';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';
import { SimpleExplanationModal } from '../components/common/SimpleExplanationModal';

interface WorkingCapitalScreenProps {
  onNavigate: (route: string) => void;
}

export const WorkingCapitalScreen: React.FC<WorkingCapitalScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [selectedTermKey, setSelectedTermKey] = useState<string | null>(null);

  const wc = financeService.calculateWorkingCapital(25, 180, 25000);

  const voiceText = `खेळते भांडवल म्हणजे रोजचे दूध खरेदी आणि मजुरीसाठी लागणारा पैसा. रोज २५ किलो पनीरसाठी १५ दिवसांचा दूध खरेदी साठा म्हणून किमान ₹६७,५०० आणि इतर खर्चांसाठी एकूण १ लाखाहून अधिक खेळते भांडवल सोबत ठेवणे आवश्यक आहे.`;

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.finance.workingCapitalTitle}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {t.finance.workingCapitalSub}
          </p>
        </div>

        <AudioExplainButton
          id="audio_wc_summary"
          textToSpeak={voiceText}
          size="sm"
        />
      </div>

      {/* Explainer Box */}
      <div
        className="saathi-card"
        style={{
          padding: '16px',
          backgroundColor: '#FFF7ED',
          border: '1.5px solid #FED7AA',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#9A3412' }}>
            💡 खेळते भांडवल का महत्त्वाचे आहे?
          </div>
          <button
            onClick={() => setSelectedTermKey('working_capital')}
            className="btn-simple-explain"
          >
            <BookOpen size={12} />
            <span>सोप्या भाषेत पाहा</span>
          </button>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
          शेतकऱ्यांकडून दूध रोख पैशात घ्यावे लागेल, पण हॉटेल्सचे बिल आठवड्याला किंवा १५ दिवसांनी येईल. या दरम्यान पैशांची अडचण येऊ नये म्हणून हा राखीव निधी असतो.
        </p>
      </div>

      {/* Component Breakdown List */}
      <div className="saathi-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
          खेळत्या भांडवलाची विभागणी:
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>१५ दिवसांचा दूध खरेदी बफर</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>२५ kg x ५L x ₹३६ x १५ दिवस</div>
            </div>
            <div className="num-font" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-dark)' }}>
              ₹{wc.rawMaterialsBufferCost.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>१ महिन्याची मजुरी व मदतनीस</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>कामगाराचा मासिक पगार</div>
            </div>
            <div className="num-font" style={{ fontWeight: 800, fontSize: '1.05rem' }}>
              ₹{wc.monthlySalaries.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>वाहतूक, वीज व पॅकिंग साहित्य</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>इंधन व पॅकिंग पिशव्या</div>
            </div>
            <div className="num-font" style={{ fontWeight: 800, fontSize: '1.05rem' }}>
              ₹{wc.utilitiesAndLogistics.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>आपत्कालीन राखीव बफर</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>उधारी विलंबासाठी सुरक्षा</div>
            </div>
            <div className="num-font" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--success)' }}>
              ₹{wc.emergencyBuffer.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '2px solid var(--border-medium)' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>एकूण आवश्यक खेळते भांडवल:</span>
          <span className="num-font" style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary-dark)' }}>
            ₹{wc.totalRequiredWorkingCapital.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Practical Advice Banner */}
      <div
        className="saathi-card"
        style={{
          padding: '16px',
          backgroundColor: '#F0FDF4',
          border: '1.5px solid #86EFAC',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <CheckCircle size={18} color="#059669" />
          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#166534' }}>साथीचा मोलाचा सल्ला:</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#14532D', lineHeight: 1.45 }}>
          {wc.recommendation}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/marketing')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>📣 पहिले ग्राहक कसे मिळवायचे?</span>
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

      {/* Term Explainer Modal */}
      <SimpleExplanationModal
        termKey={selectedTermKey}
        onClose={() => setSelectedTermKey(null)}
      />
    </div>
  );
};
