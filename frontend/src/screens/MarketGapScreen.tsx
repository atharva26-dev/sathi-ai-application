import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Volume2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  MapPin,
  Briefcase,
  Sliders,
  Info,
  X,
  Target,
  Users,
  Store,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { useUser } from '../context/UserContext';
import { marketService } from '../services/marketService';
import { MarketGapItem, MarketGapAnalysisResult, CompetitorItem } from '../types';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface MarketGapScreenProps {
  onNavigate: (route: string) => void;
}

export const MarketGapScreen: React.FC<MarketGapScreenProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const { profile } = useUser();

  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [analysis, setAnalysis] = useState<MarketGapAnalysisResult | null>(null);
  const [selectedGap, setSelectedGap] = useState<MarketGapItem | null>(null);
  const [viewMode, setViewMode] = useState<'QUADRANT' | 'STORY' | 'COMPETITORS'>('QUADRANT');
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch live market gap analysis when business, location, capital, radius, or language changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    marketService
      .analyzeMarketGap(profile, language, radiusKm)
      .then((res) => {
        if (isMounted) {
          setAnalysis(res);
          if (res.opportunities.length > 0) {
            setSelectedGap(res.opportunities[0]);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error analyzing market gap:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [profile.desiredBusiness, profile.village, profile.district, profile.ownCapital, radiusKm, language]);

  const activeBusiness = profile.desiredBusiness || (language === 'en' ? 'Micro-Enterprise' : language === 'hi' ? 'सूक्ष्म उद्यम' : 'सूक्ष्म व्यवसाय');
  const activeLocation = profile.village
    ? `${profile.village}${profile.district ? `, ${profile.district}` : ''}`
    : language === 'en'
    ? 'Local Area'
    : language === 'hi'
    ? 'स्थानीय क्षेत्र'
    : 'स्थानिक परिसर';

  const storyVoiceText =
    language === 'en'
      ? `For your ${activeBusiness} in ${activeLocation}, our ground analysis shows strong opportunity with ${analysis?.scoreBreakdown.overallOpportunity || 82} out of 100 score. Before investing, validate with 20 local customers.`
      : language === 'hi'
      ? `आपके ${activeBusiness} के लिए ${activeLocation} में ${analysis?.scoreBreakdown.overallOpportunity || 82}/१०० का अवसर स्कोर है। निवेश से पहले स्थानीय २० ग्राहकों से पुष्टि करें।`
      : `तुमच्या ${activeLocation} परिसरातील '${activeBusiness}' व्यवसायासाठी ${analysis?.scoreBreakdown.overallOpportunity || 82}/१०० चा संधी स्कोअर आढळला आहे. प्रत्यक्ष काम सुरू करण्यापूर्वी २० ग्राहकांशी चर्चा करा.`;

  return (
    <div className="screen-content animate-fade-in">
      {/* Top Banner with Active Business & Location Context */}
      <div
        className="saathi-card"
        style={{
          padding: '12px 14px',
          marginBottom: '14px',
          background: 'linear-gradient(135deg, rgba(234,88,12,0.08) 0%, rgba(249,115,22,0.03) 100%)',
          border: '1.5px solid rgba(234,88,12,0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EA580C', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <Flame size={16} />
              <span>{language === 'en' ? 'LOCAL MARKET GAP FINDER' : language === 'hi' ? 'स्थानीय बाजार अवसर खोजक' : 'स्थानिक बाजारपेठ संधी शोधक'}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {activeBusiness}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={13} color="#EA580C" />
                {activeLocation}
              </span>
              <span>•</span>
              <span>{language === 'en' ? 'Capital' : 'भांडवल'}: ₹{(profile.ownCapital || 50000).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Radius Selector */}
            <div style={{ display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--border-medium)', padding: '2px' }}>
              <button
                onClick={() => setRadiusKm(5)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  backgroundColor: radiusKm === 5 ? '#EA580C' : 'transparent',
                  color: radiusKm === 5 ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                5 km
              </button>
              <button
                onClick={() => setRadiusKm(10)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  backgroundColor: radiusKm === 10 ? '#EA580C' : 'transparent',
                  color: radiusKm === 10 ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                10 km
              </button>
            </div>

            <AudioExplainButton
              id="audio_market_gap_story"
              textToSpeak={storyVoiceText}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Real-time Opportunity Score Card with Breakdown Trigger */}
      {analysis && (
        <div
          className="saathi-card"
          style={{
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderLeft: '4px solid #16A34A'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {language === 'en' ? 'Calculated Opportunity Score' : language === 'hi' ? 'गणना किया गया अवसर स्कोर' : 'गणना केलेला संधी स्कोअर'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16A34A' }}>
                {analysis.scoreBreakdown.overallOpportunity}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)' }}>/ 100</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(22,163,74,0.1)',
                  color: '#16A34A'
                }}
              >
                {analysis.scoreBreakdown.ratingLabel[language] || analysis.scoreBreakdown.ratingLabel.en}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowScoreModal(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #16A34A',
              backgroundColor: '#FFFFFF',
              color: '#16A34A',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <Info size={14} />
            <span>{language === 'en' ? 'How Calculated' : language === 'hi' ? 'गणना कैसे हुई' : 'कसा मोजला?'}</span>
          </button>
        </div>
      )}

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setViewMode('QUADRANT')}
          style={{
            flex: 1,
            padding: '10px 6px',
            borderRadius: '12px',
            backgroundColor: viewMode === 'QUADRANT' ? 'var(--primary)' : 'var(--bg-card)',
            color: viewMode === 'QUADRANT' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            border: '1.5px solid var(--border-medium)',
            minHeight: '44px'
          }}
        >
          📊 {language === 'en' ? '4-Quadrant Matrix' : language === 'hi' ? '४-घटक मैट्रिक्स' : '४-घटक संधी मॅट्रिक्स'}
        </button>
        <button
          onClick={() => setViewMode('STORY')}
          style={{
            flex: 1,
            padding: '10px 6px',
            borderRadius: '12px',
            backgroundColor: viewMode === 'STORY' ? 'var(--primary)' : 'var(--bg-card)',
            color: viewMode === 'STORY' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            border: '1.5px solid var(--border-medium)',
            minHeight: '44px'
          }}
        >
          📖 {language === 'en' ? 'Validation Steps' : language === 'hi' ? 'पुष्टि कदम' : 'पडताळणी पायऱ्या'}
        </button>
        <button
          onClick={() => setViewMode('COMPETITORS')}
          style={{
            flex: 1,
            padding: '10px 6px',
            borderRadius: '12px',
            backgroundColor: viewMode === 'COMPETITORS' ? 'var(--primary)' : 'var(--bg-card)',
            color: viewMode === 'COMPETITORS' ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.82rem',
            border: '1.5px solid var(--border-medium)',
            minHeight: '44px'
          }}
        >
          🏪 {language === 'en' ? 'Competitors' : language === 'hi' ? 'प्रतिस्पर्धी' : 'प्रतिस्पर्धी'}
        </button>
      </div>

      {/* VIEW 1: QUADRANT VIEW */}
      {viewMode === 'QUADRANT' && analysis && (
        <>
          <div
            className="saathi-card"
            style={{
              padding: '16px',
              marginBottom: '18px',
              backgroundColor: '#FFFFFF',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {language === 'en' ? 'Demand vs Competition Scatter' : 'मागणी विरुद्ध स्पर्धा नकाशा'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                💡 {language === 'en' ? 'Click card below to explore' : 'तपशील पाहण्यासाठी निवडा'}
              </span>
            </div>

            {/* Quadrant Visual Graph */}
            <div
              style={{
                height: '210px',
                border: '1.5px solid #E2E8F0',
                borderRadius: '12px',
                position: 'relative',
                background: 'linear-gradient(to right bottom, #F8FAFC 50%, #FFFBEB 50%)',
                overflow: 'hidden'
              }}
            >
              {/* Quadrant Axes Labels */}
              <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.72rem', fontWeight: 800, color: '#EA580C', backgroundColor: 'rgba(234,88,12,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                🔥 {language === 'en' ? 'HIGH OPPORTUNITY' : 'मोठी संधी'}
              </div>
              <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#3B82F6' }}>
                ⚔️ {language === 'en' ? 'COMPETITIVE' : 'जास्त स्पर्धा'}
              </div>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#10B981' }}>
                🎯 {language === 'en' ? 'NICHE' : 'विशेष संधी'}
              </div>
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#EF4444' }}>
                ⚠️ {language === 'en' ? 'HIGH RISK' : 'जोखीम जास्त'}
              </div>

              {/* Dynamic Opportunity Plot Points */}
              {analysis.opportunities.map((item) => {
                const isSelected = selectedGap?.id === item.id;
                // Calculate percentage position: X = competitionScore (0-100), Y = demandScore (0-100, inverted for top)
                const leftPos = Math.min(Math.max(item.competitionScore, 15), 85);
                const topPos = Math.min(Math.max(100 - item.demandScore, 15), 80);

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGap(item)}
                    style={{
                      position: 'absolute',
                      left: `${leftPos}%`,
                      top: `${topPos}%`,
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: isSelected ? '6px 12px' : '4px 8px',
                      borderRadius: '20px',
                      backgroundColor: isSelected ? '#EA580C' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                      border: isSelected ? '2px solid #C2410C' : '1.5px solid #CBD5E1',
                      boxShadow: isSelected ? '0 4px 12px rgba(234,88,12,0.35)' : '0 2px 4px rgba(0,0,0,0.06)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      zIndex: isSelected ? 10 : 2,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{item.icon}</span>
                    <span style={{ maxWidth: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.nameNative?.[language] || item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Opportunity Detail Card */}
          {selectedGap && (
            <div
              className="saathi-card animate-fade-in"
              style={{
                padding: '16px',
                marginBottom: '16px',
                border: '2px solid rgba(234,88,12,0.3)',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{selectedGap.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {selectedGap.nameNative?.[language] || selectedGap.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(234,88,12,0.1)', color: '#EA580C' }}>
                        🔥 {language === 'en' ? 'High Local Demand' : 'स्थानिक मागणी'}
                      </span>
                      <DataTrustBadge trustInfo={selectedGap.trustInfo} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Demand Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {language === 'en' ? 'Estimated Demand' : 'अंदाजित दैनिक मागणी'}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedGap.dailyEstimatedDemand}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {language === 'en' ? 'Expected Price' : 'अपेक्षित सरासरी दर'}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#16A34A' }}>
                    {selectedGap.avgSellingPrice}
                  </div>
                </div>
              </div>

              {/* Unmet Need Reason */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  🎯 {language === 'en' ? 'Why this gap exists in your area:' : 'तुमच्या भागात ही संधी का आहे?'}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
                  {selectedGap.unmetNeedReason?.[language] || selectedGap.unmetNeedReason?.en}
                </p>
              </div>

              {/* Target Customers */}
              {selectedGap.keyTargetCustomers && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    👥 {language === 'en' ? 'Target Customers:' : 'प्रमुख ग्राहक गट:'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedGap.keyTargetCustomers.map((cust, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px', color: 'var(--text-primary)' }}>
                        {cust}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Checklist / Test Before Investing */}
              <div style={{ backgroundColor: 'rgba(22,163,74,0.06)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(22,163,74,0.2)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>{language === 'en' ? 'Test Before Investing (First Step):' : 'गुंतवणूक करण्यापूर्वी प्रत्यक्ष पडताळणी:'}</span>
                </div>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {selectedGap.firstValidationStep}
                </p>
                {selectedGap.validationChecklist && (
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {selectedGap.validationChecklist.map((step, sIdx) => (
                      <li key={sIdx} style={{ marginBottom: '2px' }}>{step}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* VIEW 2: VALIDATION STORY MODE */}
      {viewMode === 'STORY' && analysis && (
        <div className="saathi-card" style={{ padding: '16px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            📖 {language === 'en' ? 'Local Opportunity Action Plan' : 'स्थानिक संधी कृती आराखडा'}
          </h3>

          {analysis.opportunities.map((opp, idx) => (
            <div key={opp.id} style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: idx < analysis.opportunities.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.3rem' }}>{opp.icon}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {idx + 1}. {opp.nameNative?.[language] || opp.name}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: '4px 0 8px 0' }}>
                {opp.unmetNeedReason?.[language] || opp.unmetNeedReason?.en}
              </p>
              <div style={{ backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>
                👉 {language === 'en' ? 'First Validation Step:' : 'पहिली पायरी:'} {opp.firstValidationStep}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: COMPETITOR INSIGHTS */}
      {viewMode === 'COMPETITORS' && analysis && (
        <div className="saathi-card" style={{ padding: '16px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            🏪 {language === 'en' ? `Identified Competitors near ${activeLocation}` : `${activeLocation} परिसरातील व्यावसायिक`}
          </h3>

          {analysis.competitors.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {language === 'en' ? 'No direct commercial competitors recorded within selected radius.' : 'या परिसरात थेट व्यावसायिक आढळले नाहीत.'}
            </p>
          ) : (
            analysis.competitors.map((comp) => (
              <div key={comp.id} style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#F8FAFC', marginBottom: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {comp.name}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      📍 {comp.location} ({comp.distanceKm} km away)
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: comp.competitionLevel === 'HIGH' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', color: comp.competitionLevel === 'HIGH' ? '#EF4444' : '#3B82F6' }}>
                    {comp.competitionLevel}
                  </span>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EA580C', marginBottom: '2px' }}>
                    ⚡ {language === 'en' ? 'Their Service Gaps (Your Opportunity):' : 'त्यांच्यातील उणिवा (तुमची संधी):'}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    {comp.knownGaps.map((gap, gIdx) => (
                      <li key={gIdx}>{gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Data Source Provenance Footer */}
      {analysis && (
        <div style={{ marginTop: '16px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              ℹ️ {language === 'en' ? 'Source' : 'माहिती स्रोत'}: {analysis.dataSources[0]?.source || 'LGD & SAATHI Ground Radar'}
            </span>
            <span>
              {language === 'en' ? 'Updated: Sept 2026' : 'अद्यतन: सप्टेंबर २०२६'}
            </span>
          </div>
        </div>
      )}

      {/* MODAL: How Score was calculated */}
      {showScoreModal && analysis && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px'
          }}
        >
          <div
            className="saathi-card animate-fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '440px',
              padding: '20px',
              borderRadius: '16px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                📊 {language === 'en' ? 'How this Score was Calculated' : 'संधी स्कोअर कसा मोजला गेला?'}
              </h3>
              <button
                onClick={() => setShowScoreModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(22,163,74,0.08)', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16A34A' }}>
                {analysis.scoreBreakdown.overallOpportunity} / 100
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {analysis.scoreBreakdown.ratingLabel[language] || analysis.scoreBreakdown.ratingLabel.en}
              </div>
            </div>

            {/* Component Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '2px' }}>
                  <span>{language === 'en' ? 'Local Demand (25%)' : 'स्थानिक मागणी (२५%)'}</span>
                  <span>{analysis.scoreBreakdown.demand}/100</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${analysis.scoreBreakdown.demand}%`, height: '100%', backgroundColor: '#16A34A' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '2px' }}>
                  <span>{language === 'en' ? 'Low Competition Factor (20%)' : 'कमी स्पर्धा घटक (२०%)'}</span>
                  <span>{100 - analysis.scoreBreakdown.competition}/100</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${100 - analysis.scoreBreakdown.competition}%`, height: '100%', backgroundColor: '#3B82F6' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '2px' }}>
                  <span>{language === 'en' ? 'Capital Fit (15%)' : 'भांडवल मेळ (१५%)'}</span>
                  <span>{analysis.scoreBreakdown.capitalFit}/100</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${analysis.scoreBreakdown.capitalFit}%`, height: '100%', backgroundColor: '#F59E0B' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '2px' }}>
                  <span>{language === 'en' ? 'Market Accessibility (10%)' : 'बाजारपेठ उपलब्धता (१०%)'}</span>
                  <span>{analysis.scoreBreakdown.accessibility}/100</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${analysis.scoreBreakdown.accessibility}%`, height: '100%', backgroundColor: '#8B5CF6' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '2px' }}>
                  <span>{language === 'en' ? 'Operational Risk Index (-5%)' : 'परिचालन जोखीम (-५%)'}</span>
                  <span style={{ color: '#EF4444' }}>{analysis.scoreBreakdown.riskPenalty}/100</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${analysis.scoreBreakdown.riskPenalty}%`, height: '100%', backgroundColor: '#EF4444' }} />
                </div>
              </div>
            </div>

            {/* Explanation Points */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                📝 {language === 'en' ? 'Evidence Summary:' : 'पुरावा सारांश:'}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: '1.4' }}>
                {((analysis.scoreBreakdown.explanationPoints && (analysis.scoreBreakdown.explanationPoints[language] || analysis.scoreBreakdown.explanationPoints.en)) || []).map((pt, pIdx) => (
                  <li key={pIdx} style={{ marginBottom: '2px' }}>{pt}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowScoreModal(false)}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '16px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {language === 'en' ? 'Close' : 'बंद करा'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
