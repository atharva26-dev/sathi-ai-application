import React, { useState } from 'react';
import {
  Lock,
  Phone,
  User,
  MapPin,
  IndianRupee,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Activity,
  Zap,
  CloudRain
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { CascadingLocationPicker } from '../components/location/CascadingLocationPicker';
import { InlineCascadingLocationSelector } from '../components/location/InlineCascadingLocationSelector';
import { LocationDetails } from '../types';

interface AuthScreenProps {
  onAuthSuccess: () => void;
  onChangeLanguage: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  onChangeLanguage
}) => {
  const { language } = useLanguage();
  const { login, register, isLoading } = useAuth();
  const { updateProfile } = useUser();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [fullName, setFullName] = useState('');
  const [village, setVillage] = useState('Palus');
  const [district, setDistrict] = useState('Sangli');
  const [stateName, setStateName] = useState('Maharashtra');
  const [block, setBlock] = useState('Palus');
  const [pincode, setPincode] = useState('416310');
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [showFullGridPicker, setShowFullGridPicker] = useState(false);
  const [ownCapital, setOwnCapital] = useState('250000');
  const [desiredBusiness, setDesiredBusiness] = useState('Mobile & Electronics Repair');
  const [riskAppetite, setRiskAppetite] = useState<'CONSERVATIVE' | 'MODERATE' | 'GROWTH'>('MODERATE');
  const [showWhyAiModal, setShowWhyAiModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!mobile || mobile.length < 10) {
      setErrorMsg(language === 'en' ? 'Please enter valid 10-digit mobile number' : 'कृपया वैध १० अंकी मोबाईल नंबर टाका');
      return;
    }
    if (!pin || pin.length < 4) {
      setErrorMsg(language === 'en' ? 'Please enter 4-digit security PIN' : 'कृपया ४ अंकी सुरक्षा पिन टाका');
      return;
    }

    const res = await login(mobile, pin);
    if (res.success && res.profile) {
      updateProfile({
        ...res.profile,
        village: village || res.profile.village || 'Palus',
        district: district || res.profile.district || 'Sangli',
        block: block || res.profile.block || 'Palus',
        state: stateName || res.profile.state || 'Maharashtra',
        pincode: pincode || res.profile.pincode || '416310',
        riskAppetite,
        desiredBusiness: desiredBusiness || res.profile.desiredBusiness || 'Mobile & Electronics Repair',
        ownCapital: parseInt(ownCapital, 10) || res.profile.ownCapital || 250000
      });
      onAuthSuccess();
    } else {
      setErrorMsg(res.error || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg(language === 'en' ? 'Please enter your full name' : 'कृपया आपले पूर्ण नाव टाका');
      return;
    }
    if (!mobile || mobile.length < 10) {
      setErrorMsg(language === 'en' ? 'Please enter valid 10-digit mobile number' : 'कृपया वैध १० अंकी मोबाईल नंबर टाका');
      return;
    }
    if (!pin || pin.length < 4) {
      setErrorMsg(language === 'en' ? 'Please enter 4-digit PIN' : 'कृपया ४ अंकी पिन तयार करा');
      return;
    }

    const res = await register({
      fullName,
      mobile,
      pin,
      village: village || 'Palus',
      district: district || 'Sangli',
      block: block || 'Palus',
      state: stateName || 'Maharashtra',
      pincode: pincode || '416310',
      ownCapital: parseInt(ownCapital, 10) || 250000,
      desiredBusiness: desiredBusiness || 'Mobile & Electronics Repair',
      riskAppetite,
      preferredLanguage: language
    } as any);

    if (res.success && res.profile) {
      updateProfile({
        ...res.profile,
        riskAppetite
      });
      onAuthSuccess();
    } else {
      setErrorMsg(res.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-screen-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app, #f8fafc)', padding: '1.25rem 1rem' }}>
      {/* Top Bar with Language Switch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', maxWidth: '480px', width: '100%', margin: '0 auto 1rem auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', borderRadius: '10px', padding: '0.5rem', display: 'flex' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary, #0f172a)' }}>साथी (SAATHI)</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', margin: 0 }}>
              {language === 'en' ? 'Rural Business & Financial Mentor' : 'ग्रामीण व्यवसाय व वित्तीय मार्गदर्शक'}
            </p>
          </div>
        </div>
        <button
          onClick={onChangeLanguage}
          style={{
            background: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '20px',
            padding: '0.35rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--primary, #2563eb)',
            cursor: 'pointer'
          }}
        >
          🌐 {language.toUpperCase()}
        </button>
      </div>

      {/* WHY AI ASSISTANT IS NEEDED AT START - HIGH IMPACT VALUE SHOWCASE */}
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          margin: '0 auto 1.25rem auto',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '1.2rem',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
            <AlertTriangle size={13} />
            {language === 'en' ? '70% RURAL BUSINESSES FAIL IN 18 MOS' : '७०% ग्रामीण व्यवसाय १८ महिन्यांत बंद पडतात'}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>RAG Pipeline v3.0</span>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#f8fafc', lineHeight: 1.35 }}>
          {language === 'en'
            ? 'Why You Need SAATHI AI Before Spending Any Money'
            : 'भांडवल गुंतवण्यापूर्वी साथी AI सहाय्यक का आवश्यक आहे?'}
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45, margin: '0 0 0.85rem 0' }}>
          {language === 'en'
            ? 'Most rural enterprises fail due to unverified local demand, power/road mismatches, and debt traps. SAATHI tests 20 official village parameters and 2026 monsoon rainfall first.'
            : 'सामान्यतः ग्रामीण व्यवसाय ऐकीव माहितीवर सुरू केल्याने वीज तुटवडा, गिऱ्हाईक नसणे व सावकारी कर्जात अडकतात. साथी AI तुमच्या गावाच्या २० अधिकृत घटकांचे विश्लेषण करून खरी व्यवहार्यता सांगते.'}
        </p>

        {/* 3 Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '0.75rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#38bdf8', marginBottom: '2px', display: 'flex', justifyContent: 'center' }}>
              <Compass size={18} />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9' }}>
              {language === 'en' ? 'Village Reality' : 'ग्राम वास्तव'}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
              {language === 'en' ? '20 Parameters' : '२० निकष तपासणी'}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#facc15', marginBottom: '2px', display: 'flex', justifyContent: 'center' }}>
              <CloudRain size={18} />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9' }}>
              {language === 'en' ? 'Climate & Rain' : 'पाऊस व हवामान'}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
              {language === 'en' ? '2026 Monsoon' : '२०२६ पर्जन्यमान'}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#4ade80', marginBottom: '2px', display: 'flex', justifyContent: 'center' }}>
              <ShieldCheck size={18} />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9' }}>
              {language === 'en' ? 'Safe Finance' : 'सुरक्षित वित्त'}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
              {language === 'en' ? '35% Subsidy' : '३५% सबसिडी'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div
        style={{
          background: 'var(--card-bg, #ffffff)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid var(--border-color, #e2e8f0)',
          maxWidth: '460px',
          width: '100%',
          margin: '0 auto'
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color, #e2e8f0)', marginBottom: '1.5rem' }}>
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'login' ? '3px solid #2563eb' : 'none',
              color: tab === 'login' ? '#2563eb' : '#64748b',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            {language === 'en' ? 'Login' : language === 'hi' ? 'लॉगिन' : 'लॉगिन (Login)'}
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'register' ? '3px solid #2563eb' : 'none',
              color: tab === 'register' ? '#2563eb' : '#64748b',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            {language === 'en' ? 'Register' : language === 'hi' ? 'नई नोंदणी' : 'नवीन नोंदणी (Register)'}
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {language === 'en' ? 'Mobile Number' : 'मोबाईल नंबर'}
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98XXXXXXXX"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                <KeyRound size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {language === 'en' ? '4-Digit PIN' : '४-अंकी सुरक्षा पिन'}
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.25rem', letterSpacing: '4px' }}
                required
              />
            </div>

            {/* Business Location Selector for Login (State -> District -> Sub-District -> Village + PIN) */}
            <div style={{ margin: '0.25rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#EA580C" />
                  {language === 'en' ? 'Business Location' : 'व्यवसायाचे स्थान'}
                </label>
                <button
                  type="button"
                  onClick={() => setIsSelectingLocation(!isSelectingLocation)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EA580C',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {isSelectingLocation
                    ? (language === 'en' ? 'Hide Selector ▲' : 'लपवा ▲')
                    : (language === 'en' ? 'Change Location ➔' : 'स्थान बदला ➔')}
                </button>
              </div>

              {isSelectingLocation ? (
                <InlineCascadingLocationSelector
                  initialState={stateName}
                  initialDistrict={district}
                  initialSubDistrict={block}
                  initialVillage={village}
                  initialPincode={pincode}
                  onLocationChange={(loc) => {
                    setStateName(loc.state);
                    setDistrict(loc.district);
                    setBlock(loc.subDistrict);
                    setVillage(loc.village);
                    setPincode(loc.pincode);
                  }}
                />
              ) : (
                <div
                  onClick={() => setIsSelectingLocation(true)}
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#EA580C" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                      {village || 'Palus'}, {block || 'Palus'} ({district || 'Sangli'}, {stateName || 'Maharashtra'})
                    </span>
                  </div>
                  {pincode && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '1px 6px', borderRadius: '4px' }}>
                      PIN: {pincode}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Risk Appetite / Profile Selector for Login */}
            <div style={{ margin: '0.4rem 0' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                <Activity size={14} style={{ display: 'inline', marginRight: '4px', color: '#6366f1' }} />
                {language === 'en' ? 'Risk Appetite & Business Strategy' : 'जोखीम क्षमता व रणनीती (Risk Strategy)'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setRiskAppetite('CONSERVATIVE')}
                  style={{
                    padding: '0.45rem 0.2rem',
                    borderRadius: '8px',
                    border: riskAppetite === 'CONSERVATIVE' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    backgroundColor: riskAppetite === 'CONSERVATIVE' ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: riskAppetite === 'CONSERVATIVE' ? '#15803d' : '#334155' }}>
                    🛡️ {language === 'en' ? 'Low Risk' : 'कमी जोखीम'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                    {language === 'en' ? 'Safe Return' : 'सुरक्षित नफा'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRiskAppetite('MODERATE')}
                  style={{
                    padding: '0.45rem 0.2rem',
                    borderRadius: '8px',
                    border: riskAppetite === 'MODERATE' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: riskAppetite === 'MODERATE' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: riskAppetite === 'MODERATE' ? '#1d4ed8' : '#334155' }}>
                    ⚖️ {language === 'en' ? 'Moderate' : 'संतुलित'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                    {language === 'en' ? 'Balanced' : 'मध्यम नफा'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRiskAppetite('GROWTH')}
                  style={{
                    padding: '0.45rem 0.2rem',
                    borderRadius: '8px',
                    border: riskAppetite === 'GROWTH' ? '2px solid #d97706' : '1px solid #cbd5e1',
                    backgroundColor: riskAppetite === 'GROWTH' ? '#fffbeb' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: riskAppetite === 'GROWTH' ? '#b45309' : '#334155' }}>
                    🚀 {language === 'en' ? 'Growth' : 'उच्च वाढ'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                    {language === 'en' ? 'Higher Scale' : 'विस्तार'}
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? '...' : (language === 'en' ? 'Secure Login' : 'सुरक्षित लॉगिन करा')}
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {language === 'en' ? 'Full Name' : 'पूर्ण नाव'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Ramesh Patil' : 'उदा. रमेश पाटील'}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {language === 'en' ? 'Mobile' : 'मोबाईल'}
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98XXXXXXXX"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  <KeyRound size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {language === 'en' ? '4-Digit PIN' : '४-अंकी पिन'}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', letterSpacing: '2px' }}
                  required
                />
              </div>
            </div>

            {/* Business Location Selector (Cascading State -> District -> Taluka -> Village + PIN) */}
            <div style={{ margin: '0.25rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={15} color="#EA580C" />
                  {language === 'en' ? 'Business Location' : 'व्यवसायाचे स्थान (राज्य → जिल्हा → तालुका → गाव)'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowFullGridPicker(!showFullGridPicker)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EA580C',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showFullGridPicker
                    ? (language === 'en' ? 'Use Dropdowns ▲' : 'ड्रॉपडाउन निवडा ▲')
                    : (language === 'en' ? 'Full Grid Mode ➔' : 'मोठ्या ग्रिडमध्ये निवडा ➔')}
                </button>
              </div>

              {showFullGridPicker ? (
                <div style={{
                  border: '1.5px solid #EA580C',
                  borderRadius: '12px',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#EA580C' }}>
                      {language === 'en' ? 'All-India Location Selector' : 'अखिल भारतीय स्थान निवडा (राज्य → जिल्हा → तालुका → गाव)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFullGridPicker(false)}
                      style={{
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      {language === 'en' ? 'Close' : 'बंद करा'}
                    </button>
                  </div>
                  <CascadingLocationPicker
                    initialLocation={{
                      state: stateName,
                      district,
                      block,
                      village
                    }}
                    onLocationSelected={(loc: LocationDetails) => {
                      setVillage(loc.village_name);
                      setDistrict(loc.district_name);
                      setStateName(loc.state_name);
                      setBlock(loc.subdistrict_name);
                      setPincode(loc.pincode || '');
                      setShowFullGridPicker(false);
                    }}
                  />
                </div>
              ) : (
                <InlineCascadingLocationSelector
                  initialState={stateName}
                  initialDistrict={district}
                  initialSubDistrict={block}
                  initialVillage={village}
                  initialPincode={pincode}
                  onLocationChange={(loc) => {
                    setStateName(loc.state);
                    setDistrict(loc.district);
                    setBlock(loc.subDistrict);
                    setVillage(loc.village);
                    setPincode(loc.pincode);
                  }}
                />
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                <Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {language === 'en' ? 'Desired Business' : 'निवडलेला व्यवसाय'}
              </label>
              <input
                type="text"
                value={desiredBusiness}
                onChange={(e) => setDesiredBusiness(e.target.value)}
                placeholder="Mobile & Electronics Repair"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                <IndianRupee size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {language === 'en' ? 'Available Capital (₹)' : 'स्वतःचे उपलब्ध भांडवल (₹)'}
              </label>
              <input
                type="number"
                value={ownCapital}
                onChange={(e) => setOwnCapital(e.target.value)}
                placeholder="250000"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                required
              />
            </div>

            {/* Risk Appetite / Profile Selector for Register */}
            <div style={{ margin: '0.4rem 0' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                <Activity size={14} style={{ display: 'inline', marginRight: '4px', color: '#6366f1' }} />
                {language === 'en' ? 'Risk Appetite & Business Strategy' : 'जोखीम क्षमता व रणनीती (Risk Strategy)'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setRiskAppetite('CONSERVATIVE')}
                  style={{
                    padding: '0.45rem 0.2rem',
                    borderRadius: '8px',
                    border: riskAppetite === 'CONSERVATIVE' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    backgroundColor: riskAppetite === 'CONSERVATIVE' ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: riskAppetite === 'CONSERVATIVE' ? '#15803d' : '#334155' }}>
                    🛡️ {language === 'en' ? 'Low Risk' : 'कमी जोखीम'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                    {language === 'en' ? 'Safe Return' : 'सुरक्षित नफा'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRiskAppetite('MODERATE')}
                  style={{
                    padding: '0.45rem 0.2rem',
                    borderRadius: '8px',
                    border: riskAppetite === 'MODERATE' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: riskAppetite === 'MODERATE' ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: riskAppetite === 'MODERATE' ? '#1d4ed8' : '#334155' }}>
                    ⚖️ {language === 'en' ? 'Moderate' : 'संतुलित'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                    {language === 'en' ? 'Balanced' : 'मध्यम नफा'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRiskAppetite('GROWTH')}
                  style={{
                    padding: '0.45rem 0.2rem',
                    borderRadius: '8px',
                    border: riskAppetite === 'GROWTH' ? '2px solid #d97706' : '1px solid #cbd5e1',
                    backgroundColor: riskAppetite === 'GROWTH' ? '#fffbeb' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: riskAppetite === 'GROWTH' ? '#b45309' : '#334155' }}>
                    🚀 {language === 'en' ? 'Growth' : 'उच्च वाढ'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                    {language === 'en' ? 'Higher Scale' : 'विस्तार'}
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? '...' : (language === 'en' ? 'Register & Continue' : 'नोंदणी करा व पुढे जा')}
              <CheckCircle2 size={18} />
            </button>
          </form>
        )}

        {/* Security Badge */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} style={{ color: '#16a34a' }} />
          <span>{language === 'en' ? '100% Secure & RBI/MSME Guideline Compliant' : '१००% सुरक्षित व RBI / MSME प्रमाणित प्रणाली'}</span>
        </div>
      </div>
    </div>
  );
};
