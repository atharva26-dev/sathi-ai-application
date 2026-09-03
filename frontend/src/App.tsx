import React, { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useUser } from './context/UserContext';
import { useVoice } from './context/VoiceContext';
import { useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { VoiceRecorderModal } from './components/common/VoiceRecorderModal';
import { storageService } from './services/storageService';

// Screens
import { LanguageSelectScreen } from './screens/LanguageSelectScreen';
import { VoiceOnboardingFlow } from './screens/VoiceOnboardingFlow';
import { HomeScreen } from './screens/HomeScreen';
import { TalkToSaathiScreen } from './screens/TalkToSaathiScreen';
import { BusinessDiscoveryScreen } from './screens/BusinessDiscoveryScreen';
import { LocalMarketScreen } from './screens/LocalMarketScreen';
import { MarketGapScreen } from './screens/MarketGapScreen';
import { CompetitorMappingScreen } from './screens/CompetitorMappingScreen';
import { BusinessFeasibilityScreen } from './screens/BusinessFeasibilityScreen';
import { SWOTScreen } from './screens/SWOTScreen';
import { StressTestScreen } from './screens/StressTestScreen';
import { BusinessSimulatorScreen } from './screens/BusinessSimulatorScreen';
import { FinancialManagerScreen } from './screens/FinancialManagerScreen';
import { BudgetManagerScreen } from './screens/BudgetManagerScreen';
import { SchemeRouterScreen } from './screens/SchemeRouterScreen';
import { LoanEducationScreen } from './screens/LoanEducationScreen';
import { WorkingCapitalScreen } from './screens/WorkingCapitalScreen';
import { MarketingManagerScreen } from './screens/MarketingManagerScreen';
import { PricingStrategyScreen } from './screens/PricingStrategyScreen';
import { ExpansionPlannerScreen } from './screens/ExpansionPlannerScreen';
import { MentorRoadmapScreen } from './screens/MentorRoadmapScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const App: React.FC = () => {
  const { profile, loadDemoMode } = useUser();
  const { isAuthenticated } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  // Navigation state initialization
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    // Returning user with active session & completed onboarding -> go directly to dashboard
    if (isAuthenticated && profile.isOnboarded) {
      return '/home';
    }
    // Check if language was previously selected
    const savedLang = storageService.get<string | null>('preferred_language', null);
    if (!savedLang) {
      return '/language';
    }
    return '/onboarding';
  });

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceModalPrompt, setVoiceModalPrompt] = useState<string | undefined>(undefined);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Sync route whenever user completes onboarding or logs in
  useEffect(() => {
    if (isAuthenticated && profile.isOnboarded && (currentRoute === '/language' || currentRoute === '/onboarding' || currentRoute === '/auth')) {
      setCurrentRoute('/home');
    }
  }, [isAuthenticated, profile.isOnboarded, currentRoute]);

  // Auth/Onboarding Gate: Unauthenticated or non-onboarded users are routed to /language or /onboarding
  useEffect(() => {
    if ((!isAuthenticated || !profile.isOnboarded) && currentRoute !== '/language' && currentRoute !== '/onboarding') {
      setCurrentRoute('/onboarding');
    }
  }, [isAuthenticated, profile.isOnboarded, currentRoute]);

  // Sync route with bottom tabs
  const handleSelectTab = (tab: NavTab) => {
    if (!isAuthenticated || !profile.isOnboarded) {
      setCurrentRoute('/onboarding');
      return;
    }
    setActiveTab(tab);
    if (tab === 'home') setCurrentRoute('/home');
    else if (tab === 'myBusiness') setCurrentRoute('/feasibility');
    else if (tab === 'market') setCurrentRoute('/local-market');
    else if (tab === 'money') setCurrentRoute('/money-loan');
    else if (tab === 'profile') setCurrentRoute('/profile');
    else if (tab === 'talkSaathi') setCurrentRoute('/talk-saathi');
  };

  const navigateTo = (route: string) => {
    if ((!isAuthenticated || !profile.isOnboarded) && route !== '/language' && route !== '/onboarding') {
      setCurrentRoute('/onboarding');
      return;
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update bottom tab highlights
    if (route === '/home') setActiveTab('home');
    else if (route === '/feasibility' || route === '/swot' || route === '/business-discovery') setActiveTab('myBusiness');
    else if (route === '/local-market' || route === '/market-gap' || route === '/competitors') setActiveTab('market');
    else if (route === '/money-loan' || route === '/schemes' || route === '/emi' || route === '/budget' || route === '/working-capital') setActiveTab('money');
    else if (route === '/profile') setActiveTab('profile');
    else if (route === '/talk-saathi') setActiveTab('talkSaathi');
  };

  const handleOpenVoiceHero = (prompt?: string) => {
    setVoiceModalPrompt(prompt);
    setIsVoiceModalOpen(true);
  };

  const handleVoiceModalSend = (_text: string) => {
    navigateTo('/talk-saathi');
  };

  // 1. Language Selection (First Screen for new users)
  if (currentRoute === '/language') {
    return (
      <div className="app-container">
        <LanguageSelectScreen
          onLanguageConfirmed={() => {
            if (isAuthenticated && profile.isOnboarded) {
              setCurrentRoute('/home');
            } else {
              setCurrentRoute('/onboarding');
            }
          }}
        />
      </div>
    );
  }

  // 2. ONE UNIFIED VOICE + TEXT ONBOARDING PAGE
  if (currentRoute === '/onboarding' || (!isAuthenticated && currentRoute !== '/language') || (!profile.isOnboarded && currentRoute !== '/language')) {
    return (
      <div className="app-container">
        <VoiceOnboardingFlow
          onComplete={() => setCurrentRoute('/home')}
          onSkipToDemo={() => {
            loadDemoMode();
            setCurrentRoute('/home');
          }}
          onChangeLanguage={() => setCurrentRoute('/language')}
        />
      </div>
    );
  }

  // 3. Localized Header Title
  const getHeaderTitle = () => {
    switch (currentRoute) {
      case '/home':
        return `${t.common.appName} साथी`;
      case '/talk-saathi':
        return `${t.common.appName} ${t.navigation.talkSaathi}`;
      case '/business-discovery':
        return t.businessDiscovery.title;
      case '/local-market':
        return t.market.title;
      case '/market-gap':
        return t.marketGap.title;
      case '/competitors':
        return language === 'mr' ? 'स्पर्धक विश्लेषण' : language === 'hi' ? 'प्रतिस्पर्धी विश्लेषण' : 'Competitor Analysis';
      case '/feasibility':
        return t.feasibility.title;
      case '/swot':
        return t.swot.title;
      case '/stress-test':
        return t.stressTest.title;
      case '/simulator':
        return t.simulator.title;
      case '/money-loan':
        return t.finance.title;
      case '/budget':
        return t.finance.budgetAllocation;
      case '/schemes':
        return t.schemes.title;
      case '/emi':
        return t.emi.title;
      case '/working-capital':
        return t.finance.workingCapitalTitle;
      case '/marketing':
        return t.marketing.title;
      case '/pricing':
        return t.pricing.title;
      case '/expansion':
        return t.expansion.title;
      case '/mentor':
        return t.mentor.title;
      case '/profile':
        return t.profile.title;
      default:
        return t.common.appName;
    }
  };

  const isSubPage = currentRoute !== '/home';

  return (
    <div className="app-container">
      {/* Accessible Dynamic Header */}
      <Header
        title={getHeaderTitle()}
        showBack={isSubPage}
        onBack={() => navigateTo('/home')}
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
      />

      {/* Real-time Offline Status Notification */}
      <OfflineBanner />

      {/* Main Active Screen Router — 100% UNCHANGED DASHBOARD */}
      <main style={{ flex: 1 }}>
        {currentRoute === '/home' && (
          <HomeScreen
            onNavigate={navigateTo}
            onOpenVoiceHero={() => handleOpenVoiceHero()}
          />
        )}

        {currentRoute === '/talk-saathi' && (
          <TalkToSaathiScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/business-discovery' && (
          <BusinessDiscoveryScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/local-market' && (
          <LocalMarketScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/market-gap' && (
          <MarketGapScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/competitors' && (
          <CompetitorMappingScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/feasibility' && (
          <BusinessFeasibilityScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/swot' && (
          <SWOTScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/stress-test' && (
          <StressTestScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/simulator' && (
          <BusinessSimulatorScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/money-loan' && (
          <FinancialManagerScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/budget' && (
          <BudgetManagerScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/schemes' && (
          <SchemeRouterScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/emi' && (
          <LoanEducationScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/working-capital' && (
          <WorkingCapitalScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/marketing' && (
          <MarketingManagerScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/pricing' && (
          <PricingStrategyScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/expansion' && (
          <ExpansionPlannerScreen onNavigate={navigateTo} />
        )}

        {currentRoute === '/mentor' && (
          <MentorRoadmapScreen
            onNavigate={navigateTo}
            onAskSaathi={(_prompt) => {
              navigateTo('/talk-saathi');
            }}
          />
        )}

        {currentRoute === '/profile' && (
          <ProfileScreen
            onRestartOnboarding={() => setCurrentRoute('/onboarding')}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation with Central Voice Trigger */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenVoiceHero={() => handleOpenVoiceHero()}
      />

      {/* Global Interactive Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSendMessage={handleVoiceModalSend}
        initialPrompt={voiceModalPrompt}
        quickOptions={[
          language === 'mr' ? 'माझ्या गावात ग्राहक किती असतील?' : language === 'hi' ? 'मेरे गाँव में कितने ग्राहक होंगे?' : 'How many customers in my village?',
          language === 'mr' ? 'माझा मासिक हप्ता (EMI) किती असेल?' : language === 'hi' ? 'मेरी मासिक ईएमआई कितनी होगी?' : 'What will be my monthly EMI?',
          language === 'mr' ? 'PMEGP ३५% सबसिडी कशी मिळेल?' : language === 'hi' ? 'PMEGP ३५% सब्सिडी कैसे मिलेगी?' : 'How to get PMEGP 35% subsidy?',
          language === 'mr' ? 'विक्री ३०% घटली तर काय होईल?' : language === 'hi' ? 'बिक्री ३०% घटी तो क्या होगा?' : 'What if sales drop 30%?'
        ]}
      />

      {/* Quick Language Switcher Modal */}
      {isLangModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsLangModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', color: '#0F172A' }}>
              भाषा बदला / Change Language
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { code: 'mr', label: 'मराठी (Marathi)' },
                { code: 'hi', label: 'हिंदी (Hindi)' },
                { code: 'en', label: 'English' }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code as any);
                    setIsLangModalOpen(false);
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    backgroundColor: language === l.code ? 'rgba(194, 65, 12, 0.1)' : '#F8FAFC',
                    border: language === l.code ? '2px solid var(--primary, #C2410C)' : '1px solid #E2E8F0',
                    color: language === l.code ? 'var(--primary, #C2410C)' : '#0F172A',
                    fontWeight: 800,
                    fontSize: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsLangModalOpen(false)}
              className="btn-secondary"
              style={{ width: '100%', minHeight: '44px', marginTop: '16px', borderRadius: '12px', cursor: 'pointer' }}
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
