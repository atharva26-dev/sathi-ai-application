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
      {/* Branded Logo Container with Spinner Ring */}
      <div
        style={{
          width: '88px',
          height: '88px',
          borderRadius: '24px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.1)',
          border: '2px solid rgba(13, 148, 136, 0.3)',
          padding: '6px'
        }}
      >
        <img
          src="/vyapar-saathi-logo.png"
          alt="Vyapar Saathi Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {/* Subtle spinning loader overlay ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '28px',
            border: '2.5px solid transparent',
            borderTopColor: '#0D9488',
            borderRightColor: '#1E3A8A',
            animation: 'spin 1.2s linear infinite'
          }}
        />
      </div>

      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '4px' }}>
        Vyapar Saathi व्यापार साथी
      </div>

      <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px', minHeight: '32px', fontWeight: 700 }}>
        {customMessage || CONTEXTUAL_MESSAGES[msgIndex]}
      </h3>

      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '340px' }}>
        Aapka Business, Hamara Saath • अचूक स्थानिक आकडेमोड सुरू आहे...
      </p>
    </div>
  );
};
