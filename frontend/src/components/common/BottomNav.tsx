import React from 'react';
import { Home, TrendingUp, MapPin, IndianRupee, User, Mic } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type NavTab = 'home' | 'myBusiness' | 'market' | 'money' | 'profile' | 'talkSaathi';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenVoiceHero: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenVoiceHero
}) => {
  const { t } = useLanguage();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 'var(--max-content-width)',
        margin: '0 auto',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-medium)',
        boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.08)',
        zIndex: 200,
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px'
      }}
      aria-label="मुख्य नेव्हिगेशन मेनू"
    >
      {/* 1. Home */}
      <button
        onClick={() => onSelectTab('home')}
        style={{
          flex: 1,
          flexDirection: 'column',
          gap: '4px',
          color: activeTab === 'home' ? 'var(--primary)' : 'var(--text-muted)',
          padding: '6px 0',
          position: 'relative'
        }}
      >
        <Home size={22} strokeWidth={activeTab === 'home' ? 2.6 : 1.8} />
        <span style={{ fontSize: '0.74rem', fontWeight: activeTab === 'home' ? 800 : 500 }}>
          {t.navigation.home}
        </span>
        {activeTab === 'home' && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              width: '16px',
              height: '3px',
              backgroundColor: 'var(--primary)',
              borderRadius: '2px'
            }}
          />
        )}
      </button>

      {/* 2. My Business */}
      <button
        onClick={() => onSelectTab('myBusiness')}
        style={{
          flex: 1,
          flexDirection: 'column',
          gap: '4px',
          color: activeTab === 'myBusiness' ? 'var(--primary)' : 'var(--text-muted)',
          padding: '6px 0',
          position: 'relative'
        }}
      >
        <TrendingUp size={22} strokeWidth={activeTab === 'myBusiness' ? 2.6 : 1.8} />
        <span style={{ fontSize: '0.74rem', fontWeight: activeTab === 'myBusiness' ? 800 : 500 }}>
          {t.navigation.myBusiness}
        </span>
        {activeTab === 'myBusiness' && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              width: '16px',
              height: '3px',
              backgroundColor: 'var(--primary)',
              borderRadius: '2px'
            }}
          />
        )}
      </button>

      {/* 3. Central Voice Hero Button (🎙️ SAATHI) */}
      <div style={{ position: 'relative', top: '-14px', flex: 1, display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={onOpenVoiceHero}
          aria-label="SAATHI शी बोला - व्हॉईस असिस्टंट"
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 50%, #9A3412 100%)',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(194, 65, 12, 0.45)',
            border: '3px solid var(--bg-app)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1px'
          }}
        >
          <Mic size={24} />
          <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.02em' }}>साथी</span>
        </button>
      </div>

      {/* 4. Local Market */}
      <button
        onClick={() => onSelectTab('market')}
        style={{
          flex: 1,
          flexDirection: 'column',
          gap: '4px',
          color: activeTab === 'market' ? 'var(--primary)' : 'var(--text-muted)',
          padding: '6px 0',
          position: 'relative'
        }}
      >
        <MapPin size={22} strokeWidth={activeTab === 'market' ? 2.6 : 1.8} />
        <span style={{ fontSize: '0.74rem', fontWeight: activeTab === 'market' ? 800 : 500 }}>
          {t.navigation.market}
        </span>
        {activeTab === 'market' && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              width: '16px',
              height: '3px',
              backgroundColor: 'var(--primary)',
              borderRadius: '2px'
            }}
          />
        )}
      </button>

      {/* 5. Money & Loans */}
      <button
        onClick={() => onSelectTab('money')}
        style={{
          flex: 1,
          flexDirection: 'column',
          gap: '4px',
          color: activeTab === 'money' ? 'var(--primary)' : 'var(--text-muted)',
          padding: '6px 0',
          position: 'relative'
        }}
      >
        <IndianRupee size={22} strokeWidth={activeTab === 'money' ? 2.6 : 1.8} />
        <span style={{ fontSize: '0.74rem', fontWeight: activeTab === 'money' ? 800 : 500 }}>
          {t.navigation.money}
        </span>
        {activeTab === 'money' && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              width: '16px',
              height: '3px',
              backgroundColor: 'var(--primary)',
              borderRadius: '2px'
            }}
          />
        )}
      </button>

      {/* 6. Profile */}
      <button
        onClick={() => onSelectTab('profile')}
        style={{
          flex: 1,
          flexDirection: 'column',
          gap: '4px',
          color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
          padding: '6px 0',
          position: 'relative'
        }}
      >
        <User size={22} strokeWidth={activeTab === 'profile' ? 2.6 : 1.8} />
        <span style={{ fontSize: '0.74rem', fontWeight: activeTab === 'profile' ? 800 : 500 }}>
          {t.navigation.profile}
        </span>
        {activeTab === 'profile' && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              width: '16px',
              height: '3px',
              backgroundColor: 'var(--primary)',
              borderRadius: '2px'
            }}
          />
        )}
      </button>
    </nav>
  );
};
