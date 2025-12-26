import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import { useToast } from './ToastContext';

interface UsageContextValue {
  secondsToday: number;
  targetMinutes: number;
  setTargetMinutes: (mins: number) => Promise<void>;
}

const UsageContext = createContext<UsageContextValue | undefined>(undefined);

const STORAGE_KEY_PREFIX = '@usage_today_';
const TARGET_KEY = '@usage_target_minutes';

function getDateKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [secondsToday, setSecondsToday] = useState(0);
  const [targetMinutes, setTargetMinutesState] = useState(30);
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const currentDateKeyRef = useRef(getDateKey());
  const { showToast } = useToast();
  const toastShownRef = useRef(false);

  // Load initial values
  useEffect(() => {
    (async () => {
      try {
        const storedSeconds = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + currentDateKeyRef.current);
        if (storedSeconds) setSecondsToday(Number(storedSeconds));
        const target = await AsyncStorage.getItem(TARGET_KEY);
        if (target) setTargetMinutesState(Number(target));
      } catch { }
    })();
  }, []);

  // Persist secondsToday when it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY_PREFIX + currentDateKeyRef.current, String(secondsToday)).catch(() => { });
  }, [secondsToday]);

  // Handle app state to start/stop timer
  useEffect(() => {
    const startTimer = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        const todayKey = getDateKey();
        if (todayKey !== currentDateKeyRef.current) {
          // New day – reset counter
          currentDateKeyRef.current = todayKey;
          setSecondsToday(0);
          toastShownRef.current = false;
        }
        setSecondsToday((s) => s + 1);
      }, 1000);
    };
    const stopTimer = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    startTimer(); // Start initially (app already active)
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') startTimer();
      else stopTimer();
    });
    return () => {
      stopTimer();
      sub.remove();
    };
  }, []);

  useEffect(() => {
    const minutes = Math.floor(secondsToday / 60);
    if (minutes >= targetMinutes && !toastShownRef.current) {
      showToast('Congratulations! You reached your daily target.', { type: 'success' });
      toastShownRef.current = true;
    }
  }, [secondsToday, targetMinutes, showToast]);

  useEffect(() => {
    toastShownRef.current = false;
  }, [targetMinutes]);

  const setTargetMinutes = async (mins: number) => {
    setTargetMinutesState(mins);
    await AsyncStorage.setItem(TARGET_KEY, String(mins));
  };

  return (
    <UsageContext.Provider value={{ secondsToday, targetMinutes, setTargetMinutes }}>
      {children}
    </UsageContext.Provider>
  );
};

export const useUsage = () => {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error('useUsage must be used within UsageProvider');
  return ctx;
}; 