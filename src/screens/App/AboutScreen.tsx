import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

const AboutScreen = () => {
    const navigation = useNavigation();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    const handleLinkPress = (url: string) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Cannot open link', 'Unable to open the requested link.');
            }
        });
    };

    const InfoItem = ({ icon, title, value, onPress }: {
        icon: keyof typeof Feather.glyphMap;
        title: string;
        value: string;
        onPress?: () => void;
    }) => (
        <TouchableOpacity
            style={[styles.infoItem, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={[styles.infoIcon, { backgroundColor: theme.COLORS.primary + '20' }]}>
                <Feather name={icon} size={20} color={theme.COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { color: theme.COLORS.textSecondary }]}>{title}</Text>
                <Text style={[styles.infoValue, { color: theme.COLORS.textPrimary }]}>{value}</Text>
            </View>
            {onPress && <Feather name="external-link" size={16} color={theme.COLORS.textSecondary} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={theme.COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.COLORS.textPrimary }]}>About</Text>
                    <View style={styles.headerButton} />
                </View>

                {/* App Logo & Name */}
                <View style={styles.appInfo}>
                    <View style={[styles.appLogo, { backgroundColor: theme.COLORS.primary }]}>
                        <Text style={[styles.appLogoText, { color: theme.COLORS.background }]}>LL</Text>
                    </View>
                    <Text style={[styles.appName, { color: theme.COLORS.textPrimary }]}>LinguaListen</Text>
                    <Text style={[styles.appTagline, { color: theme.COLORS.textSecondary }]}>
                        Learn languages through interactive flashcards
                    </Text>
                </View>

                {/* App Details */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>App Information</Text>

                    <InfoItem
                        icon="smartphone"
                        title="Version"
                        value="1.0.0"
                    />

                    <InfoItem
                        icon="calendar"
                        title="Release Date"
                        value="07/2025"
                    />

                    <InfoItem
                        icon="code"
                        title="Built With"
                        value="React Native & Expo"
                    />

                    <InfoItem
                        icon="globe"
                        title="Languages"
                        value="Yoruba & English"
                    />
                </View>

                {/* Features */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Key Features</Text>
                    <View style={styles.featuresList}>
                        <View style={styles.featureItem}>
                            <Feather name="camera" size={16} color={theme.COLORS.primary} />
                            <Text style={[styles.featureText, { color: theme.COLORS.textSecondary }]}>QR Code Scanning</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="volume-2" size={16} color={theme.COLORS.primary} />
                            <Text style={[styles.featureText, { color: theme.COLORS.textSecondary }]}>Audio Pronunciation</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="search" size={16} color={theme.COLORS.primary} />
                            <Text style={[styles.featureText, { color: theme.COLORS.textSecondary }]}>Browse & Search</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="moon" size={16} color={theme.COLORS.primary} />
                            <Text style={[styles.featureText, { color: theme.COLORS.textSecondary }]}>Dark Mode Support</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="bar-chart-2" size={16} color={theme.COLORS.primary} />
                            <Text style={[styles.featureText, { color: theme.COLORS.textSecondary }]}>Progress Tracking</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Feather name="clock" size={16} color={theme.COLORS.primary} />
                            <Text style={[styles.featureText, { color: theme.COLORS.textSecondary }]}>Recent Activity</Text>
                        </View>
                    </View>
                </View>

                {/* Links */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Links</Text>

                    <InfoItem
                        icon="globe"
                        title="Website"
                        value="www.lingualisten.com"
                        onPress={() => handleLinkPress('https://www.lingualisten.com')}
                    />

                    <InfoItem
                        icon="mail"
                        title="Support"
                        value="support@lingualisten.com"
                        onPress={() => handleLinkPress('mailto:support@lingualisten.com')}
                    />

                    <InfoItem
                        icon="file-text"
                        title="Terms of Service"
                        value="View Terms"
                        onPress={() => handleLinkPress('https://www.lingualisten.com/terms')}
                    />
                </View>

                {/* Credits */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Credits</Text>
                    <Text style={[styles.creditsText, { color: theme.COLORS.textSecondary }]}>
                        Developed with ❤️ for language learners everywhere.
                        {'\n\n'}Special thanks to the Yoruba language community for their support and guidance in creating authentic learning content.
                        {'\n\n'}Icons provided by Feather Icons and Expo Vector Icons.
                    </Text>
                </View>

                {/* Copyright */}
                <View style={styles.footer}>
                    <Text style={[styles.copyrightText, { color: theme.COLORS.textSecondary }]}>
                        © 2024 LinguaListen. All rights reserved.
                    </Text>
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
    appInfo: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    appLogo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appLogoText: {
        fontSize: 28,
        fontFamily: 'Nunito-Bold',
        fontWeight: '700',
    },
    appName: {
        fontSize: 24,
        fontFamily: 'Nunito-Bold',
        fontWeight: '700',
        lineHeight: 32,
        marginBottom: 8,
    },
    appTagline: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 22,
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
    },
    infoValue: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        lineHeight: 22,
        marginTop: 2,
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 22,
    },
    creditsText: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 22,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        alignItems: 'center',
    },
    copyrightText: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        lineHeight: 18,
        textAlign: 'center',
    },
});

export default AboutScreen; 