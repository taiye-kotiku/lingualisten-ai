import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingSlidesScreen from '../screens/App/OnboardingSlidesScreen';

type OnboardingStackParamList = {
    Onboarding: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingSlidesScreen} />
    </Stack.Navigator>
);

export default OnboardingNavigator; 