import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, Layers } from 'lucide-react';
import { DeepMarketAnalysis, LocalMarketIntelligence } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface DeepMarketPlanModalProps {
  intelligence: LocalMarketIntelligence;
  onClose: () => void;
}

export const DeepMarketPlanModal: React.FC<DeepMarketPlanModalProps> = ({
  intelligence,
  onClose
}) => {
  const { language } = useLanguage();
  const d = intelligence.deepAnalysis;
  const loc = `${intelligence.location.village}, ${intelligence.location.taluka}`;

  const questions = [
    { num: 1, q: '१. सध्या बाजारात काय वेगाने विकले जात आहे? (What is selling?)', a: d.whatIsSelling, icon: '🔥' },
    { num: 2, q: '२. हे उत्पादन का विकले जात आहे? (Why is it selling?)', a: d.whyIsItSelling, icon: '📈' },
    { num: 3, q: '३. हे कोण खरेदी करत आहे? (Who is buying?)', a: d.whoIsBuying, icon: '👥' },
    { num: 4, q: '४. खरेदी नेमकी कुठे होत आहे? (Where are they buying?)', a: d.whereAreTheyBuying, icon: '📍' },
    { num: 5, q: '५. सध्या ग्राहकांना कोण सेवा देत आहे? (Who is serving them?)', a: d.whoIsCurrentlyServingThem, icon: '🏪' },
    { num: 6, q: '६. ग्राहक नेमके काय दर देत आहेत? (What are they paying?)', a: d.whatAreTheyPaying, icon: '🏷️' },
    { num: 7, q: '७. सध्याच्या बाजारपेठेत काय उणीव आहे? (What is missing?)', a: d.whatIsMissing, icon: '🎯' },
    { num: 8, q: '८. स्थानिक पातळीवर काय पिकवता/तयार करता येईल? (What can be produced?)', a: d.whatCanBeProducedLocally, icon: '🌱' },
    { num: 9, q: '९. स्थानिक पातळीवर कशावर प्रक्रिया करता येईल? (What can be processed?)', a: d.whatCanBeProcessedLocally, icon: '⚙️' },
    { num: 10, q: '१०. जवळच्या शहरांमध्ये काय विकता येईल? (What can be sold to nearby towns?)', a: d.whatCanBeSoldToNearbyTowns, icon: '🚚' },
    { num: 11, q: '११. या पोकळीत कोणता व्यवसाय चालू शकतो? (What business serves this?)', a: d.whatBusinessCouldServeThisGap, icon: '💡' },
    { num: 12, q: '१२. यासाठी किती भांडवल आवश्यक आहे? (What capital is required?)', a: d.whatCapitalIsRequired, icon: '💰' },
    { num: 13, q: '१३. यामध्ये काय अंगलट येऊ शकते? (What could go wrong?)', a: d.whatCouldGoWrong, icon: '⚠️' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1120,
        padding: '16px',
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
          border: '1.5px solid var(--border-medium)',
          padding: '24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.4rem' }}>🌟</span>
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
                {language === 'mr' ? 'खोलवर बाजार सल्ला' : language === 'hi' ? 'गहन बाजार विश्लेषण' : 'DEEP MARKET PLAN'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {language === 'mr' ? 'तुमचा स्थानिक बाजारपेठ आराखडा' : language === 'hi' ? 'स्थानीय बाजार योजना' : 'Local Market Intelligence Master Plan'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {intelligence.userBusinessCategory} • {loc} • {intelligence.location.district}
            </p>
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

        {/* Notice Banner */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#FFF7ED',
            borderRadius: '14px',
            border: '1px solid #FFEDD5',
            marginBottom: '18px',
            fontSize: '0.82rem',
            color: '#9A3412',
            lineHeight: 1.45
          }}
        >
          💡 <strong>{language === 'mr' ? 'मार्गदर्शन उद्दिष्ट:' : 'Advisory Note:'}</strong>{' '}
          {language === 'mr'
            ? 'हा अहवाल सरकारी APMC मंडी, उद्यम नोंदणी व स्थानिक पीक आकडेवारीवर आधारित आहे. कोणताही मोठा खर्च करण्यापूर्वी खालील १३ मुद्द्यांनुसार स्थानिक खात्री करा.'
            : 'Ground evidence from official APMC & Udyam databases. Validate these 13 points locally before borrowing.'}
        </div>

        {/* 13 Structured Questions & Answers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
          {questions.map((item) => (
            <div
              key={item.num}
              style={{
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {item.q}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: '26px' }}>
                {item.a}
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="saathi-btn-primary"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '0.92rem',
            fontWeight: 800
          }}
        >
          {language === 'mr' ? 'समजले, धन्यवाद!' : language === 'hi' ? 'समझ गया, धन्यवाद!' : 'Understood, Thank you!'}
        </button>
      </div>
    </div>
  );
};
