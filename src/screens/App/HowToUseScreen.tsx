import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getTheme } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

const HowToUseScreen = () => {
    const navigation = useNavigation();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    const steps = [
        {
            title: 'Enter a Code',
            description: 'Tap "Enter Flashcard Code" on the Home tab and type the card’s alphanumeric code.'
        },
        {
            title: 'Listen & Repeat',
            description: 'Press the play button to hear native pronunciation in Yoruba and English. Repeat the audio as many times as you like.'
        },
        {
            title: 'Browse Categories',
            description: 'Use the Browse tab to explore phrases grouped by topics such as Greetings, Food, Directions and more.'
        },
        {
            title: 'Track Your Learning',
            description: 'Mark a phrase as learned and set a daily listening target from your Profile to stay on track.'
        },
        {
            title: 'Offline Access',
            description: 'Previously played audio is cached automatically, so you can keep practising without internet.'
        }
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={theme.COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.COLORS.textPrimary }]}>How to Use</Text>
                <View style={styles.backButton} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {steps.map((s, idx) => (
                    <View key={idx} style={[styles.stepCard, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}>
                        <Text style={[styles.stepTitle, { color: theme.COLORS.textPrimary }]}>{idx + 1}. {s.title}</Text>
                        <Text style={[styles.stepDesc, { color: theme.COLORS.textSecondary }]}>{s.description}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    backButton: {
        width: 40,
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    stepCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        marginBottom: 8,
    },
    stepDesc: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
    },
});

export default HowToUseScreen;
