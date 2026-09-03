import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncService, QueuedAction } from '../services/syncService';

interface OfflineContextType {
  isOnline: boolean;
  isSyncing: boolean;
  queuedActionsCount: number;
  triggerManualSync: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [queuedActionsCount, setQueuedActionsCount] = useState<number>(() => {
    return syncService.getQueue().length;
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerManualSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerManualSync = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    try {
      await syncService.processQueue();
      setQueuedActionsCount(syncService.getQueue().length);
    } catch (err) {
      console.warn('Manual sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSyncing,
        queuedActionsCount,
        triggerManualSync
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
