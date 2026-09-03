import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Save, Star } from 'lucide-react';
import { WhatSellsItem, LocalValidationLog } from '../../types';
import { marketService } from '../../services/marketService';
import { useLanguage } from '../../context/LanguageContext';

interface LocalValidationModalProps {
  item: WhatSellsItem | null;
  location: string;
  onClose: () => void;
  onSaved: (savedLog: LocalValidationLog) => void;
}

export const LocalValidationModal: React.FC<LocalValidationModalProps> = ({
  item,
  location,
  onClose,
  onSaved
}) => {
  const { language } = useLanguage();

  const [foundLocally, setFoundLocally] = useState<boolean>(true);
  const [observedPrice, setObservedPrice] = useState<string>('');
  const [competitorsSeenCount, setCompetitorsSeenCount] = useState<number>(2);
  const [customerInterest, setCustomerInterest] = useState<'HIGH' | 'MEDIUM' | 'NONE'>('HIGH');
  const [madeTrialSale, setMadeTrialSale] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!item) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = marketService.saveValidationLog({
      businessCategory: item.category,
      location,
      foundLocally,
      observedPrice: observedPrice || item.observedOrEstimatedPrice,
      competitorsSeenCount,
      customerInterest,
      madeTrialSale,
      notes
    });

    setIsSaved(true);
    setTimeout(() => {
      onSaved(newLog);
      onClose();
    }, 1200);
  };

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
        zIndex: 1150,
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
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '1.5px solid var(--border-medium)',
          padding: '22px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
              📝 {language === 'mr' ? 'स्थानिक बाजार खात्री मोहीम' : language === 'hi' ? 'स्थानीय बाजार सत्यापन' : 'Local Field Validation'}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {item.nameNative[language] || item.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {location}
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

        {isSaved ? (
          <div style={{ padding: '30px', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#16A34A" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {language === 'mr' ? 'माहिती यशस्वीपणे जतन केली!' : language === 'hi' ? 'रिपोर्ट सफलतापूर्वक दर्ज हुई!' : 'Field Report Recorded!'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {language === 'mr' ? 'ही माहिती तुमच्या स्थानिक बाजार अहवालात जोडली गेली आहे.' : 'Saved to your proprietary local market database.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Question 1: Found locally? */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                १. हे उत्पादन/सेवा तुमच्या गावात किंवा जवळ उपलब्ध आहे का?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFoundLocally(true)}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: foundLocally ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: foundLocally ? '#FFF7ED' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  होय, उपलब्ध आहे ✓
                </button>
                <button
                  type="button"
                  onClick={() => setFoundLocally(false)}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: !foundLocally ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: !foundLocally ? '#FFF7ED' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  नाही, गावात मिळत नाही ✗
                </button>
              </div>
            </div>

            {/* Question 2: Observed Price */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                २. प्रत्यक्ष बाजारात चालू दर काय आढळला?
              </label>
              <input
                type="text"
                placeholder={item.observedOrEstimatedPrice}
                value={observedPrice}
                onChange={(e) => setObservedPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-medium)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Question 3: Active competitors seen count */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                ३. गावात किंवा आठवडी बाजारात किती सक्रिय स्पर्धक दिसले?
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2, 3, 5, 8].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setCompetitorsSeenCount(cnt)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      borderRadius: '8px',
                      border: competitorsSeenCount === cnt ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                      backgroundColor: competitorsSeenCount === cnt ? '#FFF7ED' : '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    {cnt === 8 ? '8+' : cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Customer Interest */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                ४. संभाव्य ग्राहकांशी बोलल्यावर त्यांचा प्रतिसाद कसा वाटला?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {(['HIGH', 'MEDIUM', 'NONE'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCustomerInterest(lvl)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: customerInterest === lvl ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                      backgroundColor: customerInterest === lvl ? '#FFF7ED' : '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {lvl === 'HIGH' ? '🔥 खूप चांगला' : lvl === 'MEDIUM' ? '🟡 मध्यम' : '⚪ कमी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 5: Trial sale? */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                ५. तुम्ही प्रायोगिक तत्त्वावर विक्री किंवा सेवा दिली का?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setMadeTrialSale(true)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: madeTrialSale ? '2px solid #16A34A' : '1px solid var(--border-medium)',
                    backgroundColor: madeTrialSale ? '#F0FDF4' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  होय, चाचणी झाली ✓
                </button>
                <button
                  type="button"
                  onClick={() => setMadeTrialSale(false)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: !madeTrialSale ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                    backgroundColor: !madeTrialSale ? '#FFF7ED' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  नाही, अजून नाही ✗
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="saathi-btn-primary"
              style={{
                width: '100%',
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
              <Save size={18} />
              <span>स्थानिक खात्री नोंद जतन करा</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
