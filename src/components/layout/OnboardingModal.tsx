import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OnboardingModal = () => {
    return (
        <View style={styles.container}>
            <Text>Onboarding Modal</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OnboardingModal;
