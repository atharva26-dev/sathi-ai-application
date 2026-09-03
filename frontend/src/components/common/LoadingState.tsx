import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  customMessage?: string;
}

const CONTEXTUAL_MESSAGES = [
  'तुमच्या भागातील स्थानिक बाजार समजून घेत आहे...',
  'व्यवसायातील संधी आणि स्थानिक मागणी तपासत आहे...',
  'तुमच्या बजेट आणि भांडवलाचा विचार करत आहे...',
  'स्थानिक स्पर्धा आणि संभाव्य जोखीम तपासत आहे...',
  'तुमचा सविस्तर व्यवसाय आराखडा तयार करत आहे...'
];

export const LoadingState: React.FC<LoadingStateProps> = ({ customMessage }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % CONTEXTUAL_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '18px',
          position: 'relative'
        }}
      >
        <Loader2 size={32} color="var(--primary)" className="animate-spin" />
      </div>

      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px', minHeight: '32px' }}>
        {customMessage || CONTEXTUAL_MESSAGES[msgIndex]}
      </h3>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '320px' }}>
        कृपया थोडा वेळ थांबा, साथी तुमच्यासाठी अचूक स्थानिक आकडेमोड करत आहे.
      </p>
    </div>
  );
};
