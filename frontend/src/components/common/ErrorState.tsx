import React from 'react';
import { AlertTriangle, RefreshCw, MicOff, WifiOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ErrorStateProps {
  type?: 'GENERAL' | 'OFFLINE' | 'MIC_DENIED' | 'NOT_FOUND';
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'GENERAL',
  title,
  message,
  onRetry
}) => {
  const { t } = useLanguage();

  let icon = <AlertTriangle size={36} color="var(--danger)" />;
  let defaultTitle = 'माहिती मिळवताना अडचण आली';
  let defaultMessage = 'कृपया इंटरनेट कनेक्शन तपासा किंवा पुन्हा प्रयत्न करा.';

  if (type === 'OFFLINE') {
    icon = <WifiOff size={36} color="var(--warning)" />;
    defaultTitle = 'इंटरनेट बंद आहे';
    defaultMessage = 'तुमचा जुना डेटा फोनमध्ये सुरक्षित आहे. नवीन माहितीसाठी इंटरनेट चालू करा.';
  } else if (type === 'MIC_DENIED') {
    icon = <MicOff size={36} color="var(--danger)" />;
    defaultTitle = 'माइक परवानगी मिळालेली नाही';
    defaultMessage = 'आवाजाचा वापर करण्यासाठी फोनच्या सेटिंगमधून ब्राउझरला माइकची परवानगी द्या किंवा खाली टाइप करा.';
  }

  return (
    <div
      className="saathi-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '36px 20px',
        margin: '16px 0',
        backgroundColor: 'var(--bg-card)'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-card-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          border: '1px solid var(--border-medium)'
        }}
      >
        {icon}
      </div>

      <h3 style={{ fontSize: '1.18rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
        {title || defaultTitle}
      </h3>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '340px', marginBottom: '24px' }}>
        {message || defaultMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
          style={{ minHeight: '48px', padding: '10px 24px' }}
        >
          <RefreshCw size={18} />
          <span>{t.common.retry}</span>
        </button>
      )}
    </div>
  );
};
