import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Flame,
  Store,
  Building2,
  Truck,
  Users,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Tag,
  AlertTriangle,
  Calendar,
  Layers,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useVoice } from '../context/VoiceContext';
import { marketService } from '../services/marketService';
import { LocalMarketIntelligence, WhatSellsItem } from '../types';
import { MapView } from '../components/common/MapView';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';
import { OpportunityDetailModal } from '../components/market/OpportunityDetailModal';
import { LocalValidationModal } from '../components/market/LocalValidationModal';
import { DeepMarketPlanModal } from '../components/market/DeepMarketPlanModal';

interface LocalMarketScreenProps {
  onNavigate: (route: string) => void;
}

export const LocalMarketScreen: React.FC<LocalMarketScreenProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { profile } = useUser();

  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [intelligence, setIntelligence] = useState<LocalMarketIntelligence | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<WhatSellsItem | null>(null);
  const [validationItem, setValidationItem] = useState<WhatSellsItem | null>(null);
  const [showDeepPlan, setShowDeepPlan] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'SELLS' | 'PRICES' | 'COMPETITION' | 'GAPS'>('ALL');

  const activeBusiness = profile.desiredBusiness || (language === 'mr' ? 'सूक्ष्म व्यवसाय' : 'Micro-Enterprise');
  const activeLocation = profile.village
    ? `${profile.village}${profile.district ? `, ${profile.district}` : ''}`
    : language === 'mr'
    ? 'स्थानिक परिसर'
    : 'Local Area';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    marketService
      .getLocalMarketIntelligence(profile, language, radiusKm)
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
  }, [profile.desiredBusiness, profile.village, profile.district, profile.ownCapital, radiusKm, language]);

  const audioExplainer =
    language === 'en'
      ? `Around ${activeLocation} within ${radiusKm}km, our market intelligence identified ${intelligence?.whatSellsMore.length || 3} high-demand opportunities for your ${activeBusiness}. Opportunity score is ${intelligence?.overallOpportunityScore || 84}/100.`
      : language === 'hi'
      ? `${activeLocation} के आसपास ${radiusKm} किमी में ${activeBusiness} के लिए मजबूत स्थानीय मांग और व्यावसायिक अवसर उपलब्ध हैं। समग्र अवसर स्कोर ${intelligence?.overallOpportunityScore || 84}/१०० है।`
      : `तुमच्या ${activeLocation} भोवती ${radiusKm} किमी परिसरात '${activeBusiness}' व्यवसायासाठी चांगली ग्राहक मागणी उपलब्ध आहे. एकूण संधी स्कोअर ${intelligence?.overallOpportunityScore || 84}/१०० आहे.`;

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: '90px' }}>
      {/* Title & Speech Cue */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.4rem' }}>📍</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {language === 'mr' ? 'स्थानिक बाजारपेठ विश्लेषण' : language === 'hi' ? 'स्थानीय बाजार विश्लेषण' : 'Local Market Intelligence'}
            </h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px', paddingLeft: '28px' }}>
            {activeBusiness} • {activeLocation}
          </p>
        </div>

        <AudioExplainButton
          id="audio_local_market_screen"
          textToSpeak={audioExplainer}
          size="sm"
        />
      </div>

      {/* Data Freshness & Granularity Notice */}
      <div
        style={{
          padding: '10px 14px',
          backgroundColor: '#EFF6FF',
          borderRadius: '12px',
          border: '1px solid #DBEAFE',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ fontSize: '0.78rem', color: '#1E40AF', fontWeight: 600 }}>
          📊 {intelligence?.location.granularityNotice[language] || 'Based on official district and mandi records.'}
        </div>
        <div style={{ fontSize: '0.74rem', color: '#3B82F6', fontWeight: 700 }}>
          {intelligence?.dataFreshness.lastUpdatedDate}
        </div>
      </div>

      {/* Interactive MapView */}
      <div style={{ marginBottom: '18px' }}>
        <MapView
          radiusKm={radiusKm}
          onRadiusChange={(r) => setRadiusKm(r)}
        />
      </div>

      {/* Primary Upgrade Banner: "UPGRADE YOUR LOCAL MARKET PLAN" */}
      <div
        className="saathi-card"
        style={{
          padding: '16px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          borderRadius: '18px',
          boxShadow: '0 8px 20px rgba(29, 78, 216, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#FDE047" />
            <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>
              {language === 'mr' ? 'स्थानिक बाजार आराखडा' : language === 'hi' ? 'स्थानीय बाजार योजना' : 'LOCAL MARKET MASTER PLAN'}
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>
            {language === 'mr' ? 'खोलवर सल्ला' : 'DEEP ANALYSIS'}
          </span>
        </div>

        <p style={{ fontSize: '0.84rem', opacity: 0.95, lineHeight: 1.45, marginBottom: '14px' }}>
          {language === 'mr'
            ? 'काय विकले जात आहे, कोण खरेदी करत आहे, काय उणीव आहे आणि काय अंगलट येऊ शकते? या १३ महत्त्वाच्या प्रश्नांची उत्तरे जाणून घ्या.'
            : 'Answers to the 13 critical market questions: what is selling, who is buying, what is missing, and what risks exist.'}
        </p>

        <button
          onClick={() => setShowDeepPlan(true)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            color: '#1D4ED8',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <span>{language === 'mr' ? 'स्थानिक बाजार आराखडा उघडा' : language === 'hi' ? 'गहन बाजार योजना देखें' : 'UPGRADE YOUR LOCAL MARKET PLAN'}</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
        {[
          { key: 'ALL', label: language === 'mr' ? 'सर्व विभाग' : 'All Sections' },
          { key: 'SELLS', label: language === 'mr' ? '🔥 काय विकते' : "What's Moving" },
          { key: 'PRICES', label: language === 'mr' ? '🏷️ दर' : 'Price Watch' },
          { key: 'COMPETITION', label: language === 'mr' ? '🏪 स्पर्धा' : 'Competition' },
          { key: 'GAPS', label: language === 'mr' ? '🎯 बाजार पोकळी' : 'Market Gaps' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: activeTab === tab.key ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
              backgroundColor: activeTab === tab.key ? '#FFF7ED' : '#FFFFFF',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: WHAT SELLS MORE */}
      {(activeTab === 'ALL' || activeTab === 'SELLS') && (
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              १. {language === 'mr' ? 'बाजारात काय वेगाने विकले जात आहे? (What Sells More)' : "What Sells More"}
            </h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {intelligence?.whatSellsMore.length || 0} items
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {intelligence?.whatSellsMore.map((item, idx) => (
              <div
                key={item.id || idx}
                className="saathi-card saathi-card-interactive"
                style={{ padding: '14px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}
                onClick={() => setSelectedItem(item)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.visualSignal}</span>
                    <span style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {item.nameNative[language] || item.name}
                    </span>
                  </div>
                  <span className="num-font" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EA580C' }}>
                    {item.opportunityScore}/100
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                  <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#166534', fontWeight: 700 }}>
                    {item.demandLevel} DEMAND
                  </span>
                  <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 700 }}>
                    {item.competitionLevel} COMPETITION
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{item.observedOrEstimatedPrice}</span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {item.rankingReasonText[language] || item.rankingReasonText.en}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{language === 'mr' ? 'संधी तपासा' : 'Check Opportunity'}</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: MARKET GAPS */}
      {(activeTab === 'ALL' || activeTab === 'GAPS') && (
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            २. {language === 'mr' ? 'स्थानिक बाजारपेठ पोकळी (Market Gaps)' : 'Market Gaps & Underserved Needs'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {intelligence?.marketGaps.map((gap, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: '#FFFBF5',
                  border: '1px solid #FFEDD5',
                  borderLeft: '4px solid #EA580C'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {gap.title}
                  </span>
                  <span style={{ fontSize: '0.74rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FFEDD5', color: '#9A3412', fontWeight: 700 }}>
                    {gap.gapType}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  {gap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: PRICE WATCH */}
      {(activeTab === 'ALL' || activeTab === 'PRICES') && (
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ३. {language === 'mr' ? 'दर निरीक्षण (Price Watch - APMC व किरकोळ भाव)' : 'Price Watch (APMC & Retail Benchmark)'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {intelligence?.priceWatch.map((pw, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-medium)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {pw.commodityOrService}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {pw.marketOrApmcName} • {pw.recordDate}
                    </div>
                  </div>
                  <span style={{ fontSize: '1.2rem' }}>{pw.trendSignal}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', textAlign: 'center', backgroundColor: '#F9FAFB', padding: '8px', borderRadius: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>किमान दर</div>
                    <div className="num-font" style={{ fontSize: '0.84rem', fontWeight: 700 }}>{pw.minPrice}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#166534', fontWeight: 700 }}>सरासरी (Modal)</div>
                    <div className="num-font" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#166534' }}>{pw.modalPrice}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>कमाल दर</div>
                    <div className="num-font" style={{ fontSize: '0.84rem', fontWeight: 700 }}>{pw.maxPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: COMPETITION (Udyam + Informal) */}
      {(activeTab === 'ALL' || activeTab === 'COMPETITION') && (
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ४. {language === 'mr' ? 'स्थानिक स्पर्धा वास्तव (Competition Reality)' : 'Competition Reality'}
          </h3>

          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--border-medium)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', backgroundColor: '#EFF6FF', borderRadius: '12px', border: '1px solid #DBEAFE' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E40AF' }}>नोंदणीकृत सूक्ष्म उद्योग (Udyam)</div>
                <div className="num-font" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1D4ED8', marginTop: '2px' }}>
                  {intelligence?.competition.formalRegisteredCount}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#3B82F6' }}>अधिकृत सरकारी नोंदणी</div>
              </div>

              <div style={{ padding: '10px', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400E' }}>अंदाजित अनौपचारिक दुकाने</div>
                <div className="num-font" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>
                  ~{intelligence?.competition.informalEstimatedCount}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#92400E' }}>स्थानिक किरकोळ/घरगुती</div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
              {intelligence?.competition.statement}
            </p>

            <div style={{ padding: '10px 12px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #DCFCE7', fontSize: '0.82rem', color: '#166534', lineHeight: 1.4 }}>
              💡 <strong>{language === 'mr' ? 'सल्ला:' : 'Advice:'}</strong>{' '}
              {intelligence?.competition.adviceOnDifferentiation[language] || intelligence?.competition.adviceOnDifferentiation.en}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: LOCAL RESOURCES (ODOP & Crops) */}
      {activeTab === 'ALL' && (
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ५. {language === 'mr' ? 'स्थानिक आर्थिक स्त्रोत व कच्चा माल (Local Resources)' : 'Local Resources & Agricultural Abundance'}
          </h3>

          <div style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            {intelligence?.localResources.odopSpecialization && (
              <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase' }}>
                  🏅 एक जिल्हा एक उत्पादन (ODOP - DPIIT)
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {intelligence.localResources.odopSpecialization.productName}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  {intelligence.localResources.odopSpecialization.rationale}
                </p>
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                🌾 प्रमुख स्थानिक कृषी पिके (वार्षिक उत्पादन):
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {intelligence?.localResources.dominantCrops.map((c, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}
                  >
                    {c.crop}: {c.annualProductionTonnes.toLocaleString('en-IN')} टन
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: CUSTOMER SEGMENTS */}
      {activeTab === 'ALL' && (
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ६. {language === 'mr' ? 'संभाव्य ग्राहक वर्ग (Customer Opportunities)' : 'Customer Segments'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {intelligence?.customerSegments.map((cs, idx) => (
              <div key={idx} style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-medium)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {cs.segmentNative[language] || cs.segment}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  • {cs.purchasingHabit}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 700, marginTop: '4px' }}>
                  प्रमुख गरज: {cs.keyNeed}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: SEASONAL OPPORTUNITIES */}
      {activeTab === 'ALL' && (
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ७. {language === 'mr' ? 'हंगामी संधी (Seasonal Opportunities)' : 'Seasonal Opportunities'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {intelligence?.seasonalOpportunities.map((so, idx) => (
              <div key={idx} style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#9A3412' }}>
                  🗓️ {so.period}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#7C2D12', marginTop: '3px', lineHeight: 1.4 }}>
                  {so.opportunity}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#EA580C', fontWeight: 700, marginTop: '4px' }}>
                  तयारी: {so.preparationLeadTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: BUSINESS OPPORTUNITIES */}
      {activeTab === 'ALL' && (
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ८. {language === 'mr' ? 'व्यवहार्य व्यवसाय संधी (Business Opportunities)' : 'Viable Business Opportunities'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {intelligence?.businessOpportunities.map((bo, idx) => (
              <div key={idx} style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-medium)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                    {bo.titleNative[language] || bo.title}
                  </div>
                  <span className="num-font" style={{ fontSize: '0.84rem', fontWeight: 800, color: '#16A34A' }}>
                    {bo.score}/100
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  भांडवल: {bo.capitalRequired} | पेबॅक: {bo.paybackPeriod}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>
                  पहिली पायरी: {bo.actionPlanStep1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 9: RISKS */}
      {activeTab === 'ALL' && (
        <div style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            ९. {language === 'mr' ? 'धोके व बचावात्मक उपाय (Risks & Mitigation)' : 'Critical Risks'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {intelligence?.risks.map((r, idx) => (
              <div key={idx} style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#991B1B' }}>
                  ⚠️ {r.risk}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#7F1D1D', marginTop: '3px', lineHeight: 1.4 }}>
                  उपाय: {r.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 10: WHAT TO DO NEXT (Validation Checklist) */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
          १०. {language === 'mr' ? 'पुढे काय करावे? (५ कलमी स्थानिक खात्री आराखडा)' : 'What to Do Next: 5-Step Field Checklist'}
        </h3>

        <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {intelligence?.validationChecklist.map((vc) => (
              <div key={vc.stepNumber} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#FFEDD5',
                    color: '#EA580C',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {vc.stepNumber}
                </span>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {vc.action}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    तपासा: {vc.whatToLookFor}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (intelligence?.whatSellsMore[0]) {
                setValidationItem(intelligence.whatSellsMore[0]);
              }
            }}
            className="saathi-btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📝 स्थानिक खात्री अहवाल नोंदवा</span>
            <ChevronRight size={16} />
          </button>
        </div>
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
          location={activeLocation}
          onClose={() => setValidationItem(null)}
          onSaved={(log) => {
            console.log('Saved log:', log);
          }}
        />
      )}

      {/* Deep Master Plan Modal */}
      {showDeepPlan && intelligence && (
        <DeepMarketPlanModal
          intelligence={intelligence}
          onClose={() => setShowDeepPlan(false)}
        />
      )}
    </div>
  );
};
