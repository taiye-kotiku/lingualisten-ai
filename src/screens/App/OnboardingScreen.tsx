import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StyledButton from '../../components/common/StyledButton';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

const OnboardingScreen = () => {
    const { completeOnboarding } = useOnboarding();
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    const scrollRef = useRef<ScrollView>(null);

    const handlePress = async () => {
        if (loading) return;
        setLoading(true);
        await completeOnboarding();
    };

    const slides = [
        { icon: 'qr-code-outline', title: 'Title 1', description: 'Description 1' },
        { icon: 'library-outline', title: 'Title 2', description: 'Description 2' },
        { icon: 'cloud-offline-outline', title: 'Title 3', description: 'Description 3' },
        { icon: 'volume-high-outline', title: 'Title 4', description: 'Description 4' },
        { icon: 'happy-outline', title: 'Title 5', description: 'Description 5' },
    ];

    const { width } = Dimensions.get('window');

    const onMomentumEnd = (e: any) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        setCurrentIndex(Math.round(offsetX / width));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                onMomentumScrollEnd={onMomentumEnd}
            >
                {slides.map((slide, i) => (
                    <View key={i} style={[styles.slide, { width }]}>
            <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: theme.COLORS.primary }]}>
                    <Ionicons name="headset" size={40} color="#FFFFFF" />
                </View>
                            <Text style={[styles.title, { color: theme.COLORS.textPrimary }]}>Welcome to LinguaListen</Text>
                            <Text style={[styles.subtitle, { color: theme.COLORS.textSecondary }]}>Your interactive language learning companion</Text>
            </View>

            <View style={styles.features}>
                            <View style={styles.featureItem}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.COLORS.lightGray }]}>
                                    <Ionicons name={slide.icon as any} size={24} color={theme.COLORS.primary} />
                        </View>
                        <View style={styles.featureText}>
                                    <Text style={[styles.featureTitle, { color: theme.COLORS.textPrimary }]}>{slide.title}</Text>
                                    <Text style={[styles.featureDescription, { color: theme.COLORS.textSecondary }]}>{slide.description}</Text>
                                </View>
                            </View>
                        </View>

                        {i === slides.length - 1 && (
                            <View style={styles.footer}>
                                <StyledButton title="Get Started" onPress={handlePress} loading={loading} />
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            {/* Dots */}
            <View style={styles.dotsContainer}>
                {slides.map((_, i) => (
                    <View
                        key={i}
                        style={[styles.dot, {
                            backgroundColor: i === currentIndex ? theme.COLORS.primary : theme.COLORS.border,
                        }]}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 60,
        paddingBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Nunito-Bold',
        lineHeight: 34,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        lineHeight: 22,
        textAlign: 'center',
        opacity: 0.8,
    },
    features: {
        flex: 1,
        paddingHorizontal: 32,
        paddingVertical: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    featureText: {
        flex: 1,
        paddingTop: 2,
    },
    featureTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 22,
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        opacity: 0.8,
    },
    footer: {
        paddingHorizontal: 32,
        paddingBottom: 40,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});

export default OnboardingScreen; 