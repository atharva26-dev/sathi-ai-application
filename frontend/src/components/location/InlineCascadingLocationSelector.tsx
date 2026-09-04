import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Search, CheckCircle2, ChevronDown, Compass, Building2, Landmark, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  locationService,
  getSubDistrictLabel,
  slugifyLocation,
  DistrictDataChunk
} from '../../services/locationService';

export interface SelectedLocationData {
  state: string;
  district: string;
  subDistrict: string;
  village: string;
  pincode: string;
}

interface InlineCascadingLocationSelectorProps {
  initialState?: string;
  initialDistrict?: string;
  initialSubDistrict?: string;
  initialVillage?: string;
  initialPincode?: string;
  onLocationChange: (loc: SelectedLocationData) => void;
}

export const InlineCascadingLocationSelector: React.FC<InlineCascadingLocationSelectorProps> = ({
  initialState = 'Maharashtra',
  initialDistrict = 'Sangli',
  initialSubDistrict = 'Palus',
  initialVillage = 'Palus',
  initialPincode = '416310',
  onLocationChange
}) => {
  const { language } = useLanguage();

  // Selected values
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>(initialSubDistrict);
  const [selectedVillage, setSelectedVillage] = useState<string>(initialVillage);
  const [selectedPincode, setSelectedPincode] = useState<string>(initialPincode);

  // Available options
  const [allStates, setAllStates] = useState<string[]>([]);
  const [allDistricts, setAllDistricts] = useState<string[]>([]);
  const [allSubDistricts, setAllSubDistricts] = useState<string[]>([]);
  const [allVillages, setAllVillages] = useState<Array<{ name: string; pincode: string }>>([]);

  // Search filter for villages
  const [villageSearch, setVillageSearch] = useState<string>('');

  // Loading states
  const [isLoadingStates, setIsLoadingStates] = useState<boolean>(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  // Current subdistrict terminology (Taluka / Tehsil / Mandal / Block)
  const subDistrictMeta = useMemo(() => {
    return getSubDistrictLabel(selectedState || 'Maharashtra', language as 'mr' | 'hi' | 'en');
  }, [selectedState, language]);

  // 1. Load All States on Mount
  useEffect(() => {
    let isMounted = true;
    const loadStates = async () => {
      setIsLoadingStates(true);
      try {
        const statesList = await locationService.getHierarchyStates();
        if (isMounted && statesList.length > 0) {
          setAllStates(statesList);
        }
      } catch (err) {
        console.warn('Failed to load hierarchy states:', err);
      } finally {
        if (isMounted) setIsLoadingStates(false);
      }
    };
    loadStates();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load Districts when State Changes
  useEffect(() => {
    let isMounted = true;
    if (!selectedState) {
      setAllDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      setIsLoadingDistricts(true);
      try {
        const districts = await locationService.getHierarchyDistricts(selectedState);
        if (isMounted) {
          setAllDistricts(districts);
        }
      } catch (err) {
        console.warn('Failed to load districts for state:', selectedState, err);
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    };
    loadDistricts();
    return () => {
      isMounted = false;
    };
  }, [selectedState]);

  // 3. Load District Data (Sub-districts + Villages) when District Changes
  useEffect(() => {
    let isMounted = true;
    if (!selectedState || !selectedDistrict) {
      setAllSubDistricts([]);
      setAllVillages([]);
      return;
    }

    const loadDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const chunk = await locationService.getDistrictDetails(selectedState, selectedDistrict);
        if (isMounted && chunk && chunk.subdistricts) {
          const subNames = Object.keys(chunk.subdistricts).sort();
          setAllSubDistricts(subNames);

          // If a subdistrict is currently selected, populate its villages
          if (selectedSubDistrict && chunk.subdistricts[selectedSubDistrict]) {
            const vList = chunk.subdistricts[selectedSubDistrict] || [];
            const pins = chunk.pincodes || {};
            setAllVillages(vList.map((v) => ({ name: v, pincode: pins[v] || '' })));
          }
        }
      } catch (err) {
        console.warn('Failed to load district chunk:', err);
      } finally {
        if (isMounted) setIsLoadingDetails(false);
      }
    };
    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedState, selectedDistrict]);

  // 4. Update Villages when Sub-District Changes
  useEffect(() => {
    if (!selectedState || !selectedDistrict || !selectedSubDistrict) {
      setAllVillages([]);
      return;
    }

    const updateVillages = async () => {
      const chunk = await locationService.getDistrictDetails(selectedState, selectedDistrict);
      if (chunk && chunk.subdistricts) {
        const key = Object.keys(chunk.subdistricts).find(
          (k) => k.toLowerCase() === selectedSubDistrict.toLowerCase()
        );
        const vList = key ? chunk.subdistricts[key] || [] : [];
        const pins = chunk.pincodes || {};
        setAllVillages(vList.map((v) => ({ name: v, pincode: pins[v] || '' })));
      }
    };
    updateVillages();
  }, [selectedState, selectedDistrict, selectedSubDistrict]);

  // Handler: State changed
  const handleStateChange = (st: string) => {
    setSelectedState(st);
    setSelectedDistrict('');
    setSelectedSubDistrict('');
    setSelectedVillage('');
    setSelectedPincode('');
    setVillageSearch('');
  };

  // Handler: District changed
  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    setSelectedSubDistrict('');
    setSelectedVillage('');
    setSelectedPincode('');
    setVillageSearch('');
  };

  // Handler: Sub-District changed
  const handleSubDistrictChange = (sd: string) => {
    setSelectedSubDistrict(sd);
    setSelectedVillage('');
    setSelectedPincode('');
    setVillageSearch('');
  };

  // Handler: Village selected
  const handleVillageChange = (vName: string) => {
    setSelectedVillage(vName);
    const found = allVillages.find((v) => v.name.toLowerCase() === vName.toLowerCase());
    const pin = found?.pincode || '';
    setSelectedPincode(pin);

    // Notify parent of verified location
    onLocationChange({
      state: selectedState,
      district: selectedDistrict,
      subDistrict: selectedSubDistrict,
      village: vName,
      pincode: pin
    });
  };

  // Filtered villages list based on search query
  const filteredVillages = useMemo(() => {
    if (!villageSearch.trim()) return allVillages;
    const q = villageSearch.toLowerCase().trim();
    return allVillages.filter(
      (v) => v.name.toLowerCase().includes(q) || (v.pincode && v.pincode.includes(q))
    );
  }, [allVillages, villageSearch]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        padding: '0.85rem',
        backgroundColor: '#F8FAFC',
        border: '1.5px solid #E2E8F0',
        borderRadius: '12px'
      }}
    >
      {/* 1. STATE SELECTOR */}
      <div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#334155',
            marginBottom: '0.2rem'
          }}
        >
          <Compass size={13} color="#EA580C" />
          <span>1. {language === 'en' ? 'State / UT' : language === 'hi' ? 'राज्य / केंद्र शासित प्रदेश' : 'राज्य निवडा'}</span>
          <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            disabled={isLoadingStates}
            style={{
              width: '100%',
              padding: '0.6rem 2rem 0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#0F172A',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">
              -- {language === 'en' ? 'Select State' : language === 'hi' ? 'राज्य चुनें' : 'राज्य निवडा'} --
            </option>
            {allStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            color="#64748B"
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* 2. DISTRICT SELECTOR */}
      <div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: selectedState ? '#334155' : '#94A3B8',
            marginBottom: '0.2rem'
          }}
        >
          <Building2 size={13} color={selectedState ? '#EA580C' : '#94A3B8'} />
          <span>2. {language === 'en' ? 'District' : language === 'hi' ? 'जिला' : 'जिल्हा निवडा'}</span>
          <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!selectedState || isLoadingDistricts}
            style={{
              width: '100%',
              padding: '0.6rem 2rem 0.6rem 0.75rem',
              borderRadius: '8px',
              border: selectedState ? '1px solid #CBD5E1' : '1px dashed #CBD5E1',
              backgroundColor: selectedState ? '#FFFFFF' : '#F1F5F9',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: selectedState ? '#0F172A' : '#94A3B8',
              appearance: 'none',
              cursor: selectedState ? 'pointer' : 'not-allowed'
            }}
          >
            <option value="">
              --{' '}
              {!selectedState
                ? (language === 'en' ? 'Select State First' : 'आधी राज्य निवडा')
                : (language === 'en' ? 'Select District' : language === 'hi' ? 'जिला चुनें' : 'जिल्हा निवडा')}{' '}
              --
            </option>
            {allDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            color="#64748B"
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* 3. SUB-DISTRICT (TALUKA / TEHSIL / MANDAL / BLOCK) SELECTOR */}
      <div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: selectedDistrict ? '#334155' : '#94A3B8',
            marginBottom: '0.2rem'
          }}
        >
          <Landmark size={13} color={selectedDistrict ? '#EA580C' : '#94A3B8'} />
          <span>3. {subDistrictMeta.labelNative} ({subDistrictMeta.labelEn})</span>
          <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedSubDistrict}
            onChange={(e) => handleSubDistrictChange(e.target.value)}
            disabled={!selectedDistrict || isLoadingDetails}
            style={{
              width: '100%',
              padding: '0.6rem 2rem 0.6rem 0.75rem',
              borderRadius: '8px',
              border: selectedDistrict ? '1px solid #CBD5E1' : '1px dashed #CBD5E1',
              backgroundColor: selectedDistrict ? '#FFFFFF' : '#F1F5F9',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: selectedDistrict ? '#0F172A' : '#94A3B8',
              appearance: 'none',
              cursor: selectedDistrict ? 'pointer' : 'not-allowed'
            }}
          >
            <option value="">
              --{' '}
              {!selectedDistrict
                ? (language === 'en' ? 'Select District First' : 'आधी जिल्हा निवडा')
                : `${subDistrictMeta.placeholder}`}{' '}
              --
            </option>
            {allSubDistricts.map((sd) => (
              <option key={sd} value={sd}>
                {sd}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            color="#64748B"
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* 4. VILLAGE / TOWN SELECTOR WITH SEARCH & PIN CODES */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: selectedSubDistrict ? '#334155' : '#94A3B8'
            }}
          >
            <Home size={13} color={selectedSubDistrict ? '#16A34A' : '#94A3B8'} />
            <span>4. {language === 'en' ? 'Village / Town' : language === 'hi' ? 'गांव / शहर' : 'गाव / शहर निवडा'}</span>
            <span style={{ color: '#EF4444' }}>*</span>
          </label>
          {allVillages.length > 0 && (
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
              {allVillages.length} {language === 'en' ? 'villages available' : 'गावे उपलब्ध'}
            </span>
          )}
        </div>

        {/* Optional quick search for large village lists */}
        {selectedSubDistrict && allVillages.length > 10 && (
          <div style={{ position: 'relative', marginBottom: '0.35rem' }}>
            <Search
              size={14}
              color="#94A3B8"
              style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={villageSearch}
              onChange={(e) => setVillageSearch(e.target.value)}
              placeholder={language === 'en' ? 'Type to filter village or PIN...' : 'गावाचे नाव किंवा पिन शोधा...'}
              style={{
                width: '100%',
                padding: '0.4rem 0.5rem 0.4rem 1.7rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.8rem',
                backgroundColor: '#FFFFFF'
              }}
            />
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <select
            value={selectedVillage}
            onChange={(e) => handleVillageChange(e.target.value)}
            disabled={!selectedSubDistrict}
            style={{
              width: '100%',
              padding: '0.6rem 2rem 0.6rem 0.75rem',
              borderRadius: '8px',
              border: selectedSubDistrict ? '1.5px solid #16A34A' : '1px dashed #CBD5E1',
              backgroundColor: selectedSubDistrict ? '#FFFFFF' : '#F1F5F9',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: selectedSubDistrict ? '#0F172A' : '#94A3B8',
              appearance: 'none',
              cursor: selectedSubDistrict ? 'pointer' : 'not-allowed'
            }}
          >
            <option value="">
              --{' '}
              {!selectedSubDistrict
                ? (language === 'en' ? 'Select Sub-District First' : 'आधी तालुका निवडा')
                : (language === 'en' ? 'Choose Village from List' : 'यादीतून गाव निवडा')}{' '}
              --
            </option>
            {filteredVillages.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} {v.pincode ? `(PIN: ${v.pincode})` : ''}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            color="#64748B"
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* CONFIRMED SELECTION BADGE */}
      {selectedVillage && selectedSubDistrict && selectedDistrict && selectedState && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.55rem 0.75rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(22, 163, 74, 0.08)',
            border: '1px solid #16A34A',
            marginTop: '0.2rem'
          }}
        >
          <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: '0.82rem' }}>
            <div style={{ fontWeight: 800, color: '#15803D' }}>
              📍 {selectedVillage}, {selectedSubDistrict}
              {selectedPincode && (
                <span
                  style={{
                    marginLeft: '6px',
                    fontSize: '0.74rem',
                    backgroundColor: '#DCFCE7',
                    color: '#166534',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}
                >
                  PIN: {selectedPincode}
                </span>
              )}
            </div>
            <div style={{ color: '#475569', fontSize: '0.74rem', marginTop: '1px' }}>
              {selectedDistrict}, {selectedState}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
