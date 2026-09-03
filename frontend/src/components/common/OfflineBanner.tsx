import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isSyncing, queuedActionsCount, triggerManualSync } = useOffline();
  const { t } = useLanguage();

  if (isOnline && queuedActionsCount === 0 && !isSyncing) {
    return null; // hide banner when healthy online
  }

  return (
    <div
      style={{
        backgroundColor: !isOnline ? '#FEF3C7' : isSyncing ? '#DBEAFE' : '#DCFCE7',
        borderBottom: `1px solid ${!isOnline ? '#FCD34D' : isSyncing ? '#93C5FD' : '#86EFAC'}`,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.84rem',
        color: !isOnline ? '#92400E' : isSyncing ? '#1E40AF' : '#166534',
        position: 'sticky',
        top: 'var(--header-height)',
        zIndex: 90
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!isOnline ? (
          <WifiOff size={16} color="#B45309" />
        ) : isSyncing ? (
          <RefreshCw size={16} className="animate-spin" color="#1D4ED8" />
        ) : (
          <CheckCircle2 size={16} color="#047857" />
        )}
        <span>
          {!isOnline
            ? '📶 ऑफलाइन मोड: सर्व माहिती फोनमध्ये सुरक्षित जतन आहे.'
            : isSyncing
            ? '🟡 नवीन माहिती सिंक होत आहे...'
            : '🟢 माहिती यशस्वीरीत्या सिंक झाली आहे.'}
        </span>
      </div>

      {isOnline && queuedActionsCount > 0 && !isSyncing && (
        <button
          onClick={triggerManualSync}
          style={{
            padding: '4px 10px',
            backgroundColor: '#1D4ED8',
            color: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 700,
            minHeight: '28px'
          }}
        >
          आत्ता सिंक करा ({queuedActionsCount})
        </button>
      )}
    </div>
  );
};
