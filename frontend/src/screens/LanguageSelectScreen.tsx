import React from 'react';
import { Globe, CheckCircle, Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { LanguageCode } from '../types';
import { MASTER_LANGUAGES, getLanguageDefinition } from '../config/languages';

interface LanguageSelectScreenProps {
  onLanguageConfirmed: () => void;
}

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  onLanguageConfirmed
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { speak } = useVoice();
  const languagesList = MASTER_LANGUAGES;

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    const def = getLanguageDefinition(code);
    if (def.pronunciationSample) {
      speak(def.pronunciationSample, def.speechRecognitionLocale);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        backgroundColor: 'var(--bg-app)',
        maxWidth: '680px',
        margin: '0 auto'
      }}
    >
      {/* Top Header Logo & Multilingual Title */}
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginTop: '8px'
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '26px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.1)',
              border: '2.5px solid rgba(13, 148, 136, 0.3)',
              marginBottom: '14px',
              padding: '8px',
              overflow: 'hidden'
            }}
          >
            <img
              src="/vyapar-saathi-logo.png"
              alt="Vyapar Saathi Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h1
            style={{
              fontSize: '1.9rem',
              color: 'var(--primary-dark)',
              fontWeight: 900,
              marginBottom: '4px',
              letterSpacing: '-0.02em'
            }}
          >
            Vyapar Saathi (व्यापार साथी)
          </h1>
          <p style={{ fontSize: '0.94rem', color: '#0D9488', fontWeight: 700 }}>
            Aapka Business, Hamara Saath
          </p>
        </div>

        {/* Big Touch-Friendly Rural Header */}
        <div
          style={{
            marginTop: '20px',
            marginBottom: '16px',
            padding: '14px 18px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid var(--border-medium)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={24} color="var(--primary)" />
            <div>
              <h2 style={{ fontSize: '1.22rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                {language === 'mr' ? 'तुमची भाषा निवडा' : language === 'hi' ? 'अपनी भाषा चुनें' : 'Choose Your Language'}
              </h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                मराठी • हिन्दी • English
              </span>
            </div>
          </div>
        </div>

        {/* Large Touch Cards Grid for Rural Accessibility */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '10px',
            maxHeight: '48vh',
            overflowY: 'auto',
            paddingRight: '4px'
          }}
        >
          {languagesList.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  backgroundColor: isSelected ? 'rgba(194, 65, 12, 0.08)' : '#FFFFFF',
                  border: isSelected ? '2.5px solid var(--primary)' : '1.5px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isSelected ? '0 4px 12px rgba(194, 65, 12, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                  textAlign: lang.direction === 'rtl' ? 'right' : 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  minHeight: '62px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'var(--primary)' : '#F1F5F9',
                      color: isSelected ? '#FFFFFF' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}
                  >
                    {lang.nativeName.charAt(0)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        color: isSelected ? 'var(--primary-dark)' : 'var(--text-primary)',
                        lineHeight: 1.2
                      }}
                    >
                      {lang.nativeName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                      {lang.name} • <span style={{ color: isSelected ? 'var(--primary)' : '#64748B' }}>{lang.region}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Volume2 size={16} color={isSelected ? 'var(--primary)' : '#94A3B8'} />
                  {isSelected && (
                    <CheckCircle size={22} color="var(--primary)" fill="rgba(194, 65, 12, 0.15)" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Large Touch Proceed CTA */}
      <div style={{ marginTop: '16px' }}>
        <button
          onClick={onLanguageConfirmed}
          className="btn-primary"
          style={{
            width: '100%',
            minHeight: '54px',
            fontSize: '1.15rem',
            fontWeight: 800,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer'
          }}
        >
          <span>{t.common.proceed || 'Proceed'}</span>
          <span style={{ fontSize: '1.3rem' }}>➔</span>
        </button>
      </div>
    </div>
  );
};
