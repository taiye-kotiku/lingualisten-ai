import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    const PolicySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <View style={styles.policySection}>
            <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>{title}</Text>
            {children}
        </View>
    );

    const PolicyText = ({ children }: { children: React.ReactNode }) => (
        <Text style={[styles.policyText, { color: theme.COLORS.textSecondary }]}>{children}</Text>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={theme.COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.COLORS.textPrimary }]}>Privacy Policy</Text>
                    <View style={styles.headerButton} />
                </View>

                {/* Last Updated */}
                <View style={styles.lastUpdated}>
                    <Text style={[styles.lastUpdatedText, { color: theme.COLORS.textSecondary }]}>
                        Last updated: July 1, 2025
                    </Text>
                </View>

                {/* Privacy Policy Content */}
                <View style={styles.content}>
                    <PolicySection title="Introduction">
                        <PolicyText>
                            Welcome to LinguaListen ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services.
                        </PolicyText>
                        <PolicyText>
                            By using our app, you agree to the collection and use of information in accordance with this policy.
                        </PolicyText>
                    </PolicySection>

                    <PolicySection title="Information We Collect">
                        <Text style={[styles.subSectionTitle, { color: theme.COLORS.textPrimary }]}>Personal Information</Text>
                        <PolicyText>
                            We collect information you provide directly to us when you create or update your account, including:
                            {'\n'}• Name and email address
                            {'\n'}• Saved favorites or bookmarked phrases
                            {'\n'}• Preferences such as theme (dark/light mode)
                        </PolicyText>

                        <Text style={[styles.subSectionTitle, { color: theme.COLORS.textPrimary }]}>Content Interaction Data</Text>
                        <PolicyText>
                            When you interact with flashcards, scan QR codes, or play audio clips, we collect anonymized metrics such as:
                            {'\n'}• The code scanned or phrase viewed
                            {'\n'}• Timestamps of recent activity
                            {'\n'}• Whether audio was streamed or played from cache (for offline use)
                        </PolicyText>

                        <Text style={[styles.subSectionTitle, { color: theme.COLORS.textPrimary }]}>Device & Usage Information</Text>
                        <PolicyText>
                            We automatically collect limited technical data required to keep the app running smoothly, such as device model, operating system, crash logs, and general usage statistics. This information is aggregated and does not personally identify you.
                        </PolicyText>
                    </PolicySection>

                    <PolicySection title="How We Use Your Information">
                        <PolicyText>
                            We use the information we collect to:
                            {'\n'}• Deliver phrase text and audio content that matches the flashcard codes you enter or scan
                            {'\n'}• Remember your favorites and recent activity across sessions (locally on your device)
                            {'\n'}• Send password-reset emails and service-related notifications
                            {'\n'}• Diagnose crashes, improve performance, and add new features
                            {'\n'}• Provide customer support when you contact us
                        </PolicyText>
                    </PolicySection>

                    <PolicySection title="Information Sharing">
                        <PolicyText>
                            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
                            {'\n'}• With service providers who help us operate our app
                            {'\n'}• When required by law or to protect our rights
                            {'\n'}• In connection with a business transfer or merger
                        </PolicyText>
                    </PolicySection>

                    <PolicySection title="Data Security">
                        <PolicyText>
                            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                        </PolicyText>
                    </PolicySection>

                    <PolicySection title="Data Retention">
                        <PolicyText>
                            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                        </PolicyText>
                    </PolicySection>

                    <PolicySection title="Your Rights">
                        <PolicyText>
                            You have the right to:
                            {'\n'}• Access and update your personal information
                            {'\n'}• Delete your account and associated data
                            {'\n'}• Opt-out of certain communications
                            {'\n'}• Request a copy of your data
                        </PolicyText>
                    </PolicySection>

                    <PolicySection title="Children's Privacy">
                        <PolicyText>
                            Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                        </PolicyText>
                    </PolicySection>

                    <PolicySection title="Changes to This Policy">
                        <PolicyText>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app and updating the "Last updated" date.
                        </PolicyText>
                    </PolicySection>

                    <PolicySection title="Contact Us">
                        <PolicyText>
                            If you have any questions about this Privacy Policy, please contact us at:
                            {'\n'}Email: privacy@lingualisten.com
                            {'\n'}Phone: +1 (800) 123-4567
                        </PolicyText>
                    </PolicySection>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
    },
    backButton: {
        padding: 8,
        width: 40,
        alignItems: 'flex-start',
    },
    headerButton: {
        width: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        lineHeight: 24,
    },
    lastUpdated: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    lastUpdatedText: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    content: {
        paddingHorizontal: 20,
    },
    policySection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 12,
    },
    subSectionTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        lineHeight: 22,
        marginTop: 16,
        marginBottom: 8,
    },
    policyText: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 22,
        marginBottom: 12,
    },
});

export default PrivacyPolicyScreen; 