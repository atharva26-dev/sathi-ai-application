import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export type FontScale = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const FONT_SCALE_KEY = 'pref_font_scale';
const HIGH_CONTRAST_KEY = 'pref_high_contrast';
const REDUCED_MOTION_KEY = 'pref_reduced_motion';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontScale, setFontScaleState] = useState<FontScale>(() => {
    return storageService.get<FontScale>(FONT_SCALE_KEY, 'normal');
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return storageService.get<boolean>(HIGH_CONTRAST_KEY, false);
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return storageService.get<boolean>(REDUCED_MOTION_KEY, false);
  });

  const setFontScale = (scale: FontScale) => {
    setFontScaleState(scale);
    storageService.set(FONT_SCALE_KEY, scale);
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    storageService.set(HIGH_CONTRAST_KEY, enabled);
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    storageService.set(REDUCED_MOTION_KEY, enabled);
  };

  useEffect(() => {
    // Apply classes to body
    const body = document.body;
    body.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
    body.classList.add(`font-scale-${fontScale}`);

    if (highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
  }, [fontScale, highContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        setFontScale,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
