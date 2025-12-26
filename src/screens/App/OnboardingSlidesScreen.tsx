import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StyledButton from '../../components/common/StyledButton';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

const SLIDES = [
    {
        icon: 'keypad-outline',
        title: 'Enter Flashcard Code',
        description: 'Type the card\'s alphanumeric code on the Home screen to unlock its audio.',
    },
    {
        icon: 'volume-high-outline',
        title: 'Hear Native Audio',
        description:
            'Listen to clear Yoruba and English pronunciations streamed instantly — and cached for offline practice.',
    },
    {
        icon: 'library-outline',
        title: 'Browse Categories',
        description:
            'Explore hundreds of everyday phrases organised by topics like Greetings, Food, Directions and more.',
    },
    {
        icon: 'checkmark-done-outline',
        title: 'Track Your Progress',
        description:
            'Set a daily listening target, mark cards as learned and watch your streak and stats grow.',
    },
    {
        icon: 'cloud-offline-outline',
        title: 'Learn Anywhere',
        description:
            'Cached audio lets you keep practising even when you\'re offline or on the go.',
    },
];

const { width } = Dimensions.get('window');

const OnboardingSlidesScreen = () => {
    const { completeOnboarding } = useOnboarding();
    const [loading, setLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    const handleDone = async () => {
        if (loading) return;
        setLoading(true);
        await completeOnboarding();
    };

    const onMomentumEnd = (e: any) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        setIndex(Math.round(offsetX / width));
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
                {SLIDES.map((s, i) => (
                    <View key={i} style={[styles.slide, { width }]}>
                        <View style={styles.content}>
                            <View style={[styles.iconWrap, { backgroundColor: theme.COLORS.primary }]}>
                                <Ionicons name="headset" size={40} color="#fff" />
                            </View>
                            <View style={styles.featureWrap}>
                                <View style={[styles.featureIcon, { backgroundColor: theme.COLORS.lightGray }]}>
                                    <Ionicons name={s.icon as any} size={24} color={theme.COLORS.primary} />
                                </View>
                                <Text style={[styles.featureTitle, { color: theme.COLORS.textPrimary }]}>{s.title}</Text>
                                <Text style={[styles.featureDesc, { color: theme.COLORS.textSecondary }]}>{s.description}</Text>
                            </View>
                        </View>
                        {i === SLIDES.length - 1 && (
                            <View style={styles.footer}>
                                <StyledButton title="Get Started" onPress={handleDone} loading={loading} />
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
            {/* dot indicator */}
            <View style={styles.dots}>
                {SLIDES.map((_, i) => (
                    <View key={i} style={[styles.dot, { backgroundColor: i === index ? theme.COLORS.primary : theme.COLORS.border }]} />
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    slide: { flex: 1 },
    content: { alignItems: 'center', paddingHorizontal: 32, flex: 1, justifyContent: 'center' },
    iconWrap: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    featureWrap: { alignItems: 'center' },
    featureIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    featureTitle: { fontSize: 20, fontFamily: 'Nunito-SemiBold', marginBottom: 8 },
    featureDesc: { fontSize: 14, fontFamily: 'Inter-Regular', lineHeight: 20, textAlign: 'center' },
    footer: { paddingHorizontal: 32, paddingBottom: 40, width: '100%' },
    dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24, gap: 8 },
    dot: { width: 8, height: 8, borderRadius: 4 },
});

export default OnboardingSlidesScreen;
