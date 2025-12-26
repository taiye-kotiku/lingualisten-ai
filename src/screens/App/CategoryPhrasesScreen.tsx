import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import { useContent } from '../../services/contentService';
import { Phrase } from '../../types/phrase';
import StyledTextInput from '../../components/common/StyledTextInput';
import { Feather } from '@expo/vector-icons';
import { PhraseCardSkeletonList } from '../../components/common/PhraseCardSkeleton';
import { useAuth } from '../../context/AuthContext';
import { useLearnedCards } from '../../services/learnedCardService';
import EmptyState from '../../components/common/EmptyState';
import { CATEGORY_MAP } from '../../constants/categories';

const CategoryPhrasesScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'CategoryPhrases'>>();
    const { category } = route.params;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    const { phrases: allPhrases, loading, error } = useContent();
    const { user } = useAuth();
    const { learned, toggleLearned } = useLearnedCards(user?.uid);

    const [searchQuery, setSearchQuery] = useState('');
    const [isShuffled, setIsShuffled] = useState(false);

    const phrases = useMemo(() => {
        if (!allPhrases) return [];
        let list = allPhrases.filter(p => p.category === category);
        if (isShuffled) {
            list = [...list].sort(() => Math.random() - 0.5);
        }
        if (searchQuery.trim()) {
            list = list.filter(p =>
                p.yoruba.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return list;
    }, [allPhrases, category, searchQuery, isShuffled]);

    const dataLoading = loading || learned === null;
    if (dataLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color={theme.COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.COLORS.textPrimary }]}>{CATEGORY_MAP[category].label}</Text>
                    <TouchableOpacity onPress={() => setIsShuffled(!isShuffled)}>
                        <Feather name="shuffle" size={24} color={isShuffled ? theme.COLORS.primary : theme.COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchContainer}>
                    <StyledTextInput placeholder="Search phrases..." value={searchQuery} onChangeText={setSearchQuery} leftIcon="search" />
                </View>
                <PhraseCardSkeletonList count={6} />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background, justifyContent: 'center', alignItems: 'center' }]}>
                <EmptyState icon="alert-circle" message={error.message} />
            </SafeAreaView>
        );
    }

    const renderCard = ({ item }: { item: Phrase }) => {
        const isLearned = learned?.some(l => l.id === item.id);
        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ContentDisplay', { code: item.code })}
            >
                <Feather name="play-circle" size={36} color={theme.COLORS.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
                <Text style={[styles.phraseText, { color: theme.COLORS.textPrimary }]} numberOfLines={3}>{item.english}</Text>
                <TouchableOpacity style={styles.learnedIcon} onPress={() => toggleLearned(item)}>
                    <Feather name={isLearned ? 'check-circle' : 'circle'} size={20} color={isLearned ? theme.COLORS.success : theme.COLORS.textSecondary} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={theme.COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.COLORS.textPrimary }]}>{CATEGORY_MAP[category].label}</Text>
                <TouchableOpacity onPress={() => setIsShuffled(!isShuffled)}>
                    <Feather name="shuffle" size={24} color={isShuffled ? theme.COLORS.primary : theme.COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <StyledTextInput
                    placeholder="Search phrases..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    leftIcon="search"
                />
            </View>

            {phrases.length ? (
                <FlatList
                    data={phrases}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.code}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <EmptyState icon="search" message="No phrases found in this category." />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    phraseText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 22,
        textAlign: 'center',
    },
    learnedIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});

export default CategoryPhrasesScreen; 