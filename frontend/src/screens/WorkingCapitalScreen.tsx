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
  const { t, language } = useLanguage();
  const [selectedTermKey, setSelectedTermKey] = useState<string | null>(null);

  const wc = financeService.calculateWorkingCapital(25, 180, 25000);

  const voiceText =
    language === 'mr'
      ? `खेळते भांडवल म्हणजे रोजचे दूध खरेदी आणि मजुरीसाठी लागणारा पैसा. रोज २५ किलो पनीरसाठी १५ दिवसांचा दूध खरेदी साठा म्हणून किमान ₹६७,५०० आणि इतर खर्चांसाठी एकूण १ लाखाहून अधिक खेळते भांडवल सोबत ठेवणे आवश्यक आहे.`
      : language === 'hi'
      ? `कार्यशील पूंजी (वर्किंग कैपिटल) का अर्थ है दैनिक कच्चा माल खरीदने और मजदूरी के लिए आवश्यक नकदी। दैनिक 25 किलो पनीर के लिए 15 दिनों के दूध खरीद बफर के रूप में कम से कम ₹67,500 और अन्य खर्चों सहित कुल 1 लाख से अधिक की कार्यशील पूंजी रखना आवश्यक है।`
      : `Working capital is the operational cash needed for daily raw materials and labor. For 25 kg daily paneer, keeping a 15-day milk procurement buffer of ₹67,500 and over ₹1,00,000 in total reserve is essential.`;

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
            {language === 'mr'
              ? '💡 खेळते भांडवल का महत्त्वाचे आहे?'
              : language === 'hi'
              ? '💡 कार्यशील पूंजी क्यों महत्वपूर्ण है?'
              : '💡 Why is Working Capital Crucial?'}
          </div>
          <button
            onClick={() => setSelectedTermKey('working_capital')}
            className="btn-simple-explain"
          >
            <BookOpen size={12} />
            <span>
              {language === 'mr' ? 'सोप्या भाषेत पाहा' : language === 'hi' ? 'सरल भाषा में समझें' : 'Explain Simply'}
            </span>
          </button>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
          {language === 'mr'
            ? 'शेतकऱ्यांकडून दूध रोख पैशात घ्यावे लागेल, पण हॉटेल्सचे बिल आठवड्याला किंवा १५ दिवसांनी येईल. या दरम्यान पैशांची अडचण येऊ नये म्हणून हा राखीव निधी असतो.'
            : language === 'hi'
            ? 'किसानों से कच्चा दूध नकद में खरीदना होगा, लेकिन होटलों से भुगतान साप्ताहिक या 15 दिनों में आएगा। इस दौरान नकदी की कमी न हो, इसलिए यह सुरक्षा रिजर्व जरूरी है।'
            : 'You must pay farmers cash for milk daily, while hotels pay bills weekly or fortnightly. Working capital bridges this cash-flow gap.'}
        </p>
      </div>

      {/* Component Breakdown List */}
      <div className="saathi-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
          {language === 'mr'
            ? 'खेळत्या भांडवलाची विभागणी:'
            : language === 'hi'
            ? 'कार्यशील पूंजी का विभाजन:'
            : 'Working Capital Breakdown:'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                {language === 'mr' ? '१५ दिवसांचा दूध खरेदी बफर' : language === 'hi' ? '15 दिनों का दूध खरीद बफर' : '15-Day Milk Purchase Buffer'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {language === 'mr' ? '२५ kg x ५L x ₹३६ x १५ दिवस' : language === 'hi' ? '25 kg x 5L x ₹36 x 15 दिन' : '25 kg x 5L x ₹36 x 15 days'}
              </div>
            </div>
            <div className="num-font" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-dark)' }}>
              ₹{wc.rawMaterialsBufferCost.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                {language === 'mr' ? '१ महिन्याची मजुरी व मदतनीस' : language === 'hi' ? '1 माह का वेतन व सहायक खर्च' : '1 Month Helper & Labor Wage'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {language === 'mr' ? 'कामगाराचा मासिक पगार' : language === 'hi' ? 'सहायक का मासिक वेतन' : 'Monthly helper salary'}
              </div>
            </div>
            <div className="num-font" style={{ fontWeight: 800, fontSize: '1.05rem' }}>
              ₹{wc.monthlySalaries.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                {language === 'mr' ? 'वाहतूक, वीज व पॅकिंग साहित्य' : language === 'hi' ? 'परिवहन, बिजली व पैकेजिंग सामग्री' : 'Logistics, Power & Packaging'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {language === 'mr' ? 'इंधन व पॅकिंग पिशव्या' : language === 'hi' ? 'ईंधन और पैकिंग थैली' : 'Fuel & packaging pouches'}
              </div>
            </div>
            <div className="num-font" style={{ fontWeight: 800, fontSize: '1.05rem' }}>
              ₹{wc.utilitiesAndLogistics.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-app)', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                {language === 'mr' ? 'आपत्कालीन राखीव बफर' : language === 'hi' ? 'आपातकालीन सुरक्षा बफर' : 'Emergency Contingency Buffer'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {language === 'mr' ? 'उधारी विलंबासाठी सुरक्षा' : language === 'hi' ? 'उधारी देरी के खिलाफ सुरक्षा' : 'Safety against payment delays'}
              </div>
            </div>
            <div className="num-font" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--success)' }}>
              ₹{wc.emergencyBuffer.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '2px solid var(--border-medium)' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>
            {language === 'mr' ? 'एकूण आवश्यक खेळते भांडवल:' : language === 'hi' ? 'कुल आवश्यक कार्यशील पूंजी:' : 'Total Required Working Capital:'}
          </span>
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
          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#166534' }}>
            {language === 'mr' ? 'साथीचा मोलाचा सल्ला:' : language === 'hi' ? 'साथी की महत्वपूर्ण सलाह:' : "Saathi's Key Advisory:"}
          </span>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#14532D', lineHeight: 1.45 }}>
          {language === 'hi'
            ? 'होटलों को अधिकतम 7 दिनों की उधारी सीमा निर्धारित करें। नया कच्चा माल खरीदने से पहले पिछला बकाया भुगतान प्राप्त करना सुनिश्चित करें।'
            : language === 'en'
            ? 'Set a strict 7-day credit limit for hotel clients. Always recover pending dues before supplying new batches.'
            : wc.recommendation}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onNavigate('/marketing')}
          className="btn-primary"
          style={{ flex: 2, minHeight: '48px', borderRadius: '14px' }}
        >
          <span>
            {language === 'mr' ? '📣 पहिले ग्राहक कसे मिळवायचे?' : language === 'hi' ? '📣 पहले ग्राहक कैसे प्राप्त करें?' : '📣 How to Get First Customers?'}
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

      {/* Term Explainer Modal */}
      <SimpleExplanationModal
        termKey={selectedTermKey}
        onClose={() => setSelectedTermKey(null)}
      />
    </div>
  );
};
