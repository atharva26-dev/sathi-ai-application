import React from 'react';
import { ArrowLeft, Globe, Eye, Wifi, WifiOff, Sparkles, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useOffline } from '../../context/OfflineContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useUser } from '../../context/UserContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenLanguageModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  onOpenLanguageModal
}) => {
  const { t, language } = useLanguage();
  const { isOnline, isSyncing } = useOffline();
  const { fontScale, setFontScale, highContrast, setHighContrast } = useAccessibility();
  const { profile } = useUser();

  const toggleFontScale = () => {
    if (fontScale === 'normal') setFontScale('large');
    else if (fontScale === 'large') setFontScale('xlarge');
    else setFontScale('normal');
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          minHeight: 'var(--header-height)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          {showBack && (
            <button
              onClick={onBack}
              aria-label="मागे जा"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1.5px solid rgba(13, 148, 136, 0.25)',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
              overflow: 'hidden',
              padding: '2px'
            }}
          >
            <img
              src="/vyapar-saathi-logo.png"
              alt="Vyapar Saathi Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <h1
              style={{
                fontSize: title ? '1.1rem' : '1.25rem',
                fontWeight: 800,
                color: 'var(--primary-dark)',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title || 'Vyapar Saathi व्यापार साथी'}
            </h1>
            <p
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 600
              }}
            >
              {subtitle || (profile.name ? `${profile.name} • ${profile.village || 'बारामती'}` : 'Aapka Business, Hamara Saath')}
            </p>
          </div>
        </div>

        {/* Quick Accessibility & Language Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Font Scaler Pill */}
          <button
            onClick={toggleFontScale}
            aria-label="अक्षरांचा आकार बदला"
            title={`Font Size: ${fontScale.toUpperCase()}`}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-medium)',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--text-secondary)',
              minHeight: '38px'
            }}
          >
            A{fontScale === 'large' ? '+' : fontScale === 'xlarge' ? '++' : ''}
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            aria-label="हाय कॉन्ट्रास्ट मोड"
            title="High Contrast Mode"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: highContrast ? '#000000' : 'var(--bg-card-subtle)',
              color: highContrast ? '#FFFFFF' : 'var(--text-secondary)',
              border: '1px solid var(--border-medium)'
            }}
          >
            <Eye size={16} />
          </button>

          {/* Language Switcher Button */}
          {onOpenLanguageModal && (
            <button
              onClick={onOpenLanguageModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-subtle)',
                border: '1px solid var(--primary-light)',
                color: 'var(--primary-dark)',
                fontSize: '0.82rem',
                fontWeight: 700,
                minHeight: '38px'
              }}
            >
              <Globe size={14} />
              <span>{language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'Eng'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
