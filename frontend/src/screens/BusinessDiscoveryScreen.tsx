import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Volume2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  MapPin,
  ShieldCheck,
  Building2,
  Database,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useVoice } from '../context/VoiceContext';
import { businessService, OpportunityDiscoveryResponse } from '../services/businessService';
import { BusinessOpportunity } from '../types';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';

interface BusinessDiscoveryScreenProps {
  onNavigate: (route: string) => void;
}

export const BusinessDiscoveryScreen: React.FC<BusinessDiscoveryScreenProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { profile, updateProfile, selectedOpportunity, setSelectedOpportunity } = useUser();
  const { speak } = useVoice();

  const [loading, setLoading] = useState<boolean>(true);
  const [opportunities, setOpportunities] = useState<BusinessOpportunity[]>([]);
  const [discoveryMeta, setDiscoveryMeta] = useState<Partial<OpportunityDiscoveryResponse>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  const hasLocation = Boolean(
    (profile.village && profile.village.trim()) ||
    (profile.block && profile.block.trim()) ||
    (profile.district && profile.district.trim())
  );

  const displayLocation = hasLocation
    ? `${profile.village ? profile.village + ', ' : ''}${profile.block ? profile.block + ', ' : ''}${profile.district || profile.state || ''}`.replace(/,\s*$/, '')
    : '';

  useEffect(() => {
    let isMounted = true;

    const fetchOpportunities = async () => {
      if (!hasLocation) {
        setLoading(false);
        setErrorMessage('Location data is required for a reliable local opportunity analysis.');
        setOpportunities([]);
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        const res = await businessService.discoverOpportunities({
          location: {
            village: profile.village,
            block: profile.block,
            district: profile.district,
            state: profile.state
          },
          capital: profile.ownCapital || 50000,
          skills: profile.skills || [],
          experienceYears: profile.experienceYears,
          language
        });

        if (!isMounted) return;

        if (res.success && res.opportunities.length > 0) {
          setOpportunities(res.opportunities);
          setDiscoveryMeta({
            dataGranularity: res.dataGranularity,
            confidence: res.confidence,
            isOffline: res.isOffline,
            cachedDate: res.cachedDate
          });
          // Auto-expand first opportunity card
          setExpandedCardId(res.opportunities[0].id);
        } else {
          setErrorMessage(res.message || 'No reliable local opportunity data is available yet for this location.');
          setOpportunities([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to discover opportunities:', err);
        setErrorMessage('Failed to load opportunities. Please verify connection.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOpportunities();

    return () => {
      isMounted = false;
    };
  }, [profile.village, profile.district, profile.block, profile.ownCapital, language, refreshIndex, hasLocation]);

  const handleSelectBusiness = (opp: BusinessOpportunity) => {
    setSelectedOpportunity(opp);
    const title = opp.titleNative[language] || opp.titleNative.mr || opp.title;
    updateProfile({ desiredBusiness: title });
    speak(
      language === 'mr'
        ? `${title} निवडला आहे. आता आपण याच्या बाजाराचे आणि नफ्याचे विश्लेषण पाहू.`
        : language === 'hi'
        ? `${title} चुना गया है। अब हम इसके बाजार और मुनाफे का विश्लेषण देखेंगे।`
        : `${title} selected. Let us now examine its local market gap and profit feasibility.`
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: '32px' }}>
      {/* Title & Subtitle */}
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {t.businessDiscovery.title}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {t.businessDiscovery.subtitle}
        </p>
      </div>

      {/* Missing Location Gate */}
      {!hasLocation && (
        <div
          className="saathi-card animate-fade-in"
          style={{
            padding: '20px',
            backgroundColor: '#FEF2F2',
            border: '2px solid #F87171',
            borderRadius: '16px',
            marginBottom: '24px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}
          >
            <MapPin size={28} color="#DC2626" />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#991B1B', marginBottom: '8px' }}>
            {language === 'mr' ? 'स्थान माहिती आवश्यक आहे' : language === 'hi' ? 'स्थान की जानकारी आवश्यक है' : 'Location Required'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#B91C1C', lineHeight: 1.45, marginBottom: '16px' }}>
            {language === 'mr'
              ? 'विश्वसनीय स्थानिक संधी शोधण्यासाठी तुमचे गाव, तालुका किंवा जिल्हा आवश्यक आहे. SAATHI कोणत्याही काल्पनिक गावाचा अंदाज लावत नाही.'
              : language === 'hi'
              ? 'सटीक स्थानीय व्यापार अवसरों के लिए आपके गाँव या जिले की जानकारी आवश्यक है। SAATHI काल्पनिक अनुमान नहीं लगाता।'
              : 'Location data is required for a reliable local opportunity analysis. SAATHI does not invent fictitious local recommendations.'}
          </p>
          <button
            onClick={() => onNavigate('/profile')}
            className="btn-primary"
            style={{
              width: '100%',
              minHeight: '44px',
              borderRadius: '12px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700
            }}
          >
            {language === 'mr' ? '📍 प्रोफाइलमध्ये स्थान प्रविष्ट करा' : language === 'hi' ? '📍 प्रोफाइल में स्थान दर्ज करें' : '📍 Set My Location in Profile'}
          </button>
        </div>
      )}

      {/* Profile Context Banner (When location exists) */}
      {hasLocation && (
        <div
          className="saathi-card"
          style={{
            padding: '14px 16px',
            marginBottom: '16px',
            backgroundColor: '#FFF7ED',
            border: '1.5px solid #FDBA74',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: '#9A3412', fontWeight: 700 }}>
              {language === 'mr' ? 'उपलब्ध भांडवल:' : language === 'hi' ? 'उपलब्ध पूंजी:' : 'Available Capital:'}
            </div>
            <div className="num-font" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              ₹{(profile.ownCapital || 50000).toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: '#9A3412', fontWeight: 700 }}>
              {language === 'mr' ? 'स्थान:' : language === 'hi' ? 'स्थान:' : 'Location:'}
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {displayLocation}
            </div>
          </div>
        </div>
      )}

      {/* Offline Caching Banner */}
      {discoveryMeta.isOffline && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            marginBottom: '18px',
            fontSize: '0.82rem',
            color: '#1E40AF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} color="#2563EB" />
            <span>
              {language === 'mr'
                ? `💾 सेव्ह केलेली माहिती (${discoveryMeta.cachedDate || 'अद्ययावत'})`
                : language === 'hi'
                ? `💾 सहेजी गई स्थानीय जानकारी (${discoveryMeta.cachedDate || 'अपडेटेड'})`
                : `Showing saved local information from ${discoveryMeta.cachedDate || 'recent cache'}`}
            </span>
          </div>
          <button
            onClick={() => setRefreshIndex((prev) => prev + 1)}
            style={{
              background: 'none',
              border: 'none',
              color: '#1D4ED8',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RefreshCw size={14} />
            <span>{language === 'mr' ? 'रिफ्रेश' : language === 'hi' ? 'रिफ्रेश' : 'Refresh'}</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div
            className="animate-spin"
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #FDBA74',
              borderTopColor: '#EA580C',
              borderRadius: '50%',
              margin: '0 auto 16px'
            }}
          />
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
            {language === 'mr'
              ? 'स्थानिक कृषी व औद्योगिक डेटा विश्लेषित करत आहे...'
              : language === 'hi'
              ? 'स्थानीय कृषि व औद्योगिक डेटा का विश्लेषण हो रहा है...'
              : 'Analyzing local agricultural & industrial datasets...'}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            LGD, DC-MSME, DES Crop Statistics, ODOP, Udyam MSME Registry
          </p>
        </div>
      )}

      {/* Opportunities List */}
      {!loading && opportunities.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {opportunities.map((opp, idx) => {
            const isSelected = selectedOpportunity?.id === opp.id;
            const isExpanded = expandedCardId === opp.id;
            const title = opp.titleNative[language] || opp.titleNative.mr || opp.title;
            const whyText = opp.whyRecommended[language] || opp.whyRecommended.mr || opp.whyRecommended.en || '';

            return (
              <div
                key={opp.id}
                className="saathi-card"
                style={{
                  border: isSelected ? '2.5px solid var(--primary)' : '1px solid var(--border-medium)',
                  backgroundColor: isSelected ? '#FFFFFF' : 'var(--bg-card)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  position: 'relative'
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: idx === 0 ? '#FEF3C7' : idx === 1 ? '#E0E7FF' : 'var(--bg-app)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem'
                      }}
                    >
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '💡'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {opp.category}
                        </span>
                        {opp.dataGranularity && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              backgroundColor: '#F3F4F6',
                              borderRadius: '6px',
                              color: '#4B5563',
                              fontWeight: 600
                            }}
                          >
                            📍 {opp.dataGranularity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <DataTrustBadge
                    trustInfo={{
                      level: 'CALCULATED',
                      confidenceScore: opp.trustInfo?.confidenceScore || 90
                    }}
                  />
                </div>

                {/* 4 Score Metric Badges */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '6px',
                    backgroundColor: 'var(--bg-app)',
                    padding: '10px 8px',
                    borderRadius: '12px',
                    marginBottom: '14px'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {language === 'mr' ? 'संधी स्कोअर' : language === 'hi' ? 'अवसर स्कोर' : 'SAATHI Score'}
                    </div>
                    <div
                      className="num-font"
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 800,
                        color: opp.opportunityScore >= 85 ? 'var(--success)' : 'var(--primary)'
                      }}
                    >
                      {opp.opportunityScore}/100
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {language === 'mr' ? 'मागणी' : language === 'hi' ? 'मांग' : 'Demand'}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      {opp.demandLevel === 'HIGH' ? (language === 'mr' ? 'जास्त' : language === 'hi' ? 'उच्च' : 'High') : (language === 'mr' ? 'मध्यम' : language === 'hi' ? 'मध्यम' : 'Medium')}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {language === 'mr' ? 'स्पर्धा' : language === 'hi' ? 'प्रतिस्पर्धा' : 'Competition'}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: opp.competitionLevel === 'LOW' ? 'var(--success)' : 'var(--text-secondary)' }}>
                      {opp.competitionLevel === 'LOW' ? (language === 'mr' ? 'कमी' : language === 'hi' ? 'कम' : 'Low') : (language === 'mr' ? 'मध्यम' : language === 'hi' ? 'मध्यम' : 'Medium')}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {language === 'mr' ? 'भांडवल जुळणी' : language === 'hi' ? 'पूंजी मेल' : 'Capital Fit'}
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: opp.capitalFit === 'EXCELLENT' || opp.capitalFit === 'GOOD' ? 'var(--success)' : '#D97706'
                      }}
                    >
                      {opp.capitalFit === 'EXCELLENT' ? (language === 'mr' ? 'उत्तम' : language === 'hi' ? 'उत्कृष्ट' : 'Excellent') : (language === 'mr' ? 'योग्य' : language === 'hi' ? 'अनुकूल' : 'Good')}
                    </div>
                  </div>
                </div>

                {/* Primary Highlights Box */}
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#FFFBF5',
                    borderRadius: '12px',
                    border: '1px solid #FED7AA',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      💡 {language === 'mr' ? 'SAATHI ने हा व्यवसाय का निवडला?' : language === 'hi' ? 'SAATHI ने यह क्यों चुना?' : 'Why SAATHI Identified This:'}
                    </div>
                    <AudioExplainButton
                      id={`audio_why_${opp.id}`}
                      textToSpeak={whyText}
                      size="sm"
                    />
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {whyText}
                  </p>
                </div>

                {/* Financial Snapshot row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', padding: '0 4px' }}>
                  <span>
                    {language === 'mr' ? 'किमान सुरुवाती भांडवल:' : language === 'hi' ? 'शुरुआती पूंजी:' : 'Min Setup Capital:'}{' '}
                    <strong>₹{opp.minCapital.toLocaleString('en-IN')}</strong>
                  </span>
                  <span>
                    {language === 'mr' ? 'अंदाजित नफा:' : language === 'hi' ? 'अनुमानित लाभ:' : 'Est. Monthly Surplus:'}{' '}
                    <strong style={{ color: 'var(--success)' }}>₹{opp.estimatedMonthlySurplus.toLocaleString('en-IN')}/महिना</strong>
                  </span>
                </div>

                {/* Collapsible Deep Details Accordion */}
                <button
                  onClick={() => toggleExpand(opp.id)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                    marginBottom: '14px'
                  }}
                >
                  <span>
                    {isExpanded
                      ? (language === 'mr' ? 'तपशील लपवा' : language === 'hi' ? 'विवरण छुपाएं' : 'Hide Details')
                      : (language === 'mr' ? 'अधिकृत पुरावे, स्पर्धा व जोखीम विश्लेषण पाहा' : language === 'hi' ? 'सरकारी प्रमाण, प्रतिस्पर्धा व जोखिम देखें' : 'View Official Evidence, Competition & Risks')}
                  </span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Expanded Sections */}
                {isExpanded && (
                  <div
                    className="animate-fade-in"
                    style={{
                      padding: '12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      marginBottom: '14px',
                      fontSize: '0.82rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {/* 1. Official Evidence Package */}
                    {opp.evidencePackage && opp.evidencePackage.length > 0 && (
                      <div>
                        <div style={{ fontWeight: 800, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Database size={15} color="#2563EB" />
                          <span>{language === 'mr' ? 'स्थानिक अधिकृत डेटा पुरावे (Evidence Cited):' : language === 'hi' ? 'प्रमाणित सरकारी डेटा:' : 'Official Data Evidence Cited:'}</span>
                        </div>
                        <ul style={{ paddingLeft: '18px', margin: 0, color: '#475569', lineHeight: 1.4 }}>
                          {opp.evidencePackage.map((ev, i) => (
                            <li key={i} style={{ marginBottom: '3px' }}>
                              <strong>{ev.datasetName} ({ev.dataYear}):</strong> {ev.finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 2. Competition Reality (Udyam MSME) */}
                    {opp.competitionAnalysis && (
                      <div>
                        <div style={{ fontWeight: 800, color: '#1E293B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={15} color="#EA580C" />
                          <span>{language === 'mr' ? 'स्पर्धा वास्तव (Udyam MSME डेटा):' : language === 'hi' ? 'प्रतिस्पर्धा विश्लेषण:' : 'Competition Reality (Udyam Data):'}</span>
                        </div>
                        <p style={{ margin: 0, color: '#475569', lineHeight: 1.4 }}>
                          {opp.competitionAnalysis.statement}
                        </p>
                      </div>
                    )}

                    {/* 3. Skill Profile Notice */}
                    {opp.skillCompatibilityText && (
                      <div>
                        <div style={{ fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                          🎯 {language === 'mr' ? 'कौशल्य सुसंगतता:' : language === 'hi' ? 'कौशल अनुकूलता:' : 'Skill Compatibility:'}
                        </div>
                        <p style={{ margin: 0, color: '#475569' }}>
                          {opp.skillCompatibilityText[language] || opp.skillCompatibilityText.mr || opp.skillCompatibilityText.en}
                        </p>
                      </div>
                    )}

                    {/* 4. Major Risks */}
                    {opp.majorRisksList && (
                      <div>
                        <div style={{ fontWeight: 800, color: '#991B1B', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={15} color="#DC2626" />
                          <span>{language === 'mr' ? 'मुख्य धोके व दक्षता (Operational Risks):' : language === 'hi' ? 'मुख्य जोखिम व सावधानी:' : 'Main Operational Risks:'}</span>
                        </div>
                        <ul style={{ paddingLeft: '18px', margin: 0, color: '#7F1D1D', lineHeight: 1.4 }}>
                          {(opp.majorRisksList[language] || opp.majorRisksList.mr || opp.majorRisksList.en || []).map((risk, i) => (
                            <li key={i}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 5. First 3 Actions */}
                    {opp.first3ActionsList && (
                      <div>
                        <div style={{ fontWeight: 800, color: '#15803D', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={15} color="#16A34A" />
                          <span>{language === 'mr' ? 'सुरुवातीचे पहिले ३ टप्पे (First 3 Actions):' : language === 'hi' ? 'शुरुआती 3 कदम:' : 'First 3 Actionable Steps:'}</span>
                        </div>
                        <ol style={{ paddingLeft: '18px', margin: 0, color: '#166534', lineHeight: 1.4 }}>
                          {(opp.first3ActionsList[language] || opp.first3ActionsList.mr || opp.first3ActionsList.en || []).map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* Select or View Action */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {isSelected ? (
                    <button
                      disabled
                      style={{
                        width: '100%',
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        border: '1.5px solid #86EFAC',
                        borderRadius: '12px',
                        padding: '10px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={18} />
                      <span>{t.businessDiscovery.alreadySelected}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectBusiness(opp)}
                      className="btn-primary"
                      style={{ width: '100%', minHeight: '44px', borderRadius: '12px' }}
                    >
                      <span>{t.businessDiscovery.selectThisBusiness}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Next Step CTA */}
      <button
        onClick={() => onNavigate('/market-gap')}
        className="btn-primary"
        style={{ width: '100%', minHeight: '52px', fontSize: '1.05rem', borderRadius: '16px' }}
      >
        <span>{language === 'mr' ? 'बाजारपेठेतील संधी व Market Gap पाहा' : language === 'hi' ? 'मार्केट गैप और मांग विश्लेषण देखें' : 'View Market Gap & Demand Analysis'}</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
