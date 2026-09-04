import React, { useState, useEffect } from 'react';
import { Flame, ChevronRight, TrendingUp, Sparkles, MapPin, Layers, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { marketService } from '../../services/marketService';
import { LocalMarketIntelligence, WhatSellsItem } from '../../types';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { LocalValidationModal } from './LocalValidationModal';

interface WhatMovesCardProps {
  onNavigate: (route: string) => void;
}

export const WhatMovesCard: React.FC<WhatMovesCardProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { profile } = useUser();

  const [intelligence, setIntelligence] = useState<LocalMarketIntelligence | null>(null);
  const [selectedItem, setSelectedItem] = useState<WhatSellsItem | null>(null);
  const [validationItem, setValidationItem] = useState<WhatSellsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const activeBiz = profile.desiredBusiness || (language === 'mr' ? 'सूक्ष्म व्यवसाय' : 'Micro-Enterprise');
  const activeLoc = profile.village
    ? `${profile.village}${profile.district ? `, ${profile.district}` : ''}`
    : language === 'mr'
    ? 'स्थानिक परिसर'
    : 'Local Area';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    marketService
      .getLocalMarketIntelligence(profile, language, 10)
      .then((data) => {
        if (isMounted) {
          setIntelligence(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching market intelligence:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [profile.desiredBusiness, profile.village, profile.district, profile.ownCapital, language]);

  const topItems = intelligence?.whatSellsMore.slice(0, 4) || [];

  return (
    <>
      <div
        className="saathi-card"
        style={{
          padding: '18px',
          marginBottom: '20px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #FFEDD5',
          borderRadius: '20px',
          boxShadow: '0 4px 14px rgba(234, 88, 12, 0.08)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: '#FFEDD5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Flame size={18} color="#EA580C" />
              </div>
              <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {language === 'mr'
                  ? '🔥 तुमच्या बाजारात काय वेगाने विकले जात आहे?'
                  : language === 'hi'
                  ? '🔥 आपके बाजार में क्या बिक रहा है?'
                  : "🔥 What's Moving in Your Market"}
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px', paddingLeft: '40px' }}>
              {activeLoc} • {language === 'mr' ? 'अधिकृत स्थानिक डेटावर आधारित' : language === 'hi' ? 'प्रमाणित स्थानीय डेटा पर आधारित' : 'Official Ground Evidence'}
            </p>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              whiteSpace: 'nowrap'
            }}
          >
            TOP 3–5
          </span>
        </div>

        {/* Opportunity List (Top 3-5) */}
        {loading ? (
          <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {language === 'mr' ? 'स्थानिक बाजारपेठ माहिती गोळा करत आहे...' : language === 'hi' ? 'स्थानीय बाजार डेटा स्कैन हो रहा है...' : 'Scanning local market data...'}
          </div>
        ) : topItems.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {language === 'mr' ? 'माहिती उपलब्ध होत आहे. कृपया स्थानिक पातळीवर खात्री करा.' : language === 'hi' ? 'डेटा संकलित हो रहा है। कृपया स्थानीय स्तर पर पुष्टि करें।' : 'Market signals are compiling. Verify locally.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            {topItems.map((item, idx) => {
              const name = item.nameNative[language] || item.name;
              const why = item.whyItMatters[language] || item.whyItMatters.en;

              return (
                <div
                  key={item.id || idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    backgroundColor: idx === 0 ? '#FFF7ED' : '#F9FAFB',
                    border: idx === 0 ? '1.5px solid #FDBA74' : '1px solid #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  {/* Title & Badge Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{item.visualSignal}</span>
                      <span style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {name}
                      </span>
                    </div>

                    <span
                      className="num-font"
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: idx === 0 ? '#EA580C' : '#16A34A',
                        backgroundColor: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      {item.opportunityScore}/100
                    </span>
                  </div>

                  {/* Signals: Demand + Competition + Observed Price */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.76rem' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: item.demandLevel === 'HIGH' ? '#DCFCE7' : '#EFF6FF',
                        color: item.demandLevel === 'HIGH' ? '#166534' : '#1E40AF',
                        fontWeight: 700
                      }}
                    >
                      {item.demandLevel === 'HIGH'
                        ? language === 'mr' ? '🔥 जास्त मागणी' : language === 'hi' ? '🔥 भारी मांग' : '🔥 High Demand'
                        : language === 'mr' ? 'मध्यम मागणी' : language === 'hi' ? 'मध्यम मांग' : 'Moderate Demand'}
                    </span>

                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: item.competitionLevel === 'HIGH' ? '#FEE2E2' : '#FEF3C7',
                        color: item.competitionLevel === 'HIGH' ? '#991B1B' : '#92400E',
                        fontWeight: 700
                      }}
                    >
                      {item.competitionLevel === 'LOW'
                        ? language === 'mr' ? '🟢 कमी स्पर्धा' : language === 'hi' ? '🟢 कम प्रतिस्पर्धा' : '🟢 Low Competition'
                        : item.competitionLevel === 'MEDIUM'
                        ? language === 'mr' ? '🟡 मध्यम स्पर्धा' : language === 'hi' ? '🟡 मध्यम प्रतिस्पर्धा' : '🟡 Medium Competition'
                        : language === 'mr' ? '🔴 जास्त स्पर्धा' : language === 'hi' ? '🔴 अधिक प्रतिस्पर्धा' : '🔴 High Competition'}
                    </span>

                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {item.observedOrEstimatedPrice}
                    </span>
                  </div>

                  {/* Why it matters simple explanation */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {why}
                  </div>

                  {/* Action trigger: Check this opportunity */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                    <button
                      onClick={() => setSelectedItem(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 0'
                      }}
                    >
                      <span>{language === 'mr' ? 'संधी तपासा' : language === 'hi' ? 'अवसर जांचें' : 'Check this opportunity'}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Explore Full 10-Section Local Market Button */}
        <button
          onClick={() => onNavigate('/local-market')}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1.5px solid var(--primary)',
            backgroundColor: '#FFF7ED',
            color: 'var(--primary)',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Layers size={16} />
          <span>
            {language === 'mr'
              ? 'स्थानिक बाजाराचा संपूर्ण १० कलमी अहवाल पाहा →'
              : language === 'hi'
              ? 'स्थानीय बाजार की १० सूत्रीय रिपोर्ट देखें →'
              : 'Explore Complete 10-Section Local Market Intelligence →'}
          </span>
        </button>
      </div>

      {/* Opportunity Detail Modal */}
      {selectedItem && (
        <OpportunityDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onOpenValidation={(item) => {
            setSelectedItem(null);
            setValidationItem(item);
          }}
        />
      )}

      {/* Field Validation Modal */}
      {validationItem && (
        <LocalValidationModal
          item={validationItem}
          location={activeLoc}
          onClose={() => setValidationItem(null)}
          onSaved={(log) => {
            console.log('Saved field log:', log);
          }}
        />
      )}
    </>
  );
};
