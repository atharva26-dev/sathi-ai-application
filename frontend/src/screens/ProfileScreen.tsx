import React, { useState } from 'react';
import {
  User,
  Globe,
  Sliders,
  Wifi,
  RefreshCw,
  Trash2,
  Sparkles,
  Save,
  MapPin,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  LogOut,
  Phone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useAccessibility, FontScale } from '../context/AccessibilityContext';
import { useOffline } from '../context/OfflineContext';
import { supportedLanguages } from '../locales';
import { CascadingLocationPicker } from '../components/location/CascadingLocationPicker';
import { LocationDetails } from '../types';
import { storageService } from '../services/storageService';

interface ProfileScreenProps {
  onRestartOnboarding: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onRestartOnboarding }) => {
  const { t, language, setLanguage } = useLanguage();
  const { profile, updateProfile, loadDemoMode, resetAllData } = useUser();
  const { activeMobile, logout } = useAuth();
  const { fontScale, setFontScale, highContrast, setHighContrast, reducedMotion, setReducedMotion } =
    useAccessibility();
  const { isOnline, isSyncing, queuedActionsCount, triggerManualSync } = useOffline();

  const [nameInput, setNameInput] = useState(profile.name || '');
  const [villageInput, setVillageInput] = useState(profile.village || '');
  const [blockInput, setBlockInput] = useState(profile.block || '');
  const [districtInput, setDistrictInput] = useState(profile.district || 'Pune');
  const [stateInput, setStateInput] = useState(profile.state || 'Maharashtra');
  const [locationDetails, setLocationDetails] = useState<LocationDetails | undefined>(profile.locationDetails);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [businessInput, setBusinessInput] = useState(profile.desiredBusiness || '');
  const [capitalInput, setCapitalInput] = useState((profile.ownCapital || 50000).toString());
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSave = () => {
    updateProfile({
      name: nameInput,
      village: villageInput,
      block: blockInput,
      district: districtInput,
      state: stateInput,
      locationDetails,
      desiredBusiness: businessInput,
      ownCapital: parseInt(capitalInput, 10) || 50000
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="screen-content animate-fade-in">
      {/* Title */}
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {t.profile.title}
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {language === 'mr'
            ? 'तुमची वैयक्तिक माहिती, व्यवसाय स्थान आणि वापर सुलभता पर्याय'
            : language === 'hi'
            ? 'आपकी व्यक्तिगत जानकारी, व्यावसायिक स्थान और पहुँच विकल्प'
            : 'Your enterprise details, canonical location, and accessibility settings'}
        </p>
      </div>

      {/* Account & PIN Security Card */}
      <div
        className="saathi-card"
        style={{
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          marginBottom: '20px',
          border: '1.5px solid rgba(22, 163, 74, 0.3)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Phone size={22} color="#16A34A" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  +91 {profile.mobile || activeMobile || '9822345678'}
                </strong>
                <span
                  style={{
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    color: '#166534',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ShieldCheck size={12} />
                  {language === 'mr' ? 'पिन सुरक्षित' : language === 'hi' ? 'पिन सुरक्षित' : 'PIN Verified'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {language === 'mr'
                  ? 'या मोबाईलचे स्वतंत्र व सुरक्षित खाते'
                  : language === 'hi'
                  ? 'इस मोबाइल का स्वतंत्र व सुरक्षित खाता'
                  : 'Isolated User Account for this Mobile'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              onRestartOnboarding();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FECACA',
              color: '#DC2626',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} />
            <span>{language === 'mr' ? 'खाते बदला / लॉगआउट' : language === 'hi' ? 'खाता बदलें / लॉगआउट' : 'Switch / Logout'}</span>
          </button>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="saathi-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <User size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.profile.personalDetails}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {language === 'mr' ? 'पूर्ण नाव:' : language === 'hi' ? 'पूरा नाम:' : 'Full Name:'}
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-medium)',
                marginTop: '4px',
                fontFamily: 'inherit',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {language === 'mr' ? 'व्यवसाय / उद्योग:' : language === 'hi' ? 'व्यवसाय / उद्योग:' : 'Business / Enterprise:'}
            </label>
            <input
              type="text"
              value={businessInput}
              onChange={(e) => setBusinessInput(e.target.value)}
              placeholder="e.g. Tailoring, Mobile Repair, Grocery, Dairy..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-medium)',
                marginTop: '4px',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                fontWeight: 700
              }}
            />
          </div>

          {/* Cascading Location Choice System */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={18} color="var(--primary)" />
                <label style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {language === 'mr' ? 'व्यवसायाचे अधिकृत ठिकाण:' : language === 'hi' ? 'व्यवसाय का आधिकारिक स्थान:' : 'Business Location (Canonical):'}
                </label>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(!isPickerOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--primary)',
                  backgroundColor: isPickerOpen ? 'var(--primary)' : '#FFFFFF',
                  color: isPickerOpen ? '#FFFFFF' : 'var(--primary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {isPickerOpen ? (
                  <>
                    <ChevronUp size={14} />
                    {language === 'mr' ? 'बंद करा' : language === 'hi' ? 'बंद करें' : 'Close'}
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    {language === 'mr' ? 'ठिकाण बदला' : language === 'hi' ? 'स्थान बदलें' : 'Change Location'}
                  </>
                )}
              </button>
            </div>

            {/* Clear Selected Location Display Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginTop: '10px'
              }}
            >
              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 600 }}>
                  {language === 'mr' ? 'गाव / शहर:' : language === 'hi' ? 'गांव / नगर:' : 'Village / Town:'}
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                  {villageInput || '—'}
                </span>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 600 }}>
                  {language === 'mr' ? 'तालुका / ब्लॉक:' : language === 'hi' ? 'तहसील / ब्लॉक:' : 'Taluka / Block:'}
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                  {blockInput || '—'}
                </span>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 600 }}>
                  {language === 'mr' ? 'जिल्हा:' : language === 'hi' ? 'जिला:' : 'District:'}
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                  {districtInput || '—'}
                </span>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 600 }}>
                  {language === 'mr' ? 'राज्य:' : language === 'hi' ? 'राज्य:' : 'State:'}
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                  {stateInput || '—'}
                </span>
              </div>
            </div>

            {/* Embedded Cascading Location Picker if opened */}
            {isPickerOpen && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <CascadingLocationPicker
                  initialLocation={{
                    state: stateInput,
                    district: districtInput,
                    block: blockInput,
                    village: villageInput
                  }}
                  onLocationSelected={(loc: LocationDetails) => {
                    setVillageInput(loc.village_name);
                    setBlockInput(loc.subdistrict_name);
                    setDistrictInput(loc.district_name);
                    setStateInput(loc.state_name);
                    setLocationDetails(loc);
                    setIsPickerOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {language === 'mr' ? 'उपलब्ध स्वतःचे भांडवल (₹):' : language === 'hi' ? 'उपलब्ध अपनी पूंजी (₹):' : 'Available Own Capital (₹):'}
            </label>
            <input
              type="number"
              value={capitalInput}
              onChange={(e) => setCapitalInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-medium)',
                marginTop: '4px',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                fontWeight: 700
              }}
            />
          </div>

          <button
            onClick={handleSave}
            className="btn-primary"
            style={{
              width: '100%',
              minHeight: '46px',
              marginTop: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Save size={18} />
            {language === 'mr' ? 'माहिती सेव्ह करा' : language === 'hi' ? 'जानकारी सहेजें' : 'Save Details'}
          </button>

          {isSavedNotice && (
            <div
              className="animate-fade-in"
              style={{
                padding: '10px',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                border: '1px solid #16A34A',
                borderRadius: '8px',
                color: '#166534',
                fontSize: '0.88rem',
                fontWeight: 700,
                textAlign: 'center'
              }}
            >
              ✓ {language === 'mr' ? 'माहिती यशस्वीरित्या जतन केली!' : language === 'hi' ? 'जानकारी सफलतापूर्वक सहेजी गई!' : 'Details saved successfully!'}
            </div>
          )}
        </div>
      </div>

      {/* Language Preferences Card */}
      <div className="saathi-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Globe size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {language === 'mr' ? 'भाषा पर्याय' : language === 'hi' ? 'भाषा विकल्प' : 'Language Preferences'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
          {supportedLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                style={{
                  padding: '12px 10px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border-medium)',
                  backgroundColor: isSelected ? 'rgba(194, 65, 12, 0.08)' : '#FFFFFF',
                  color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{lang.nativeLabel}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessibility Controls Card */}
      <div className="saathi-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Sliders size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.profile.accessibility}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Font scale selector */}
          <div>
            <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              {t.profile.fontSize}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['normal', 'large', 'xlarge'] as FontScale[]).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setFontScale(scale)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: fontScale === scale ? '2px solid var(--primary)' : '1px solid #CBD5E1',
                    backgroundColor: fontScale === scale ? 'rgba(194, 65, 12, 0.08)' : '#FFFFFF',
                    color: fontScale === scale ? 'var(--primary)' : '#475569',
                    fontWeight: 700,
                    fontSize: scale === 'normal' ? '0.85rem' : scale === 'large' ? '1rem' : '1.15rem',
                    cursor: 'pointer'
                  }}
                >
                  {scale === 'normal'
                    ? (language === 'mr' ? 'सामान्य' : 'Normal')
                    : scale === 'large'
                    ? (language === 'mr' ? 'मोठा' : 'Large')
                    : (language === 'mr' ? 'खूप मोठा' : 'Extra Large')}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                {t.profile.highContrast}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {language === 'mr' ? 'वाचण्यास अधिक ठळक व सोपे' : 'High contrast mode'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Reduced Motion Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                {t.profile.reducedMotion}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {language === 'mr' ? 'स्क्रीनवरील अनावश्यक हालचाली थांबवा' : 'Reduce animations'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Offline Status & Sync Card */}
      <div className="saathi-card" style={{ padding: '20px', backgroundColor: '#FFFFFF', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Wifi size={20} color={isOnline ? '#16A34A' : '#DC2626'} />
          <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.profile.offlineSync}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: isOnline ? '#16A34A' : '#DC2626' }}>
              {isOnline ? '● Online (इंटरनेट सुरू आहे)' : '● Offline (इंटरनेट बंद आहे)'}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              {queuedActionsCount > 0
                ? `${queuedActionsCount} बदल सिंक होणे बाकी आहे`
                : 'सर्व डेटा क्लाउडवर सुरक्षित व सिंक आहे'}
            </span>
          </div>

          <button
            onClick={triggerManualSync}
            disabled={!isOnline || isSyncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-medium)',
              backgroundColor: '#FFFFFF',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: isOnline && !isSyncing ? 'pointer' : 'not-allowed',
              opacity: isOnline && !isSyncing ? 1 : 0.6
            }}
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'सिंक होत आहे...' : 'आताच सिंक करा'}
          </button>
        </div>
      </div>

      {/* System Actions (Demo Mode & Reset) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <button
          onClick={loadDemoMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            minHeight: '44px',
            borderRadius: '12px',
            border: '1.5px solid var(--primary)',
            backgroundColor: 'rgba(194, 65, 12, 0.05)',
            color: 'var(--primary)',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={18} />
          {t.profile.loadDemo}
        </button>

        <button
          onClick={onRestartOnboarding}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            minHeight: '44px',
            borderRadius: '12px',
            border: '1px solid var(--border-medium)',
            backgroundColor: '#FFFFFF',
            color: 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} />
          {language === 'mr' ? 'पुन्हा नोंदणी करा' : language === 'hi' ? 'पुनः पंजीकरण' : 'Redo Onboarding'}
        </button>

        <button
          onClick={() => {
            const confirmed = window.confirm(
              language === 'mr'
                ? 'या मोबाईल खात्याची सर्व माहिती पूर्णपणे हटवायची आहे का?'
                : language === 'hi'
                ? 'क्या आप इस मोबाइल खाते का सारा डेटा हटाना चाहते हैं?'
                : 'Are you sure you want to completely erase all data for this mobile account?'
            );
            if (confirmed) {
              storageService.clearUserData(activeMobile || profile.mobile);
              resetAllData();
              logout();
              onRestartOnboarding();
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            minHeight: '44px',
            borderRadius: '12px',
            border: '1px solid #FCA5A5',
            backgroundColor: 'rgba(239, 68, 68, 0.06)',
            color: '#DC2626',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          <Trash2 size={16} />
          {t.profile.clearData}
        </button>
      </div>
    </div>
  );
};
