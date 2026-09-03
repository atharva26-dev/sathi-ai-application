import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, DollarSign, Target, Layers } from 'lucide-react';
import { WhatSellsItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface OpportunityDetailModalProps {
  item: WhatSellsItem | null;
  onClose: () => void;
  onOpenValidation: (item: WhatSellsItem) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  item,
  onClose,
  onOpenValidation
}) => {
  const { language } = useLanguage();

  if (!item) return null;

  const title = item.nameNative[language] || item.name;
  const reason = item.rankingReasonText[language] || item.rankingReasonText.en;
  const why = item.whyItMatters[language] || item.whyItMatters.en;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '16px',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '1.5px solid var(--border-medium)',
          padding: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.5rem' }}>{item.visualSignal}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#EFF6FF',
                  color: '#1D4ED8'
                }}
              >
                {item.category}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: item.confidence === 'HIGH' ? '#DCFCE7' : '#FEF3C7',
                  color: item.confidence === 'HIGH' ? '#166534' : '#92400E'
                }}
              >
                {item.confidence} CONFIDENCE
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: '#F3F4F6'
            }}
          >
            <X size={20} color="#4B5563" />
          </button>
        </div>

        {/* Opportunity Score & Observed Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
          <div style={{ padding: '12px', backgroundColor: '#FFF7ED', borderRadius: '12px', border: '1px solid #FFEDD5' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9A3412' }}>
              {language === 'mr' ? 'संधी स्कोअर' : language === 'hi' ? 'अवसर स्कोर' : 'Opportunity Score'}
            </div>
            <div className="num-font" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#EA580C', marginTop: '2px' }}>
              {item.opportunityScore}/100
            </div>
            <div style={{ fontSize: '0.72rem', color: '#C2410C', marginTop: '2px' }}>
              {language === 'mr' ? 'मागणी व कमी स्पर्धा' : language === 'hi' ? 'मांग व कम प्रतिस्पर्धा' : 'Strong demand & margin'}
            </div>
          </div>

          <div style={{ padding: '12px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>
              {language === 'mr' ? 'निरीक्षित दर (बाजारभाव)' : language === 'hi' ? 'बाजार मूल्य' : 'Observed Price'}
            </div>
            <div className="num-font" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>
              {item.observedOrEstimatedPrice}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#166534', marginTop: '2px' }}>
              {language === 'mr' ? 'स्थानिक घाऊक/किरकोळ' : language === 'hi' ? 'स्थानीय दर' : 'Local benchmark'}
            </div>
          </div>
        </div>

        {/* Why it ranks & Why it matters */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            📌 {language === 'mr' ? 'हे उत्पादन/सेवा का निवडली?' : language === 'hi' ? 'यह अवसर क्यों महत्वपूर्ण है?' : 'Why SAATHI Ranked This'}
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, backgroundColor: '#F9FAFB', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            {reason}
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            💡 {language === 'mr' ? 'तुमच्यासाठी काय फायदा?' : language === 'hi' ? 'आपके लिए व्यावसायिक लाभ:' : 'What This Means for You'}
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, backgroundColor: '#EFF6FF', padding: '10px 12px', borderRadius: '10px', border: '1px solid #DBEAFE' }}>
            {why}
          </div>
        </div>

        {/* Capital & Working Capital Advice */}
        <div style={{ marginBottom: '18px', padding: '12px', backgroundColor: '#FEF9C3', borderRadius: '12px', border: '1px solid #FEF08A' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#854D0E', marginBottom: '4px' }}>
            💰 {language === 'mr' ? 'अंदाजित भांडवल व खेळते भांडवल नियम:' : language === 'hi' ? 'पूंजी व कार्यशील पूंजी नियम:' : 'Capital & Cash Flow Rule:'}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#713F12', lineHeight: 1.45 }}>
            • {language === 'mr' ? `अंदाजित सुरुवातीचा खर्च: ₹${item.capitalRequiredEstimate.toLocaleString('en-IN')}` : language === 'hi' ? `अनुमानित खर्च: ₹${item.capitalRequiredEstimate.toLocaleString('en-IN')}` : `Estimated startup cost: ₹${item.capitalRequiredEstimate.toLocaleString('en-IN')}`}.
            <br />
            • {language === 'mr' ? 'भांडवलातील किमान ३०-४०% रक्कम दैनंदिन माल खरेदी व खर्चासाठी रोख ठेवा. अनियंत्रित उधारी देऊ नका.' : language === 'hi' ? '३०-४०% पूंजी नकद बैकअप रखें। अत्यधिक उधारी न दें।' : 'Keep 30-40% as liquid cash buffer for receivables. Cap credit below 10%.'}
          </div>
        </div>

        {/* 5-Step Field Mission */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            🎯 {language === 'mr' ? 'पैसे गुंतवण्यापूर्वी ५ गोष्टी तपासा:' : language === 'hi' ? 'पैसे लगाने से पहले ५ बातें जांचें:' : 'Check These 5 Things Before Investing:'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              language === 'mr' ? '१. परिसरातील १० संभाव्य ग्राहकांशी प्रत्यक्ष बोला.' : language === 'hi' ? '१. १० संभावित ग्राहकों से मिलकर बात करें।' : '1. Interview 10 potential local customers.',
              language === 'mr' ? '२. ३ चालू दुकानांचे प्रत्यक्ष दर तपासा.' : language === 'hi' ? '२. ३ मौजूदा दुकानों के वास्तविक भाव जांचें।' : '2. Check actual prices at 3 local shops.',
              language === 'mr' ? '३. घाऊक बाजारातून कच्च्या मालाचे जीएसटी कोटेशन घ्या.' : language === 'hi' ? '३. थोक बाजार से सामग्री का पक्का भाव लें।' : '3. Get wholesale supplier GST price quotes.',
              language === 'mr' ? '४. खेळत्या भांडवलासाठी ३०-४०% रोख रक्कम बाजूला ठेवा.' : language === 'hi' ? '४. कार्यशील पूंजी के लिए नकद अलग रखें।' : '4. Reserve 30-40% cash as working capital buffer.',
              language === 'mr' ? '५. सुरुवातीला लहान बॅचवर विक्री करून नफा तपासा.' : language === 'hi' ? '५. छोटे स्तर पर पायलट बनाकर नकद बिक्री जांचें।' : '5. Run a micro pilot trial before borrowing.'
            ].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              onClose();
              onOpenValidation(item);
            }}
            className="saathi-btn-primary"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              fontSize: '0.92rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📝 {language === 'mr' ? 'स्थानिक खात्री नोंदवा' : language === 'hi' ? 'स्थानीय रिपोर्ट दर्ज करें' : 'Log Field Findings'}</span>
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1.5px solid var(--border-medium)',
              backgroundColor: '#F3F4F6',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            {language === 'mr' ? 'बंद करा' : language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
