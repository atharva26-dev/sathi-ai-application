import React, { useState, useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
  MapPin,
  IndianRupee,
  Briefcase,
  HelpCircle,
  Calendar,
  Check,
  Phone,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../context/VoiceContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { UserProfile, LocationDetails } from '../types';
import { storageService } from '../services/storageService';
import { CascadingLocationPicker } from '../components/location/CascadingLocationPicker';

const DRAFT_STORAGE_KEY = 'saathi_draft_onboarding';
const TOTAL_STEPS = 8; // Steps 0 through 7

interface VoiceOnboardingFlowProps {
  onComplete: () => void;
  onSkipToDemo?: () => void;
  onChangeLanguage?: () => void;
}

export const VoiceOnboardingFlow: React.FC<VoiceOnboardingFlowProps> = ({
  onComplete,
  onChangeLanguage
}) => {
  const { t, language, setLanguage, supportedLanguages } = useLanguage();
  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    clearTranscript,
    isVoiceSupported,
    speak,
    stopSpeaking,
    isSpeaking
  } = useVoice();
  const { completeOnboarding, updateProfile } = useUser();
  const { login, createSessionFromOnboarding, isLoading: isAuthLoading } = useAuth();

  // Load draft from local storage if exists
  const [answers, setAnswers] = useState<Partial<UserProfile>>(() => {
    const saved = storageService.get<Partial<UserProfile> | null>(DRAFT_STORAGE_KEY, null);
    if (saved) return saved;
    return {
      name: '',
      age: undefined,
      mobile: '',
      pin: '',
      village: '',
      block: '',
      district: '',
      state: 'Maharashtra',
      ownCapital: undefined,
      desiredBusiness: '',
      adviceNeeded: '',
      skills: [],
      availableAssets: []
    };
  });

  // Mandatory Mobile & PIN state (Step 0)
  const [mobileInput, setMobileInput] = useState<string>(() => answers.mobile || '');
  const [pinInput, setPinInput] = useState<string>(() => answers.pin || '');

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentInputText, setCurrentInputText] = useState<string>('');

  // Voice confirmation dialog state
  const [voiceConfirmation, setVoiceConfirmation] = useState<{
    show: boolean;
    recognizedValue: string;
    field: string;
  }>({
    show: false,
    recognizedValue: '',
    field: ''
  });

  // Uncertainty feedback state
  const [uncertaintyNotice, setUncertaintyNotice] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Quick Language Switcher Modal inside Onboarding
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);

  // Auto-save draft on answers change (scoped per active user)
  useEffect(() => {
    storageService.set(DRAFT_STORAGE_KEY, answers);
  }, [answers]);

  // Sync inputs with current step state
  useEffect(() => {
    setValidationError('');
    setUncertaintyNotice('');
    setVoiceConfirmation({ show: false, recognizedValue: '', field: '' });

    if (currentStepIndex === 0) {
      // Step 0 uses mobileInput and pinInput directly
    } else if (currentStepIndex === 1) {
      setCurrentInputText(answers.name || '');
    } else if (currentStepIndex === 2) {
      setCurrentInputText(answers.age ? String(answers.age) : '');
    } else if (currentStepIndex === 3) {
      // Cascading Location Picker
    } else if (currentStepIndex === 4) {
      setCurrentInputText(answers.desiredBusiness || '');
    } else if (currentStepIndex === 5) {
      setCurrentInputText(answers.ownCapital !== undefined ? String(answers.ownCapital) : '');
    } else if (currentStepIndex === 6) {
      setCurrentInputText(answers.adviceNeeded || '');
    }
  }, [currentStepIndex]);

  // Voice assistant prompt TTS on step entry
  const speakCurrentPrompt = useCallback(() => {
    let prompt = '';
    if (currentStepIndex === 0) {
      prompt =
        language === 'mr'
          ? 'कृपया तुमचा १० अंकी मोबाईल नंबर आणि ४ अंकी सुरक्षा पिन टाका.'
          : language === 'hi'
          ? 'कृपया अपना १० अंकों का मोबाइल नंबर और ४ अंकों का सुरक्षा पिन दर्ज करें।'
          : 'Please enter your 10-digit mobile number and 4-digit security PIN.';
    } else if (currentStepIndex === 1) {
      prompt = `${t.onboarding.introGreeting} ${t.onboarding.qName}`;
    } else if (currentStepIndex === 2) {
      prompt = t.onboarding.qAge;
    } else if (currentStepIndex === 3) {
      prompt = t.onboarding.qLocation;
    } else if (currentStepIndex === 4) {
      prompt = t.onboarding.qDesiredBusiness;
    } else if (currentStepIndex === 5) {
      prompt = t.onboarding.qCapital;
    } else if (currentStepIndex === 6) {
      prompt = t.onboarding.qAdviceNeeded;
    } else if (currentStepIndex === 7) {
      prompt = t.onboarding.reviewSub;
    }

    if (prompt) {
      const voiceLang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      speak(prompt, voiceLang);
    }
  }, [currentStepIndex, language, t, speak]);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakCurrentPrompt();
    }, 350);
    return () => clearTimeout(timer);
  }, [currentStepIndex, language, speakCurrentPrompt]);

  // Parse spoken numbers into numeric values
  const parseSpokenNumber = (text: string): number | null => {
    const clean = text.toLowerCase().trim();
    const matchDigits = clean.match(/\d+/g);
    if (matchDigits) {
      let num = parseInt(matchDigits.join(''), 10);
      if (clean.includes('lakh') || clean.includes('लाख')) {
        num = num < 100 ? num * 100000 : num;
      } else if (clean.includes('thousand') || clean.includes('हजार')) {
        num = num < 1000 ? num * 1000 : num;
      }
      return num;
    }

    if (clean.includes('एक लाख') || clean.includes('one lakh')) return 100000;
    if (clean.includes('दोन लाख') || clean.includes('दो लाख') || clean.includes('two lakh')) return 200000;
    if (clean.includes('अडीच लाख') || clean.includes('ढाई लाख') || clean.includes('two and half lakh')) return 250000;
    if (clean.includes('तीन लाख') || clean.includes('teen lakh') || clean.includes('three lakh')) return 300000;
    if (clean.includes('पाच लाख') || clean.includes('five lakh')) return 500000;
    if (clean.includes('पन्नास हजार') || clean.includes('पचास हजार') || clean.includes('fifty thousand')) return 50000;
    if (clean.includes('पंचवीस हजार') || clean.includes('पच्चीस हजार') || clean.includes('twenty five thousand')) return 25000;
    if (clean.includes('एक हजार') || clean.includes('one thousand')) return 1000;

    return null;
  };

  // Handle live incoming speech recognition
  useEffect(() => {
    if (!transcript || !isListening) return;

    const trimmed = transcript.trim();
    if (!trimmed) return;

    if (currentStepIndex === 0) {
      // Spoken phone or pin
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length === 10) {
        setMobileInput(digits);
        setVoiceConfirmation({
          show: true,
          recognizedValue: digits,
          field: 'mobile'
        });
      } else if (digits.length === 4) {
        setPinInput(digits);
        setVoiceConfirmation({
          show: true,
          recognizedValue: '••••',
          field: 'pin'
        });
      }
    } else if (currentStepIndex === 1) {
      // Name
      setCurrentInputText(trimmed);
      setVoiceConfirmation({
        show: true,
        recognizedValue: trimmed,
        field: 'name'
      });
    } else if (currentStepIndex === 2) {
      // Age
      const parsedAge = parseSpokenNumber(trimmed);
      if (parsedAge && parsedAge >= 15 && parsedAge <= 99) {
        setCurrentInputText(String(parsedAge));
        setVoiceConfirmation({
          show: true,
          recognizedValue: `${parsedAge} ${language === 'mr' ? 'वर्षे' : language === 'hi' ? 'वर्ष' : 'years'}`,
          field: 'age'
        });
      } else {
        setUncertaintyNotice(t.onboarding.uncertainVoiceNotice);
      }
    } else if (currentStepIndex === 4) {
      // Business Idea
      setCurrentInputText(trimmed);
      setVoiceConfirmation({
        show: true,
        recognizedValue: trimmed,
        field: 'business'
      });
    } else if (currentStepIndex === 5) {
      // Capital / Budget
      const parsedCap = parseSpokenNumber(trimmed);
      if (parsedCap !== null && parsedCap >= 0) {
        setCurrentInputText(String(parsedCap));
        setVoiceConfirmation({
          show: true,
          recognizedValue: `₹${parsedCap.toLocaleString('en-IN')}`,
          field: 'capital'
        });
      } else {
        setUncertaintyNotice(t.onboarding.uncertainVoiceNotice);
      }
    } else if (currentStepIndex === 6) {
      // Advice Needed
      setCurrentInputText(trimmed);
      setVoiceConfirmation({
        show: true,
        recognizedValue: trimmed,
        field: 'advice'
      });
    }
  }, [transcript, isListening, currentStepIndex, language, t]);

  // Voice confirmation trigger audio
  const handleConfirmVoiceValue = () => {
    if (voiceConfirmation.field === 'mobile') {
      setMobileInput(voiceConfirmation.recognizedValue);
    } else if (voiceConfirmation.field === 'name') {
      setAnswers((prev) => ({ ...prev, name: currentInputText.trim() }));
    } else if (voiceConfirmation.field === 'age') {
      const ageNum = parseInt(currentInputText, 10);
      if (!isNaN(ageNum)) setAnswers((prev) => ({ ...prev, age: ageNum }));
    } else if (voiceConfirmation.field === 'business') {
      setAnswers((prev) => ({ ...prev, desiredBusiness: currentInputText.trim() }));
    } else if (voiceConfirmation.field === 'capital') {
      const capNum = parseFloat(currentInputText);
      if (!isNaN(capNum)) setAnswers((prev) => ({ ...prev, ownCapital: capNum }));
    } else if (voiceConfirmation.field === 'advice') {
      setAnswers((prev) => ({ ...prev, adviceNeeded: currentInputText.trim() }));
    }

    setVoiceConfirmation({ show: false, recognizedValue: '', field: '' });
    clearTranscript();
    handleNext();
  };

  // Step 0 Authentication Gate: 1 Mobile = 1 User with 4-digit PIN verification
  const handleStep0Auth = async () => {
    setValidationError('');
    stopListening();
    stopSpeaking();

    const cleanMobile = mobileInput.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      setValidationError(
        language === 'mr'
          ? 'कृपया अचूक १० अंकी मोबाईल नंबर टाका.'
          : language === 'hi'
          ? 'कृपया सही १० अंकों का मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (!pinInput || pinInput.length !== 4) {
      setValidationError(
        language === 'mr'
          ? 'कृपया अचूक ४ अंकी सुरक्षा पिन टाका.'
          : language === 'hi'
          ? 'कृपया ४ अंकों का सुरक्षा पिन दर्ज करें।'
          : 'Please enter a 4-digit security PIN.'
      );
      return;
    }

    const res = await login(cleanMobile, pinInput);
    if (res.success) {
      // If user profile is already fully onboarded, navigate directly to dashboard!
      if (res.profile?.isOnboarded) {
        updateProfile(res.profile);
        storageService.remove(DRAFT_STORAGE_KEY);
        onComplete();
        return;
      }

      // If new user or profile incomplete, advance to profile questions with clean isolated answers
      setAnswers((prev) => ({
        ...prev,
        mobile: cleanMobile,
        pin: pinInput,
        name: res.profile?.name || prev.name || '',
        village: res.profile?.village || prev.village || '',
        district: res.profile?.district || prev.district || '',
        desiredBusiness: res.profile?.desiredBusiness || prev.desiredBusiness || '',
        ownCapital: res.profile?.ownCapital !== undefined ? res.profile.ownCapital : prev.ownCapital
      }));
      setCurrentStepIndex(1);
    } else {
      setValidationError(
        res.error ||
          (language === 'mr'
            ? 'चुकीचा सुरक्षा पिन. कृपया अचूक ४ अंकी पिन टाका.'
            : language === 'hi'
            ? 'गलत सुरक्षा पिन। कृपया सही ४ अंकों का पिन दर्ज करें।'
            : 'Incorrect security PIN. Please enter correct 4-digit PIN.')
      );
    }
  };

  // Step Validation & Navigation
  const handleNext = () => {
    setValidationError('');
    setUncertaintyNotice('');
    stopListening();
    stopSpeaking();

    if (currentStepIndex === 0) {
      handleStep0Auth();
      return;
    } else if (currentStepIndex === 1) {
      const nameVal = currentInputText.trim();
      if (!nameVal) {
        setValidationError(t.onboarding.validationErrors.nameRequired);
        return;
      }
      setAnswers((prev) => ({ ...prev, name: nameVal }));
    } else if (currentStepIndex === 2) {
      const ageVal = parseInt(currentInputText.trim(), 10);
      if (isNaN(ageVal) || ageVal < 16 || ageVal > 100) {
        setValidationError(t.onboarding.validationErrors.ageRequired);
        return;
      }
      setAnswers((prev) => ({ ...prev, age: ageVal }));
    } else if (currentStepIndex === 3) {
      if (!answers.village || !answers.district || !answers.state || !answers.block) {
        setValidationError(
          language === 'mr'
            ? 'कृपया राज्य, जिल्हा, तालुका आणि गाव ही चारही ठिकाणे निवडा.'
            : language === 'hi'
            ? 'कृपया राज्य, जिला, तहसील/ब्लॉक और गांव चारों स्तर चुनें।'
            : 'Please complete selection of State, District, Sub-district, and Village.'
        );
        return;
      }
    } else if (currentStepIndex === 4) {
      const bizVal = currentInputText.trim();
      if (!bizVal) {
        setValidationError(t.onboarding.validationErrors.businessRequired);
        return;
      }
      setAnswers((prev) => ({ ...prev, desiredBusiness: bizVal }));
    } else if (currentStepIndex === 5) {
      const capVal = parseFloat(currentInputText.replace(/[^0-9.]/g, ''));
      if (isNaN(capVal) || capVal < 0) {
        setValidationError(t.onboarding.validationErrors.capitalRequired);
        return;
      }
      setAnswers((prev) => ({ ...prev, ownCapital: capVal }));
    } else if (currentStepIndex === 6) {
      const adviceVal = currentInputText.trim();
      if (!adviceVal) {
        setValidationError(t.onboarding.validationErrors.adviceRequired);
        return;
      }
      setAnswers((prev) => ({
        ...prev,
        adviceNeeded: adviceVal,
        businessGoals: adviceVal
      }));
    }

    if (currentStepIndex < TOTAL_STEPS - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationError('');
    setUncertaintyNotice('');
    stopListening();
    stopSpeaking();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Final Confirmation & Submission
  const handleFinalSubmit = async () => {
    stopListening();
    stopSpeaking();

    const cleanMobile = (answers.mobile || mobileInput || '').replace(/\D/g, '').slice(-10);
    const validPin = answers.pin || pinInput || '1234';

    const finalProfileData: Partial<UserProfile> = {
      name: answers.name || 'उद्योजक मित्र',
      age: answers.age || 30,
      mobile: cleanMobile,
      pin: validPin,
      village: answers.village || 'सुपे',
      block: answers.block || 'बारामती',
      district: answers.district || 'पुणे',
      state: answers.state || 'Maharashtra',
      locationDetails: answers.locationDetails,
      desiredBusiness: answers.desiredBusiness || 'सूक्ष्म उद्योग',
      ownCapital: answers.ownCapital !== undefined ? answers.ownCapital : 100000,
      adviceNeeded: answers.adviceNeeded || t.onboarding.adviceOptions.completeGuidance,
      businessGoals: answers.adviceNeeded || t.onboarding.adviceOptions.completeGuidance,
      preferredLanguage: language,
      skills: answers.skills || ['स्थानिक बाजार संपर्क'],
      availableAssets: answers.availableAssets || ['जागा'],
      isOnboarded: true,
      isDemo: false
    };

    try {
      // 1. Synchronously save profile into UserContext and user-scoped storage
      completeOnboarding(finalProfileData);

      // 2. Provision authenticated session
      await createSessionFromOnboarding(finalProfileData, validPin);

      // 3. Clear draft
      storageService.remove(DRAFT_STORAGE_KEY);

      // 4. Navigate directly to Dashboard
      onComplete();
    } catch (err) {
      console.error('Submission error:', err);
      completeOnboarding(finalProfileData);
      onComplete();
    }
  };

  // Preset demo account autofill
  const handleAutofillDemo = () => {
    setMobileInput('9822345678');
    setPinInput('1234');
    setValidationError('');
  };

  // Inspirational business ideas
  const businessInspirations = [
    { label: 'Mobile & Electronics Repair', icon: '📱', native: language === 'mr' ? 'मोबाईल रिपेअर' : language === 'hi' ? 'मोबाइल रिपेयरिंग' : 'Mobile Repair' },
    { label: 'Tailoring & Garments', icon: '✂️', native: language === 'mr' ? 'शिलाई व कपडे काम' : language === 'hi' ? 'सिलाई व वस्त्र' : 'Tailoring' },
    { label: 'Grocery / Kirana Store', icon: '🏪', native: language === 'mr' ? 'किराणा दुकान' : language === 'hi' ? 'किराना स्टोर' : 'Grocery Store' },
    { label: 'Dairy & Milk Processing', icon: '🥛', native: language === 'mr' ? 'दुग्ध व्यवसाय' : language === 'hi' ? 'डेयरी उद्योग' : 'Dairy Unit' },
    { label: 'Poultry & Goat Farming', icon: '🐔', native: language === 'mr' ? 'कुक्कुटपालन / शेळीपालन' : language === 'hi' ? 'मुर्गीपालन / बकरीपालन' : 'Poultry Farm' },
    { label: 'Bakery & Food Processing', icon: '🍞', native: language === 'mr' ? 'बेकरी व खाद्यपदार्थ' : language === 'hi' ? 'बेकरी व फ़ास्ट फ़ूड' : 'Bakery' },
    { label: 'Welding & Fabrication', icon: '⚙️', native: language === 'mr' ? 'वेल्डिंग वर्कशॉप' : language === 'hi' ? 'वेल्डिंग वर्कशॉप' : 'Welding & Fab' },
    { label: 'Beauty Salon & Parlor', icon: '💇', native: language === 'mr' ? 'ब्युटी पार्लर' : language === 'hi' ? 'ब्यूटी पार्लर' : 'Beauty Salon' },
    { label: 'Digital Services & CSC Center', icon: '💻', native: language === 'mr' ? 'आपले सरकार / CSC केंद्र' : language === 'hi' ? 'डिजिटल सेवा केंद्र' : 'Digital Services' },
    { label: 'Solar & Water Pump Service', icon: '☀️', native: language === 'mr' ? 'सोलर पंप व दुरुस्ती सेवा' : language === 'hi' ? 'सोलर पंप सेवा' : 'Solar Pump Service' },
    { label: 'Transport & Logistics', icon: '🚚', native: language === 'mr' ? 'मालवाहतूक सेवा' : language === 'hi' ? 'माल परिवहन सेवा' : 'Transport Service' }
  ];

  // Advice categories options
  const adviceCategories = [
    { id: 'ALL', label: t.onboarding.adviceOptions.allOfTheAbove, icon: '🌟' },
    { id: 'PLAN', label: t.onboarding.adviceOptions.businessPlan, icon: '📋' },
    { id: 'MARKET', label: t.onboarding.adviceOptions.marketAnalysis, icon: '📊' },
    { id: 'GAP', label: t.onboarding.adviceOptions.marketGap, icon: '💡' },
    { id: 'FINANCE', label: t.onboarding.adviceOptions.financePlanning, icon: '💰' },
    { id: 'LOAN', label: t.onboarding.adviceOptions.bankLoans, icon: '🏦' },
    { id: 'MARKETING', label: t.onboarding.adviceOptions.marketing, icon: '📢' },
    { id: 'PRICING', label: t.onboarding.adviceOptions.pricing, icon: '🏷️' },
    { id: 'EXPANSION', label: t.onboarding.adviceOptions.expansion, icon: '🚀' },
    { id: 'RISK', label: t.onboarding.adviceOptions.riskAnalysis, icon: '🛡️' }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app, #F8FAFC)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        maxWidth: '680px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Brand Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-light, #E2E8F0)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: '1.5px solid rgba(13, 148, 136, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '2px',
              flexShrink: 0
            }}
          >
            <img
              src="/vyapar-saathi-logo.png"
              alt="Vyapar Saathi Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)' }}>
              Vyapar Saathi व्यापार साथी
            </div>
            <div style={{ fontSize: '0.74rem', color: '#0D9488', fontWeight: 600 }}>
              Aapka Business, Hamara Saath
            </div>
          </div>
        </div>

        {onChangeLanguage && (
          <button
            onClick={onChangeLanguage}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-medium, #CBD5E1)',
              borderRadius: '16px',
              padding: '4px 10px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--text-primary, #0F172A)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Globe size={13} />
            <span>{language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'Eng'}</span>
          </button>
        )}
      </div>

      {/* Top Bar: Navigation, Progress Indicator & Language */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          {currentStepIndex > 0 ? (
            <button
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary, #475569)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '6px 8px',
                borderRadius: '8px'
              }}
            >
              <ArrowLeft size={20} />
              <span>{t.common.back}</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '0.85rem', fontWeight: 700 }}>
              <ShieldCheck size={18} />
              <span>{language === 'mr' ? 'सुरक्षित वापरकर्ता पडताळणी' : language === 'hi' ? 'सुरक्षित उपयोगकर्ता सत्यापन' : 'Secure User Verification'}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: 'var(--primary, #C2410C)',
                backgroundColor: 'rgba(194, 65, 12, 0.1)',
                padding: '4px 12px',
                borderRadius: '20px'
              }}
            >
              {t.onboarding.stepOf.replace('{current}', String(currentStepIndex + 1)).replace('{total}', String(TOTAL_STEPS))}
            </span>

            <button
              onClick={() => setIsLangModalOpen(true)}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-medium, #CBD5E1)',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-primary, #0F172A)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Globe size={14} color="var(--primary, #C2410C)" />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#E2E8F0',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '18px'
          }}
        >
          <div
            style={{
              width: `${((currentStepIndex + 1) / TOTAL_STEPS) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--primary, #C2410C)',
              transition: 'width 0.35s ease-in-out'
            }}
          />
        </div>

        {/* Voice Assistant Audio Status Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--border-medium, #E2E8F0)',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: isSpeaking ? 'var(--primary, #C2410C)' : 'rgba(194, 65, 12, 0.12)',
                color: isSpeaking ? '#FFFFFF' : 'var(--primary, #C2410C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {isSpeaking ? <Volume2 size={20} className="animate-pulse" /> : <Sparkles size={18} />}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)' }}>
                {t.common.appName} {language === 'en' ? 'Voice Assistant' : 'मार्गदर्शक सहाय्यक'}
              </div>
              <div style={{ fontSize: '0.75rem', color: isListening ? '#DC2626' : 'var(--text-secondary, #64748B)', fontWeight: 600 }}>
                {isListening ? t.onboarding.listeningNotice : t.onboarding.voiceFallbackNotice}
              </div>
            </div>
          </div>

          <button
            onClick={() => (isSpeaking ? stopSpeaking() : speakCurrentPrompt())}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary, #C2410C)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isSpeaking ? 'Stop speech' : 'Replay prompt'}
          >
            {isSpeaking ? <VolumeX size={20} /> : <RotateCcw size={18} />}
          </button>
        </div>

        {/* Validation or Uncertainty Alerts */}
        {validationError && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              padding: '12px 14px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 700,
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{validationError}</span>
          </div>
        )}

        {uncertaintyNotice && (
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#B45309',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>⚠️ {uncertaintyNotice}</span>
          </div>
        )}

        {/* Voice Confirmation Card if speech captured */}
        {voiceConfirmation.show && (
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '2px solid #86EFAC',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, fontSize: '0.95rem' }}>
              <Check size={18} />
              <span>
                {voiceConfirmation.field === 'mobile' && `मोबाईल नंबर: ${voiceConfirmation.recognizedValue}`}
                {voiceConfirmation.field === 'pin' && '४-अंकी सुरक्षा पिन नोंदवला'}
                {voiceConfirmation.field === 'name' && t.onboarding.confirmName.replace('{val}', voiceConfirmation.recognizedValue)}
                {voiceConfirmation.field === 'age' && t.onboarding.confirmAge.replace('{val}', voiceConfirmation.recognizedValue)}
                {voiceConfirmation.field === 'business' && t.onboarding.confirmBusiness.replace('{val}', voiceConfirmation.recognizedValue)}
                {voiceConfirmation.field === 'capital' && t.onboarding.confirmCapital.replace('{val}', voiceConfirmation.recognizedValue)}
                {voiceConfirmation.field === 'advice' && t.onboarding.confirmAdvice.replace('{val}', voiceConfirmation.recognizedValue)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleConfirmVoiceValue}
                style={{
                  flex: 1,
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>{t.onboarding.yesCorrect}</span>
              </button>
              <button
                onClick={() => setVoiceConfirmation({ show: false, recognizedValue: '', field: '' })}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #CBD5E1',
                  color: '#475569',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <span>{t.onboarding.noChange}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 0: Mandatory Mobile Number & 4-Digit Security PIN */}
        {currentStepIndex === 0 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(194, 65, 12, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Phone size={24} color="var(--primary, #C2410C)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)', margin: 0 }}>
                  {language === 'mr'
                    ? 'मोबाईल नंबर व सुरक्षा पिन'
                    : language === 'hi'
                    ? 'मोबाइल नंबर और सुरक्षा पिन'
                    : 'Mobile Number & Security PIN'}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #64748B)', margin: 0 }}>
                  {language === 'mr'
                    ? '१ मोबाईल = १ स्वतंत्र खाते. प्रत्येक वापरकर्त्याची माहिती पूर्णपणे वेगळी राहते.'
                    : language === 'hi'
                    ? '१ मोबाइल = १ सुरक्षित खाता। प्रत्येक उपयोगकर्ता का डेटा पूरी तरह अलग रहेगा।'
                    : '1 Mobile = 1 Isolated User Account. Every user data is isolated.'}
                </p>
              </div>
            </div>

            {/* Form Inputs Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Phone size={15} color="var(--primary, #C2410C)" />
                  <span>{language === 'mr' ? 'तुमचा १० अंकी मोबाईल नंबर:' : language === 'hi' ? 'आपका १० अंकों का मोबाइल नंबर:' : 'Your 10-digit Mobile Number:'}</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '14px 12px',
                      backgroundColor: '#F1F5F9',
                      border: '2px solid var(--border-medium, #CBD5E1)',
                      borderRight: 'none',
                      borderRadius: '14px 0 0 14px',
                      fontWeight: 800,
                      color: '#475569',
                      fontSize: '1rem'
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="उदा. 9822345678"
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      borderRadius: '0 14px 14px 0',
                      border: '2px solid var(--border-medium, #CBD5E1)',
                      backgroundColor: '#FFFFFF',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: 'var(--text-primary, #0F172A)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      letterSpacing: '1px'
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <KeyRound size={15} color="var(--primary, #C2410C)" />
                  <span>{language === 'mr' ? '४-अंकी सुरक्षा पिन (Security PIN):' : language === 'hi' ? '४-अंकों का सुरक्षा पिन:' : '4-Digit Security PIN:'}</span>
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '2px solid var(--border-medium, #CBD5E1)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: 'var(--text-primary, #0F172A)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    letterSpacing: '8px'
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                  {language === 'mr'
                    ? 'नवीन वापरकर्त्यासाठी हा पिन खाते सुरक्षित ठेवेल. जुन्या वापरकर्त्याने अचूक पिन टाकावा.'
                    : language === 'hi'
                    ? 'नए उपयोगकर्ता के लिए यह पिन खाता सुरक्षित रखेगा। पुराने उपयोगकर्ता सही पिन दर्ज करें।'
                    : 'Secures your isolated account. Returning users must enter the correct PIN.'}
                </span>
              </div>

              {/* Demo Account Quick Autofill Button */}
              <div
                style={{
                  backgroundColor: 'rgba(194, 65, 12, 0.05)',
                  border: '1.5px dashed rgba(194, 65, 12, 0.3)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '4px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary, #C2410C)' }}>
                    ⚡ {language === 'mr' ? 'डेमो खात्यावर थेट लॉगिन' : language === 'hi' ? 'डेमो खाते से सीधा लॉगिन' : 'Direct Demo Account'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                    मोबाईल: 9822345678 | पिन: 1234 (Ramesh Patil, Baramati)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  style={{
                    backgroundColor: 'var(--primary, #C2410C)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {language === 'mr' ? 'भरा' : language === 'hi' ? 'भरें' : 'Fill'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Full Name */}
        {currentStepIndex === 1 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(194, 65, 12, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <User size={24} color="var(--primary, #C2410C)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)', margin: 0 }}>
                {t.onboarding.qName}
              </h2>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #64748B)', marginBottom: '18px' }}>
              {t.onboarding.speakOrType}:
            </p>

            <input
              type="text"
              value={currentInputText}
              onChange={(e) => {
                setCurrentInputText(e.target.value);
                setAnswers((prev) => ({ ...prev, name: e.target.value }));
              }}
              placeholder={t.onboarding.placeholderName}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: '2px solid var(--border-medium, #CBD5E1)',
                backgroundColor: '#FFFFFF',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary, #0F172A)',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '16px'
              }}
              autoFocus
            />
          </div>
        )}

        {/* STEP 2: Age */}
        {currentStepIndex === 2 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(194, 65, 12, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Calendar size={24} color="var(--primary, #C2410C)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)', margin: 0 }}>
                {t.onboarding.qAge}
              </h2>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #64748B)', marginBottom: '18px' }}>
              {t.onboarding.speakOrType}:
            </p>

            <input
              type="number"
              min={16}
              max={100}
              value={currentInputText}
              onChange={(e) => {
                setCurrentInputText(e.target.value);
                const n = parseInt(e.target.value, 10);
                setAnswers((prev) => ({ ...prev, age: isNaN(n) ? undefined : n }));
              }}
              placeholder={t.onboarding.placeholderAge}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: '2px solid var(--border-medium, #CBD5E1)',
                backgroundColor: '#FFFFFF',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary, #0F172A)',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '16px'
              }}
              autoFocus
            />
          </div>
        )}

        {/* STEP 3: Location (Progressive Cascading Selector) */}
        {currentStepIndex === 3 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(194, 65, 12, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MapPin size={24} color="var(--primary, #C2410C)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)', margin: 0 }}>
                  {t.onboarding.qLocation}
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary, #64748B)', margin: 0 }}>
                  {language === 'mr'
                    ? 'आपले राज्य, जिल्हा, तालुका आणि गाव क्रमाने निवडा:'
                    : language === 'hi'
                    ? 'अपना राज्य, जिला, तहसील/ब्लॉक और गांव क्रमानुसार चुनें:'
                    : 'Select your State, District, Local Unit, and Village progressively:'}
                </p>
              </div>
            </div>

            <CascadingLocationPicker
              initialLocation={{
                state: answers.state,
                district: answers.district,
                block: answers.block,
                village: answers.village
              }}
              onStepChange={(pickerStep) => {
                const voiceLang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
                let prompt = '';
                if (pickerStep === 1) {
                  prompt = language === 'mr' ? 'कृपया आपले राज्य निवडा.' : language === 'hi' ? 'कृपया अपना राज्य चुनें।' : 'Please select your state.';
                } else if (pickerStep === 2) {
                  prompt = language === 'mr' ? 'आता आपला जिल्हा निवडा.' : language === 'hi' ? 'अब अपना जिला चुनें।' : 'Now select your district.';
                } else if (pickerStep === 3) {
                  prompt = language === 'mr' ? 'आता आपला तालुका किंवा स्थानिक विभाग निवडा.' : language === 'hi' ? 'अब अपनी तहसील या स्थानीय ब्लॉक चुनें।' : 'Now select your local sub-district.';
                } else if (pickerStep === 4) {
                  prompt = language === 'mr' ? 'आता आपले गाव किंवा शहर निवडा.' : language === 'hi' ? 'अब अपना गांव या नगर चुनें।' : 'Now select your village or town.';
                }
                if (prompt) {
                  speak(prompt, voiceLang);
                }
              }}
              onLocationSelected={(loc: LocationDetails) => {
                setAnswers((prev) => ({
                  ...prev,
                  village: loc.village_name,
                  block: loc.subdistrict_name,
                  district: loc.district_name,
                  state: loc.state_name,
                  locationDetails: loc
                }));
                setValidationError('');
              }}
            />
          </div>
        )}

        {/* STEP 4: Business Type */}
        {currentStepIndex === 4 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(194, 65, 12, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Briefcase size={24} color="var(--primary, #C2410C)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)', margin: 0 }}>
                {t.onboarding.qDesiredBusiness}
              </h2>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary, #64748B)', marginBottom: '14px' }}>
              {t.onboarding.customBusinessPrompt}:
            </p>

            <input
              type="text"
              value={currentInputText}
              onChange={(e) => {
                setCurrentInputText(e.target.value);
                setAnswers((prev) => ({ ...prev, desiredBusiness: e.target.value }));
              }}
              placeholder={t.onboarding.placeholderBusiness}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: '2px solid var(--border-medium, #CBD5E1)',
                backgroundColor: '#FFFFFF',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary, #0F172A)',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '14px'
              }}
              autoFocus
            />

            {/* Inspiration Chips */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted, #94A3B8)', marginBottom: '8px' }}>
                {t.onboarding.quickPresets}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {businessInspirations.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentInputText(item.native);
                      setAnswers((prev) => ({ ...prev, desiredBusiness: item.native }));
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '12px',
                      border: currentInputText === item.native ? '2px solid var(--primary, #C2410C)' : '1px solid var(--border-medium, #E2E8F0)',
                      backgroundColor: currentInputText === item.native ? 'rgba(194, 65, 12, 0.1)' : '#FFFFFF',
                      color: currentInputText === item.native ? 'var(--primary, #C2410C)' : 'var(--text-secondary, #475569)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.native}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Budget / Own Capital */}
        {currentStepIndex === 5 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(194, 65, 12, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IndianRupee size={24} color="var(--primary, #C2410C)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)', margin: 0 }}>
                {t.onboarding.qCapital}
              </h2>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary, #64748B)', marginBottom: '16px' }}>
              {t.onboarding.speakOrType}:
            </p>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--primary, #C2410C)'
                }}
              >
                ₹
              </span>
              <input
                type="number"
                min={0}
                step={5000}
                value={currentInputText}
                onChange={(e) => {
                  setCurrentInputText(e.target.value);
                  const n = parseFloat(e.target.value);
                  setAnswers((prev) => ({ ...prev, ownCapital: isNaN(n) ? undefined : n }));
                }}
                placeholder={t.onboarding.placeholderCapital}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 44px',
                  borderRadius: '14px',
                  border: '2px solid var(--border-medium, #CBD5E1)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--text-primary, #0F172A)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            </div>

            {/* Quick Capital Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {[25000, 50000, 100000, 250000, 500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setCurrentInputText(String(amt));
                    setAnswers((prev) => ({ ...prev, ownCapital: amt }));
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    border: currentInputText === String(amt) ? '2px solid var(--primary, #C2410C)' : '1px solid var(--border-medium, #CBD5E1)',
                    backgroundColor: currentInputText === String(amt) ? 'rgba(194, 65, 12, 0.1)' : '#FFFFFF',
                    color: currentInputText === String(amt) ? 'var(--primary, #C2410C)' : 'var(--text-primary, #0F172A)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Advice Needed */}
        {currentStepIndex === 6 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(194, 65, 12, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HelpCircle size={24} color="var(--primary, #C2410C)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)', margin: 0 }}>
                {t.onboarding.qAdviceNeeded}
              </h2>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary, #64748B)', marginBottom: '14px' }}>
              {t.onboarding.speakOrType}:
            </p>

            <textarea
              rows={2}
              value={currentInputText}
              onChange={(e) => {
                setCurrentInputText(e.target.value);
                setAnswers((prev) => ({ ...prev, adviceNeeded: e.target.value }));
              }}
              placeholder={t.onboarding.placeholderAdvice}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: '2px solid var(--border-medium, #CBD5E1)',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-primary, #0F172A)',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                marginBottom: '14px'
              }}
              autoFocus
            />

            {/* Advice Selection Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
              {adviceCategories.map((adv) => {
                const isSelected = currentInputText.includes(adv.label) || (adv.id === 'ALL' && currentInputText === adv.label);
                return (
                  <button
                    key={adv.id}
                    type="button"
                    onClick={() => {
                      if (adv.id === 'ALL') {
                        setCurrentInputText(adv.label);
                        setAnswers((prev) => ({ ...prev, adviceNeeded: adv.label }));
                      } else {
                        const nextVal = currentInputText ? `${currentInputText}, ${adv.label}` : adv.label;
                        setCurrentInputText(nextVal);
                        setAnswers((prev) => ({ ...prev, adviceNeeded: nextVal }));
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid var(--primary, #C2410C)' : '1px solid var(--border-medium, #CBD5E1)',
                      backgroundColor: isSelected ? 'rgba(194, 65, 12, 0.1)' : '#FFFFFF',
                      color: isSelected ? 'var(--primary, #C2410C)' : 'var(--text-primary, #0F172A)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{adv.icon}</span>
                    <span style={{ flex: 1 }}>{adv.label}</span>
                    {isSelected && <Check size={18} color="var(--primary, #C2410C)" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7: Review & Final Confirmation */}
        {currentStepIndex === 7 && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(194, 65, 12, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={24} color="var(--primary, #C2410C)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary, #0F172A)', margin: 0 }}>
                  {t.onboarding.reviewTitle}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)', margin: 0 }}>
                  {t.onboarding.reviewSub}
                </p>
              </div>
            </div>

            {/* Profile Review Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                border: '1.5px solid var(--border-medium, #CBD5E1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: '0.88rem' }}>मोबाईल नंबर व पिन:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#166534', fontWeight: 800, fontSize: '0.95rem' }}>
                  <ShieldCheck size={16} />
                  +91 {answers.mobile || mobileInput} (पिन सुरक्षित)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: '0.88rem' }}>{t.onboarding.qName}:</span>
                <strong style={{ color: 'var(--text-primary, #0F172A)', fontSize: '0.98rem' }}>{answers.name || '—'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: '0.88rem' }}>{t.onboarding.qAge}:</span>
                <strong style={{ color: 'var(--text-primary, #0F172A)', fontSize: '0.98rem' }}>{answers.age || '—'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: '0.88rem' }}>{t.onboarding.qLocation}:</span>
                <strong style={{ color: 'var(--text-primary, #0F172A)', fontSize: '0.95rem' }}>
                  {answers.village}, {answers.block ? `${answers.block}, ` : ''}{answers.district || ''} ({answers.state || 'Maharashtra'})
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: '0.88rem' }}>{t.onboarding.qDesiredBusiness}:</span>
                <strong style={{ color: 'var(--primary, #C2410C)', fontSize: '1rem' }}>
                  {answers.desiredBusiness || '—'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: '0.88rem' }}>{t.onboarding.qCapital}:</span>
                <strong style={{ color: '#16A34A', fontSize: '1.1rem', fontWeight: 800 }}>
                  ₹{(answers.ownCapital || 0).toLocaleString('en-IN')}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: '0.88rem' }}>{t.onboarding.qAdviceNeeded}:</span>
                <span style={{ color: 'var(--text-primary, #0F172A)', fontSize: '0.9rem', fontWeight: 700, maxWidth: '60%', textAlign: 'right' }}>
                  {answers.adviceNeeded || t.onboarding.adviceOptions.allOfTheAbove}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div style={{ marginTop: '20px' }}>
        {currentStepIndex === 0 ? (
          /* Step 0: Mandatory Verify & Proceed */
          <button
            type="button"
            onClick={handleStep0Auth}
            disabled={isAuthLoading}
            style={{
              width: '100%',
              minHeight: '58px',
              backgroundColor: 'var(--primary, #C2410C)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              padding: '16px 24px',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: isAuthLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 20px rgba(194, 65, 12, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>
              {isAuthLoading
                ? '...'
                : language === 'mr'
                ? 'पडताळणी करा आणि पुढे जा'
                : language === 'hi'
                ? 'सत्यापित करें और आगे बढ़ें'
                : 'Verify & Proceed'}
            </span>
            <ArrowRight size={22} />
          </button>
        ) : currentStepIndex < TOTAL_STEPS - 1 ? (
          /* Steps 1 to 6: Progression with Voice Trigger */
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isVoiceSupported && (
              <button
                type="button"
                onClick={() => (isListening ? stopListening() : startListening())}
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '18px',
                  border: isListening ? '2.5px solid #DC2626' : '2px solid var(--primary, #C2410C)',
                  backgroundColor: isListening ? '#FEE2E2' : 'rgba(194, 65, 12, 0.1)',
                  color: isListening ? '#DC2626' : 'var(--primary, #C2410C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isListening ? '0 0 16px rgba(220, 38, 38, 0.4)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                title={isListening ? 'Stop recording' : 'Speak your answer'}
              >
                {isListening ? <MicOff size={26} /> : <Mic size={26} />}
              </button>
            )}

            {(() => {
              const isLocationIncomplete =
                currentStepIndex === 3 &&
                (!answers.village || !answers.district || !answers.state || !answers.block);
              return (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLocationIncomplete}
                  style={{
                    flex: 1,
                    minHeight: '58px',
                    backgroundColor: isLocationIncomplete ? '#CBD5E1' : 'var(--primary, #C2410C)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '18px',
                    padding: '16px 24px',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    cursor: isLocationIncomplete ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: isLocationIncomplete ? 'none' : '0 8px 20px rgba(194, 65, 12, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{t.common.continue}</span>
                  <ArrowRight size={22} />
                </button>
              );
            })()}
          </div>
        ) : (
          /* Step 7: Final Submission */
          <button
            type="button"
            onClick={handleFinalSubmit}
            style={{
              width: '100%',
              minHeight: '58px',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '18px',
              padding: '16px 24px',
              fontSize: '1.15rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>
              {language === 'mr'
                ? 'माझे खाते तयार करा आणि सुरू करा'
                : language === 'hi'
                ? 'मेरा खाता बनाएं और शुरू करें'
                : 'Create Account & Launch Dashboard'}
            </span>
            <Sparkles size={22} />
          </button>
        )}
      </div>

      {/* Language Selection Modal inside Onboarding */}
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
            zIndex: 9999,
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
              borderRadius: '20px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', color: '#0F172A', margin: 0 }}>
              भाषा निवडा / Choose Language
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto', marginTop: '14px' }}>
              {supportedLanguages.slice(0, 10).map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsLangModalOpen(false);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: language === l.code ? 'rgba(194, 65, 12, 0.1)' : '#F8FAFC',
                    border: language === l.code ? '2px solid var(--primary, #C2410C)' : '1px solid #E2E8F0',
                    color: language === l.code ? 'var(--primary, #C2410C)' : '#0F172A',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{l.nativeLabel} ({l.label})</span>
                  {language === l.code && <Check size={18} />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsLangModalOpen(false)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '14px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                backgroundColor: 'transparent',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
