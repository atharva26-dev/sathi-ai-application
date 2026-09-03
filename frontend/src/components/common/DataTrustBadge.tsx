import React, { useState } from 'react';
import { ShieldCheck, User, Calculator, Sparkles, HelpCircle } from 'lucide-react';
import { DataTrustInfo } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { EvidenceDrawer } from './EvidenceDrawer';

interface DataTrustBadgeProps {
  trustInfo?: DataTrustInfo;
  className?: string;
  showDetailButton?: boolean;
}

export const DataTrustBadge: React.FC<DataTrustBadgeProps> = ({
  trustInfo,
  className = '',
  showDetailButton = true
}) => {
  const { t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!trustInfo) return null;

  const { level } = trustInfo;

  let badgeClass = 'badge-estimate';
  let icon = <Sparkles size={13} />;
  let label = t.common.aiEstimate;

  if (level === 'VERIFIED') {
    badgeClass = 'badge-verified';
    icon = <ShieldCheck size={13} />;
    label = t.common.verifiedData;
  } else if (level === 'USER_INPUT') {
    badgeClass = 'badge-user';
    icon = <User size={13} />;
    label = t.common.yourInfo;
  } else if (level === 'CALCULATED') {
    badgeClass = 'badge-calculated';
    icon = <Calculator size={13} />;
    label = t.common.calculated;
  }

  return (
    <>
      <span
        className={`badge-pill ${badgeClass} ${className} cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          if (showDetailButton) setDrawerOpen(true);
        }}
        title="माहितीचा स्रोत व विश्वासार्हता पाहण्यासाठी क्लिक करा"
      >
        {icon}
        <span>{label}</span>
        {showDetailButton && (
          <HelpCircle size={11} className="opacity-70 ml-0.5 hover:opacity-100" />
        )}
      </span>

      {showDetailButton && (
        <EvidenceDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          trustInfo={trustInfo}
        />
      )}
    </>
  );
};
