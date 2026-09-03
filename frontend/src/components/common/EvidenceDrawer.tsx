import React from 'react';
import { X, CheckCircle, HelpCircle, FileText, Info } from 'lucide-react';
import { DataTrustInfo } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trustInfo: DataTrustInfo;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  trustInfo
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          width: '100%',
          maxWidth: '540px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-floating)',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Info size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>{t.common.evidence}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                डेटाची पारदर्शकता आणि विश्वासाचे निकष
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Level Banner */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor:
              trustInfo.level === 'VERIFIED'
                ? '#DCFCE7'
                : trustInfo.level === 'CALCULATED'
                ? '#F3E8FF'
                : trustInfo.level === 'USER_INPUT'
                ? '#DBEAFE'
                : '#FEF3C7',
            marginBottom: '20px',
            border: '1px solid var(--border-light)'
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>
            प्रकार:{' '}
            {trustInfo.level === 'VERIFIED'
              ? '✓ पडताळलेला प्रत्यक्ष डेटा'
              : trustInfo.level === 'CALCULATED'
              ? '🧮 निश्चित सूत्रानुसार काढलेले गणित'
              : trustInfo.level === 'USER_INPUT'
              ? '👤 तुमच्याकडून मिळालेली माहिती'
              : '🤖 स्थानिक घटकांवर आधारित AI अंदाज'}
          </div>
          {trustInfo.confidenceScore && (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              विश्वासार्हता स्कोअर: <strong>{trustInfo.confidenceScore}%</strong>
            </div>
          )}
        </div>

        {/* Evidence List */}
        {trustInfo.evidence && trustInfo.evidence.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '8px' }}>
              <CheckCircle size={16} color="var(--success)" />
              <span>सत्य पडताळणी पुरावे:</span>
            </div>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {trustInfo.evidence.map((ev, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  {ev}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Assumptions List */}
        {trustInfo.assumptions && trustInfo.assumptions.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '8px' }}>
              <HelpCircle size={16} color="var(--warning)" />
              <span>गृहीत धरलेल्या बाबी (Assumptions):</span>
            </div>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {trustInfo.assumptions.map((as, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  {as}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Source Text */}
        {trustInfo.sourceText && (
          <div style={{ marginBottom: '18px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>स्रोत:</strong> {trustInfo.sourceText}
          </div>
        )}

        <div
          style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-card-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4
          }}
        >
          💡 <strong>मार्गदर्शन:</strong> हा अंदाज निर्णय घेताना मदत करण्यासाठी आहे. व्यवसाय सुरू करण्यापूर्वी प्रत्यक्ष बाजारात जाऊन स्वतः खात्री करून घेणे नेहमी सुरक्षित असते.
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', marginTop: '20px', minHeight: '48px' }}
        >
          समजले, धन्यवाद
        </button>
      </div>
    </div>
  );
};
