import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, BusinessOpportunity } from '../types';
import { profileService, DEMO_PROFILE } from '../services/profileService';
import { businessService } from '../services/businessService';
import { storageService } from '../services/storageService';

const SELECTED_OPP_KEY = 'selected_opportunity';

interface UserContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  loadDemoMode: () => void;
  resetAllData: () => void;
  selectedOpportunity: BusinessOpportunity;
  setSelectedOpportunity: (opp: BusinessOpportunity) => void;
  completeOnboarding: (answers: Partial<UserProfile>) => UserProfile;
  reloadActiveUserProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => profileService.getProfile());
  const opportunities = businessService.getOpportunities();

  const getInitialSelectedOpp = useCallback((): BusinessOpportunity => {
    const saved = storageService.get<BusinessOpportunity | null>(SELECTED_OPP_KEY, null);
    if (saved && saved.id) return saved;

    const currentProfile = profileService.getProfile();
    const desired = currentProfile.desiredBusiness;
    if (desired) {
      const match = opportunities.find((o) =>
        o.title.toLowerCase().includes(desired.toLowerCase()) ||
        (o.titleNative.mr && o.titleNative.mr.includes(desired))
      );
      if (match) return match;
    }
    return opportunities[0];
  }, [opportunities]);

  const [selectedOpportunity, setSelectedOpportunity] = useState<BusinessOpportunity>(getInitialSelectedOpp);

  const reloadActiveUserProfile = useCallback(() => {
    const freshProfile = profileService.getProfile();
    setProfile(freshProfile);
    setSelectedOpportunity(getInitialSelectedOpp());
  }, [getInitialSelectedOpp]);

  // Listen for user switch/login/logout events across tabs or services
  useEffect(() => {
    const handleUserChanged = () => {
      reloadActiveUserProfile();
    };
    window.addEventListener('saathi_active_user_changed', handleUserChanged);
    return () => window.removeEventListener('saathi_active_user_changed', handleUserChanged);
  }, [reloadActiveUserProfile]);

  const handleSetSelectedOpportunity = (opp: BusinessOpportunity) => {
    setSelectedOpportunity(opp);
    storageService.set(SELECTED_OPP_KEY, opp);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    const updated = profileService.saveProfile(data);
    setProfile(updated);
  };

  const loadDemoMode = () => {
    const demo = profileService.loadDemoProfile();
    setProfile(demo);
    storageService.remove(SELECTED_OPP_KEY);
    setSelectedOpportunity(opportunities[0]);
  };

  const resetAllData = () => {
    const fresh = profileService.resetProfile();
    setProfile(fresh);
    storageService.remove(SELECTED_OPP_KEY);
    setSelectedOpportunity(opportunities[0]);
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
        completeOnboarding,
        reloadActiveUserProfile
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
