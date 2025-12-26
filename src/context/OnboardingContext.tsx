import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingContextValue {
    hasSeenOnboarding: boolean | null; // null while loading from storage
    completeOnboarding: () => Promise<void>;
    resetOnboarding: () => Promise<void>; // force show again (e.g., after sign-up)
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

const STORAGE_KEY = '@hasSeenOnboarding';

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem(STORAGE_KEY);
                setHasSeenOnboarding(value === 'true');
            } catch {
                setHasSeenOnboarding(false);
            }
        })();
    }, []);

    const completeOnboarding = async () => {
        setHasSeenOnboarding(true);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, 'true');
        } catch {
            // ignore
        }
    };

    const resetOnboarding = async () => {
        setHasSeenOnboarding(false);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, 'false');
        } catch {
            // ignore
        }
    };

    return (
        <OnboardingContext.Provider value={{ hasSeenOnboarding, completeOnboarding, resetOnboarding }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const ctx = useContext(OnboardingContext);
    if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
    return ctx;
}; 