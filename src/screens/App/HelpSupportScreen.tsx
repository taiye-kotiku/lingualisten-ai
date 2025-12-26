import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const HelpSupportScreen = () => {
    const navigation = useNavigation();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

    const faqData: FAQItem[] = [
        {
            id: '1',
            question: 'How do I scan QR codes on flashcards?',
            answer: 'Tap the "Scan QR Code" button on the home screen, allow camera permissions, and point your camera at the QR code on your flashcard. The app will automatically detect and process the code.'
        },
        {
            id: '2',
            question: 'What if my code doesn\'t work?',
            answer: 'Make sure you\'ve entered the code exactly as shown on your flashcard, including any dashes or special characters. If the code still doesn\'t work, it may not be in our database yet.'
        },
        {
            id: '3',
            question: 'Can I use the app offline?',
            answer: 'You need an internet connection to load new phrases and audio files. However, recently accessed content may be cached for offline use.'
        },
        {
            id: '4',
            question: 'How do I change my password?',
            answer: 'Currently, password changes are not available in the app. Please contact support for assistance with password changes.'
        },
        {
            id: '5',
            question: 'Why isn\'t the audio playing?',
            answer: 'Check your device volume and ensure you have a stable internet connection. If the problem persists, try restarting the app or contact support.'
        },
        {
            id: '6',
            question: 'How do I report a bug or issue?',
            answer: 'You can contact our support team using the contact options below, or send us an email with details about the issue you\'re experiencing.'
        }
    ];

    const handleEmailSupport = () => {
        const email = 'support@lingualisten.com';
        const subject = 'LinguaListen Support Request';
        const body = 'Please describe your issue or question here...';

        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.canOpenURL(mailtoUrl).then(supported => {
            if (supported) {
                Linking.openURL(mailtoUrl);
            } else {
                Alert.alert('Email Not Available', 'Please contact us at support@lingualisten.com');
            }
        });
    };

    const handlePhoneSupport = () => {
        const phoneNumber = 'tel:+18001234567'; // US toll-free example

        Linking.canOpenURL(phoneNumber).then(supported => {
            if (supported) {
                Linking.openURL(phoneNumber);
            } else {
                Alert.alert('Phone Not Available', 'Please call us at +1 (800) 123-4567');
            }
        });
    };

    const toggleFAQ = (id: string) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const ContactOption = ({ icon, title, subtitle, onPress }: {
        icon: keyof typeof Feather.glyphMap;
        title: string;
        subtitle: string;
        onPress: () => void;
    }) => (
        <TouchableOpacity style={[styles.contactOption, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]} onPress={onPress}>
            <View style={[styles.contactIcon, { backgroundColor: theme.COLORS.primary + '20' }]}>
                <Feather name={icon} size={24} color={theme.COLORS.primary} />
            </View>
            <View style={styles.contactContent}>
                <Text style={[styles.contactTitle, { color: theme.COLORS.textPrimary }]}>{title}</Text>
                <Text style={[styles.contactSubtitle, { color: theme.COLORS.textSecondary }]}>{subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.COLORS.textSecondary} />
        </TouchableOpacity>
    );

    const FAQItem = ({ item }: { item: FAQItem }) => {
        const isExpanded = expandedFAQ === item.id;

        return (
            <View style={[styles.faqItem, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}>
                <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFAQ(item.id)}>
                    <Text style={[styles.faqQuestion, { color: theme.COLORS.textPrimary }]}>{item.question}</Text>
                    <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={theme.COLORS.textSecondary} />
                </TouchableOpacity>
                {isExpanded && (
                    <View style={styles.faqAnswerContainer}>
                        <Text style={[styles.faqAnswer, { color: theme.COLORS.textSecondary }]}>{item.answer}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={theme.COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.COLORS.textPrimary }]}>Help & Support</Text>
                    <View style={styles.headerButton} />
                </View>

                {/* Contact Options */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Get in Touch</Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.COLORS.textSecondary }]}>
                        Need immediate help? Contact our support team
                    </Text>

                    <ContactOption
                        icon="mail"
                        title="Email Support"
                        subtitle="support@lingualisten.com"
                        onPress={handleEmailSupport}
                    />

                    <ContactOption
                        icon="phone"
                        title="Phone Support"
                        subtitle="+1 (800) 123-4567"
                        onPress={handlePhoneSupport}
                    />
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Frequently Asked Questions</Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.COLORS.textSecondary }]}>
                        Find quick answers to common questions
                    </Text>

                    {faqData.map(item => (
                        <FAQItem key={item.id} item={item} />
                    ))}
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
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        marginBottom: 20,
    },
    contactOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    contactIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactContent: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        lineHeight: 22,
    },
    contactSubtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        marginTop: 2,
    },
    faqItem: {
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqQuestion: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        lineHeight: 22,
        marginRight: 12,
    },
    faqAnswerContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    faqAnswer: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
    },
});

export default HelpSupportScreen; 