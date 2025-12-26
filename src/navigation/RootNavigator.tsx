import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../context/OnboardingContext';

const RootNavigator = () => {
    const { user, isLoading } = useAuth();
    const { hasSeenOnboarding } = useOnboarding();

    // While auth or onboarding flag is loading, show nothing to avoid flicker
    if (isLoading || hasSeenOnboarding === null) return null;

    let content;
    if (!user) {
        content = <AuthNavigator />;
    } else if (!hasSeenOnboarding) {
        content = <OnboardingNavigator />;
    } else {
        content = <AppNavigator />;
    }

    return <NavigationContainer>{content}</NavigationContainer>;
};

export default RootNavigator; 