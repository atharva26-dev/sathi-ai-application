import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Loader2,
  Building2,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  locationService,
  LocationState,
  LocationDistrict,
  LocationSubDistrict,
  LocationVillage,
  getSubDistrictLabel
} from '../../services/locationService';
import { LocationDetails } from '../../types';

interface CascadingLocationPickerProps {
  initialLocation?: {
    state?: string;
    district?: string;
    block?: string;
    village?: string;
  };
  onLocationSelected: (location: LocationDetails) => void;
  onStepChange?: (stepIndex: number) => void;
}

type PickerStep = 1 | 2 | 3 | 4;

export const CascadingLocationPicker: React.FC<CascadingLocationPickerProps> = ({
  initialLocation,
  onLocationSelected,
  onStepChange
}) => {
  const { language } = useLanguage();

  const stNameFallback = initialLocation?.state || 'Maharashtra';
  const distNameFallback = initialLocation?.district || 'Sangli';

  // Selection states
  const [selectedState, setSelectedState] = useState<LocationState | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<LocationDistrict | null>(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<LocationSubDistrict | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<LocationVillage | null>(null);

  // Active step
  const [currentStep, setCurrentStep] = useState<PickerStep>(1);

  // Data lists
  const [states, setStates] = useState<LocationState[]>([]);
  const [districts, setDistricts] = useState<LocationDistrict[]>([]);
  const [subDistricts, setSubDistricts] = useState<LocationSubDistrict[]>([]);
  const [villages, setVillages] = useState<LocationVillage[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search queries per step
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Fetch States on Mount
  useEffect(() => {
    let isMounted = true;
    const loadStates = async () => {
      setIsLoading(true);
      const data = await locationService.getStates();
      if (isMounted) {
        setStates(data);
        setIsLoading(false);
      }
    };
    loadStates();
    return () => {
      isMounted = false;
    };
  }, []);

  // Notify step change for voice guidance
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  // Dynamic Sub-District Terminology based on State
  const subDistrictMeta = useMemo(() => {
    const code = selectedState?.code || 27;
    return getSubDistrictLabel(code, language as 'mr' | 'hi' | 'en');
  }, [selectedState, language]);

  // Handle State Select
  const handleSelectState = async (st: LocationState) => {
    setSelectedState(st);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
    setSelectedVillage(null);
    setSearchQuery('');
    setCurrentStep(2);

    setIsLoading(true);
    const distData = await locationService.getDistricts(st.name || st.code);
    setDistricts(distData);
    setIsLoading(false);
  };

  // Handle District Select
  const handleSelectDistrict = async (d: LocationDistrict) => {
    setSelectedDistrict(d);
    setSelectedSubDistrict(null);
    setSelectedVillage(null);
    setSearchQuery('');
    setCurrentStep(3);

    setIsLoading(true);
    const sdData = await locationService.getSubDistricts(d.name, selectedState?.name || stNameFallback);
    setSubDistricts(sdData);
    setIsLoading(false);
  };

  // Handle Sub-District Select
  const handleSelectSubDistrict = async (sd: LocationSubDistrict) => {
    setSelectedSubDistrict(sd);
    setSelectedVillage(null);
    setSearchQuery('');
    setCurrentStep(4);

    setIsLoading(true);
    const vData = await locationService.getVillages(
      sd.name,
      '',
      selectedState?.name || stNameFallback,
      selectedDistrict?.name || distNameFallback
    );
    setVillages(vData);
    setIsLoading(false);
  };

  // Handle Village Select (Complete)
  const handleSelectVillage = (v: LocationVillage) => {
    setSelectedVillage(v);

    if (selectedState && selectedDistrict && selectedSubDistrict) {
      const details: LocationDetails = {
        country: 'India',
        state_id: selectedState.code,
        state_name: selectedState.name,
        district_id: selectedDistrict.code,
        district_name: selectedDistrict.name,
        subdistrict_id: selectedSubDistrict.code,
        subdistrict_name: selectedSubDistrict.name,
        subdistrict_label: subDistrictMeta.labelEn,
        village_id: v.code,
        village_name: v.name,
        lgd_code: v.code,
        pincode: v.pincode,
        latitude: v.latitude,
        longitude: v.longitude,
        source: 'LGD & Indian Village Directory (vill.co.in)',
        source_date: '2025-26'
      };

      onLocationSelected(details);
    }
  };

  // Back Button Navigation
  const handleBack = () => {
    setSearchQuery('');
    if (currentStep === 4) {
      setSelectedVillage(null);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setSelectedSubDistrict(null);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setSelectedDistrict(null);
      setCurrentStep(1);
    }
  };

  // Reset entire picker
  const handleReset = () => {
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
    setSelectedVillage(null);
    setSearchQuery('');
    setCurrentStep(1);
  };

  // Filtered lists
  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return states;
    const q = searchQuery.toLowerCase().trim();
    return states.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.nameNative.mr.toLowerCase().includes(q) ||
        s.nameNative.hi.toLowerCase().includes(q)
    );
  }, [states, searchQuery]);

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return districts;
    const q = searchQuery.toLowerCase().trim();
    return districts.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.nameNative.mr.toLowerCase().includes(q) ||
        d.nameNative.hi.toLowerCase().includes(q)
    );
  }, [districts, searchQuery]);

  const filteredSubDistricts = useMemo(() => {
    if (!searchQuery.trim()) return subDistricts;
    const q = searchQuery.toLowerCase().trim();
    return subDistricts.filter(
      (sd) =>
        sd.name.toLowerCase().includes(q) ||
        sd.nameNative.mr.toLowerCase().includes(q) ||
        sd.nameNative.hi.toLowerCase().includes(q)
    );
  }, [subDistricts, searchQuery]);

  const filteredVillages = useMemo(() => {
    if (!searchQuery.trim()) return villages;
    const q = searchQuery.toLowerCase().trim();
    return villages.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.nameNative.mr.toLowerCase().includes(q) ||
        v.nameNative.hi.toLowerCase().includes(q) ||
        v.pincode.includes(q)
    );
  }, [villages, searchQuery]);

  // Localized Step Headings
  const stepTitles = {
    1: {
      en: 'Select State or Union Territory',
      mr: 'आपले राज्य किंवा केंद्रशासित प्रदेश निवडा',
      hi: 'अपना राज्य या केंद्र शासित प्रदेश चुनें'
    },
    2: {
      en: `Select District in ${selectedState?.name || ''}`,
      mr: `${selectedState?.nameNative.mr || selectedState?.name || ''} मधील जिल्हा निवडा`,
      hi: `${selectedState?.nameNative.hi || selectedState?.name || ''} में जिला चुनें`
    },
    3: {
      en: `Select ${subDistrictMeta.labelEn} in ${selectedDistrict?.name || ''}`,
      mr: `${selectedDistrict?.nameNative.mr || selectedDistrict?.name || ''} मधील ${subDistrictMeta.labelNative} निवडा`,
      hi: `${selectedDistrict?.nameNative.hi || selectedDistrict?.name || ''} में ${subDistrictMeta.labelNative} चुनें`
    },
    4: {
      en: `Select Village or Town in ${selectedSubDistrict?.name || ''}`,
      mr: `${selectedSubDistrict?.nameNative.mr || selectedSubDistrict?.name || ''} मधील गाव किंवा शहर निवडा`,
      hi: `${selectedSubDistrict?.nameNative.hi || selectedSubDistrict?.name || ''} में गांव या नगर चुनें`
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. PROGRESS INDICATOR & BACK ACTION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              {language === 'mr' ? 'मागे' : language === 'hi' ? 'पीछे' : 'Back'}
            </button>
          )}

          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary, #C2410C)' }}>
            {language === 'mr'
              ? `पायरी ${currentStep} / ४`
              : language === 'hi'
              ? `चरण ${currentStep} / ४`
              : `Step ${currentStep} of 4`}
          </span>
        </div>

        {selectedState && (
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#EF4444',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
            {language === 'mr' ? 'रीसेट' : language === 'hi' ? 'रीसेट' : 'Reset'}
          </button>
        )}
      </div>

      {/* 2. ACTIVE SELECTION BREADCRUMB BADGES */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 14px',
          borderRadius: '12px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0'
        }}
      >
        <span
          onClick={() => {
            if (selectedState) {
              setSelectedDistrict(null);
              setSelectedSubDistrict(null);
              setSelectedVillage(null);
              setCurrentStep(1);
            }
          }}
          style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            backgroundColor: selectedState ? '#EA580C' : '#E2E8F0',
            color: selectedState ? '#FFFFFF' : '#64748B',
            cursor: selectedState ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Compass size={13} />
          {selectedState ? (selectedState.nameNative[language as 'mr' | 'hi' | 'en'] || selectedState.name) : (language === 'mr' ? 'राज्य' : language === 'hi' ? 'राज्य' : 'State')}
        </span>

        <ChevronRight size={14} color="#94A3B8" />

        <span
          onClick={() => {
            if (selectedDistrict) {
              setSelectedSubDistrict(null);
              setSelectedVillage(null);
              setCurrentStep(2);
            }
          }}
          style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            backgroundColor: selectedDistrict ? '#EA580C' : '#E2E8F0',
            color: selectedDistrict ? '#FFFFFF' : '#64748B',
            cursor: selectedDistrict ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Building2 size={13} />
          {selectedDistrict ? (selectedDistrict.nameNative[language as 'mr' | 'hi' | 'en'] || selectedDistrict.name) : (language === 'mr' ? 'जिल्हा' : language === 'hi' ? 'जिला' : 'District')}
        </span>

        <ChevronRight size={14} color="#94A3B8" />

        <span
          onClick={() => {
            if (selectedSubDistrict) {
              setSelectedVillage(null);
              setCurrentStep(3);
            }
          }}
          style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            backgroundColor: selectedSubDistrict ? '#EA580C' : '#E2E8F0',
            color: selectedSubDistrict ? '#FFFFFF' : '#64748B',
            cursor: selectedSubDistrict ? 'pointer' : 'default'
          }}
        >
          {selectedSubDistrict ? (selectedSubDistrict.nameNative[language as 'mr' | 'hi' | 'en'] || selectedSubDistrict.name) : subDistrictMeta.labelNative}
        </span>

        <ChevronRight size={14} color="#94A3B8" />

        <span
          style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            backgroundColor: selectedVillage ? '#16A34A' : '#E2E8F0',
            color: selectedVillage ? '#FFFFFF' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <MapPin size={13} />
          {selectedVillage ? (selectedVillage.nameNative[language as 'mr' | 'hi' | 'en'] || selectedVillage.name) : (language === 'mr' ? 'गाव' : language === 'hi' ? 'गांव' : 'Village')}
        </span>
      </div>

      {/* 3. STEP TITLE */}
      <div>
        <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          {stepTitles[currentStep][language as 'mr' | 'hi' | 'en']}
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px', marginBottom: '10px' }}>
          {language === 'mr'
            ? 'खालील कार्डवर थेट स्पर्श करा किंवा वर शोध बॉक्स वापरा:'
            : language === 'hi'
            ? 'नीचे दिए गए कार्ड पर सीधे स्पर्श करें या खोजें:'
            : 'Tap any card directly or use the search bar above:'}
        </p>
      </div>

      {/* 4. SEARCH BOX */}
      <div style={{ position: 'relative' }}>
        <Search
          size={18}
          color="#94A3B8"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            currentStep === 1
              ? (language === 'mr' ? 'राज्य शोधा...' : language === 'hi' ? 'राज्य खोजें...' : 'Search State...')
              : currentStep === 2
              ? (language === 'mr' ? 'जिल्हा शोधा...' : language === 'hi' ? 'जिला खोजें...' : 'Search District...')
              : currentStep === 3
              ? subDistrictMeta.placeholder
              : (language === 'mr' ? 'गाव किंवा पिनकोड शोधा...' : language === 'hi' ? 'गांव या पिनकोड खोजें...' : 'Search Village or PIN...')
          }
          style={{
            width: '100%',
            padding: '12px 14px 12px 42px',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            backgroundColor: '#FFFFFF',
            fontSize: '0.96rem',
            fontWeight: 600,
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* 5. SELECTION CARDS CONTAINER */}
      <div
        style={{
          maxHeight: '260px',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '10px',
          padding: '2px'
        }}
      >
        {isLoading && (
          <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: '#64748B' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {language === 'mr' ? 'माहिती लोड होत आहे...' : language === 'hi' ? 'डेटा लोड हो रहा है...' : 'Loading locations...'}
            </span>
          </div>
        )}

        {/* STEP 1: STATES */}
        {!isLoading && currentStep === 1 && (
          filteredStates.length > 0 ? (
            filteredStates.map((st) => {
              const isSelected = selectedState?.code === st.code;
              return (
                <button
                  key={st.code}
                  type="button"
                  onClick={() => handleSelectState(st)}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #EA580C' : '1.5px solid #E2E8F0',
                    backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.08)' : '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.96rem', fontWeight: 800, color: isSelected ? '#C2410C' : '#1E293B' }}>
                    {st.nameNative[language as 'mr' | 'hi' | 'en'] || st.name}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{st.name}</span>
                    {st.category && (
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        backgroundColor: st.category === 'State' ? '#EFF6FF' : '#FEF3C7',
                        color: st.category === 'State' ? '#1D4ED8' : '#B45309',
                        fontWeight: 700
                      }}>
                        {st.category === 'State' ? (language === 'mr' ? 'राज्य' : language === 'hi' ? 'राज्य' : 'State') : (language === 'mr' ? 'केंद्रशासित' : language === 'hi' ? 'केंद्र शासित' : 'UT')}
                      </span>
                    )}
                  </span>
                </button>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
              {language === 'mr' ? 'कोणतेही राज्य आढळले नाही' : language === 'hi' ? 'कोई राज्य नहीं मिला' : 'No states found'}
            </div>
          )
        )}

        {/* STEP 2: DISTRICTS */}
        {!isLoading && currentStep === 2 && (
          filteredDistricts.length > 0 ? (
            filteredDistricts.map((d) => {
              const isSelected = selectedDistrict?.code === d.code;
              return (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => handleSelectDistrict(d)}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #EA580C' : '1.5px solid #E2E8F0',
                    backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.08)' : '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.96rem', fontWeight: 800, color: isSelected ? '#C2410C' : '#1E293B' }}>
                    {d.nameNative[language as 'mr' | 'hi' | 'en'] || d.name}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    {d.name}
                  </span>
                </button>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
              {language === 'mr' ? 'कोणताही जिल्हा आढळला नाही' : language === 'hi' ? 'कोई जिला नहीं मिला' : 'No districts found'}
            </div>
          )
        )}

        {/* STEP 3: SUB-DISTRICTS */}
        {!isLoading && currentStep === 3 && (
          filteredSubDistricts.length > 0 ? (
            filteredSubDistricts.map((sd) => {
              const isSelected = selectedSubDistrict?.code === sd.code;
              return (
                <button
                  key={sd.code}
                  type="button"
                  onClick={() => handleSelectSubDistrict(sd)}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #EA580C' : '1.5px solid #E2E8F0',
                    backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.08)' : '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.96rem', fontWeight: 800, color: isSelected ? '#C2410C' : '#1E293B' }}>
                    {sd.nameNative[language as 'mr' | 'hi' | 'en'] || sd.name}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    {sd.name}
                  </span>
                </button>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
              {language === 'mr' ? 'कोणताही तालुका आढळला नाही' : language === 'hi' ? 'कोई उप-जिला नहीं मिला' : 'No sub-districts found'}
            </div>
          )
        )}

        {/* STEP 4: VILLAGES */}
        {!isLoading && currentStep === 4 && (
          filteredVillages.length > 0 ? (
            filteredVillages.map((v) => {
              const isSelected = selectedVillage?.code === v.code;
              return (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => handleSelectVillage(v)}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #16A34A' : '1.5px solid #E2E8F0',
                    backgroundColor: isSelected ? 'rgba(22, 163, 74, 0.08)' : '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.96rem', fontWeight: 800, color: isSelected ? '#15803D' : '#1E293B' }}>
                    {v.nameNative[language as 'mr' | 'hi' | 'en'] || v.name}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    {v.pincode ? `PIN: ${v.pincode}` : (language === 'en' ? 'Village / Town' : 'गाव / शहर')}
                  </span>
                </button>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
              {language === 'mr' ? 'कोणतेही गाव आढळले नाही' : language === 'hi' ? 'कोई गांव नहीं मिला' : 'No villages found'}
            </div>
          )
        )}
      </div>

      {/* 6. VERIFIED SELECTION BANNER (IF FULLY SELECTED) */}
      {selectedVillage && selectedState && selectedDistrict && selectedSubDistrict && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            border: '1.5px solid #16A34A'
          }}
        >
          <CheckCircle2 size={22} color="#16A34A" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#166534' }}>
              {language === 'mr'
                ? '✓ व्यवसायाचे ठिकाण निश्चित केले'
                : language === 'hi'
                ? '✓ व्यावसायिक स्थान चयनित किया गया'
                : '✓ Business Location Verified'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#15803D', marginTop: '2px' }}>
              {selectedVillage.name}, {selectedSubDistrict.name} ({subDistrictMeta.labelEn}), {selectedDistrict.name}, {selectedState.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
