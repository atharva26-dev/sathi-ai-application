import React, { useState } from 'react';
import {
  Mic,
  Lightbulb,
  MapPin,
  Flame,
  TrendingUp,
  IndianRupee,
  Landmark,
  Calculator,
  Zap,
  Megaphone,
  Tag,
  Rocket,
  CheckSquare,
  Sparkles,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useVoice } from '../context/VoiceContext';
import { DataTrustBadge } from '../components/common/DataTrustBadge';
import { AudioExplainButton } from '../components/common/AudioExplainButton';
import { WhatMovesCard } from '../components/market/WhatMovesCard';

interface HomeScreenProps {
  onNavigate: (route: string) => void;
  onOpenVoiceHero: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenVoiceHero
}) => {
  const { t, language } = useLanguage();
  const { profile, selectedOpportunity } = useUser();
  const [showAllModules, setShowAllModules] = useState(false);

  const userName = profile.name ? profile.name.split(' ')[0] : (language === 'mr' ? 'उद्योजक मित्र' : language === 'hi' ? 'उद्यमी मित्र' : 'Entrepreneur');
  const userBiz = profile.desiredBusiness || selectedOpportunity?.title || (language === 'mr' ? 'सूक्ष्म उद्योग' : language === 'hi' ? 'सूक्ष्म उद्यम' : 'Micro-Enterprise');
  const userLoc = profile.village ? `${profile.village}, ${profile.block || ''}` : (language === 'mr' ? 'स्थानिक परिसर' : language === 'hi' ? 'स्थानीय क्षेत्र' : 'Local Area');

  const cap = profile.ownCapital || 50000;
  const estimatedSurplus = Math.round(cap * 0.35);

  const heroWelcomeVoiceText =
    language === 'mr'
      ? `नमस्कार ${userName}! आज तुमच्या '${userBiz}' व्यवसायासाठी काय करूया? नफा, कर्ज किंवा ग्राहकांबद्दल विचारण्यासाठी वरील माइक बटण दाबा.`
      : language === 'hi'
      ? `नमस्ते ${userName}! आज आपके '${userBiz}' व्यवसाय के लिए क्या करें? लाभ, ऋण या ग्राहकों के बारे में पूछने के लिए माइक बटन दबाएं।`
      : `Namaskar ${userName}! What shall we work on for your '${userBiz}' business today? Tap the mic button to ask anything about profit, loans, or customers.`;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '16px' }}>
      {/* Personalized Header */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {t.home.greeting.replace('{name}', userName)}
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {t.home.heroQuestion}
            </p>
          </div>

          <AudioExplainButton
            id="audio_home_welcome"
            textToSpeak={heroWelcomeVoiceText}
            size="sm"
          />
        </div>
      </div>

      {/* Primary Hero: 🎙️ TALK TO SAATHI */}
      <button
        onClick={onOpenVoiceHero}
        className="btn-voice-hero"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 22px',
          borderRadius: '24px',
          marginBottom: '20px',
          width: '100%',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Mic size={30} color="#FFFFFF" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              {t.home.talkHeroBtn}
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.9, fontWeight: 500 }}>
              {t.home.talkHeroSub}
            </div>
          </div>
        </div>

        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronRight size={22} color="#FFFFFF" />
        </div>
      </button>

      {/* Active Business Summary Card */}
      <div
        className="saathi-card"
        style={{
          padding: '16px',
          marginBottom: '24px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} color="var(--primary)" />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {userBiz}
            </span>
          </div>
          <DataTrustBadge trustInfo={{ level: 'CALCULATED', confidenceScore: 92 }} />
        </div>

        {/* 3 Metric Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div
            style={{
              padding: '10px 8px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.home.myCapital}
            </div>
            <div className="num-font" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '2px' }}>
              ₹{cap.toLocaleString('en-IN')}
            </div>
          </div>

          <div
            style={{
              padding: '10px 8px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {language === 'mr' ? 'अंदाजित नफा' : language === 'hi' ? 'अनुमानित लाभ' : 'Estimated Surplus'}
            </div>
            <div className="num-font" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--success)', marginTop: '2px' }}>
              ₹{estimatedSurplus.toLocaleString('en-IN')}
            </div>
          </div>

          <div
            style={{
              padding: '10px 8px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {language === 'mr' ? 'संधी स्कोअर' : language === 'hi' ? 'अवसर स्कोर' : 'Score'}
            </div>
            <div className="num-font" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '2px' }}>
              {selectedOpportunity?.opportunityScore ? `${selectedOpportunity.opportunityScore}/100` : '88/100'}
            </div>
          </div>
        </div>
      </div>

      {/* SAATHI Local Market Intelligence: What's Moving in Your Market */}
      <WhatMovesCard onNavigate={onNavigate} />

      {/* Main Action Grid */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
          {language === 'mr' ? 'महत्त्वाचे व्यवसाय टप्पे:' : language === 'hi' ? 'महत्वपूर्ण व्यावसायिक चरण:' : 'Key Business Modules:'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {/* 1. Market Gap Feature (🔥 Highlighted) */}
          <div
            onClick={() => onNavigate('/market-gap')}
            className="saathi-card saathi-card-interactive"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px',
              borderLeft: '5px solid #EA580C',
              backgroundColor: '#FFFBF5',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: '#FFEDD5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Flame size={24} color="#EA580C" />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t.home.actions.marketGap}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {t.home.actions.marketGapSub}
                </div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>

          {/* 2. Business Discovery */}
          <div
            onClick={() => onNavigate('/business-discovery')}
            className="saathi-card saathi-card-interactive"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Lightbulb size={24} color="#D97706" />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t.home.actions.findBusiness}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {t.home.actions.findBusinessSub}
                </div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>

          {/* 3. Local Market Radar Map */}
          <div
            onClick={() => onNavigate('/local-market')}
            className="saathi-card saathi-card-interactive"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: '#DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <MapPin size={24} color="#1D4ED8" />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t.home.actions.localMarket}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {t.home.actions.localMarketSub}
                </div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>

          {/* 4. Feasibility & SWOT */}
          <div
            onClick={() => onNavigate('/feasibility')}
            className="saathi-card saathi-card-interactive"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <TrendingUp size={24} color="#047857" />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t.home.actions.businessHealth}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {t.home.actions.businessHealthSub}
                </div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>

          {/* 5. Money & Loans (PS-91) */}
          <div
            onClick={() => onNavigate('/money-loan')}
            className="saathi-card saathi-card-interactive"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <IndianRupee size={24} color="#7C3AED" />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t.home.actions.moneyAndLoan}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {t.home.actions.moneyAndLoanSub}
                </div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>

          {/* 6. Government Schemes */}
          <div
            onClick={() => onNavigate('/schemes')}
            className="saathi-card saathi-card-interactive"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Landmark size={24} color="#B45309" />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t.home.actions.schemes}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {t.home.actions.schemesSub}
                </div>
              </div>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </div>

          {/* Secondary Collapsible Modules */}
          {showAllModules && (
            <>
              {/* 7. Profit Simulator */}
              <div
                onClick={() => onNavigate('/simulator')}
                className="saathi-card saathi-card-interactive animate-fade-in"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calculator size={24} color="#4338CA" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {t.home.actions.simulator}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {t.home.actions.simulatorSub}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>

              {/* 8. Stress Test */}
              <div
                onClick={() => onNavigate('/stress-test')}
                className="saathi-card saathi-card-interactive animate-fade-in"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={24} color="#DC2626" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {t.home.actions.stressTest}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {t.home.actions.stressTestSub}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>

              {/* 9. Marketing & Customers */}
              <div
                onClick={() => onNavigate('/marketing')}
                className="saathi-card saathi-card-interactive animate-fade-in"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Megaphone size={24} color="#EA580C" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {t.home.actions.customers}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {t.home.actions.customersSub}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>

              {/* 10. Pricing */}
              <div
                onClick={() => onNavigate('/pricing')}
                className="saathi-card saathi-card-interactive animate-fade-in"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Tag size={24} color="#0F766E" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {t.home.actions.pricing}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {t.home.actions.pricingSub}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>

              {/* 11. Expansion Planner */}
              <div
                onClick={() => onNavigate('/expansion')}
                className="saathi-card saathi-card-interactive animate-fade-in"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Rocket size={24} color="#6D28D9" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {t.home.actions.expansion}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {t.home.actions.expansionSub}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>

              {/* 12. Mentor Tasks */}
              <div
                onClick={() => onNavigate('/mentor')}
                className="saathi-card saathi-card-interactive animate-fade-in"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckSquare size={24} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {t.home.actions.mentorRoadmap}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {t.home.actions.mentorRoadmapSub}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>
            </>
          )}

          {/* Toggle More / Less Button */}
          <button
            onClick={() => setShowAllModules(!showAllModules)}
            className="btn-secondary"
            style={{ width: '100%', minHeight: '48px', marginTop: '6px', cursor: 'pointer' }}
          >
            <span>{showAllModules ? (language === 'mr' ? 'कमी मॉड्यूल्स दाखवा' : language === 'hi' ? 'कम मॉड्यूल देखें' : 'Show Fewer Modules') : (language === 'mr' ? 'सर्व १२ मॉड्यूल्स पाहा (See All)' : language === 'hi' ? 'सभी १२ मॉड्यूल देखें (See All)' : 'Explore All 12 Modules (See All)')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
