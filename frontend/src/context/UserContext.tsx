import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, BusinessOpportunity } from '../types';
import { profileService } from '../services/profileService';
import { businessService } from '../services/businessService';

interface UserContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  loadDemoMode: () => void;
  resetAllData: () => void;
  selectedOpportunity: BusinessOpportunity;
  setSelectedOpportunity: (opp: BusinessOpportunity) => void;
  completeOnboarding: (answers: Partial<UserProfile>) => UserProfile;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => profileService.getProfile());
  const opportunities = businessService.getOpportunities();
  
  const [selectedOpportunity, setSelectedOpportunity] = useState<BusinessOpportunity>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('saathi_selected_opportunity') : null;
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const currentProfile = profileService.getProfile();
    const desired = currentProfile.desiredBusiness;
    if (desired) {
      const match = opportunities.find((o) => o.title.toLowerCase().includes(desired.toLowerCase()) || (o.titleNative.mr && o.titleNative.mr.includes(desired)));
      if (match) return match;
    }
    return opportunities[0];
  });

  const handleSetSelectedOpportunity = (opp: BusinessOpportunity) => {
    setSelectedOpportunity(opp);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saathi_selected_opportunity', JSON.stringify(opp));
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    const updated = profileService.saveProfile(data);
    setProfile(updated);
  };

  const loadDemoMode = () => {
    const demo = profileService.loadDemoProfile();
    setProfile(demo);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('saathi_selected_opportunity');
    }
  };

  const resetAllData = () => {
    const fresh = profileService.resetProfile();
    setProfile(fresh);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('saathi_selected_opportunity');
    }
  };

  const completeOnboarding = (answers: Partial<UserProfile>): UserProfile => {
    const updated = profileService.saveProfile({
      ...answers,
      isOnboarded: true
    });
    setProfile(updated);
    return updated;
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        loadDemoMode,
        resetAllData,
        selectedOpportunity,
        setSelectedOpportunity: handleSetSelectedOpportunity,
        completeOnboarding
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
