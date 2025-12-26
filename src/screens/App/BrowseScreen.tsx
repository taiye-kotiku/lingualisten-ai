import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import StyledTextInput from '../../components/common/StyledTextInput';
import EmptyState from '../../components/common/EmptyState';
import { CategorySkeletonList } from '../../components/common/CategorySkeleton';
import { useContent } from '../../services/contentService';
import { Phrase } from '../../types/phrase';
import { CATEGORIES, CategoryId } from '../../constants/categories';
import { Animated } from 'react-native';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useLearnedCards } from '../../services/learnedCardService';

// Utility to pick random element
function randomItem<T>(arr: T[]): T | undefined {
    return arr[Math.floor(Math.random() * arr.length)];
}

const BrowseScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);
    const [searchQuery, setSearchQuery] = useState('');
    // no filter needed in category-only view

    const { phrases: allPhrases, loading, error, refresh } = useContent();
    const { user } = useAuth();
    const { learned, toggleLearned } = useLearnedCards(user?.uid);

    // Compute learned progress per category (after variables declared)
    const progressByCategory = useMemo(() => {
        const map = new Map<CategoryId, { total: number; learned: number }>();
        CATEGORIES.forEach((cat) => map.set(cat.id, { total: 0, learned: 0 }));
        allPhrases?.forEach((p) => {
            const entry = map.get(p.category);
            if (entry) {
                entry.total += 1;
                if (learned?.some((l) => l.id === p.id)) {
                    entry.learned += 1;
                }
            }
        });
        return map;
    }, [allPhrases, learned]);

    const [refreshing, setRefreshing] = useState(false);
    const { showToast } = useToast();

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await refresh();
        } catch (err) {
            showToast('Failed to refresh. Check your connection.', { type: 'error' });
        } finally {
            setRefreshing(false);
        }
    };

    // Category screen no phrase list here

    const handleCategoryPress = (catId: CategoryId) => {
        navigation.navigate('CategoryPhrases', { category: catId });
    };

    const handleShufflePress = () => {
        if (!allPhrases) return;
        const unlearned = allPhrases.filter(p => !learned?.some(l => l.id === p.id));
        const target = randomItem(unlearned.length ? unlearned : allPhrases);
        if (target) {
            navigation.navigate('ContentDisplay', { code: target.code });
        }
    };

    // renderPhraseCard removed


    useEffect(() => {
        if (error) {
            showToast('Network error loading phrases', { type: 'error' });
        }
    }, [error]);

    const dataLoading = loading || learned === null;

    if (dataLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.COLORS.textPrimary }]}>Categories</Text>
                    <TouchableOpacity onPress={handleShufflePress}>
                        <Feather name="refresh-ccw" size={24} color={theme.COLORS.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.categoriesContainer}>
                    <CategorySkeletonList count={6} />
                </View>
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

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.COLORS.textPrimary }]}>Categories</Text>
                    <TouchableOpacity onPress={handleShufflePress}>
                        <Feather name="refresh-ccw" size={24} color={theme.COLORS.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.categoriesContainer}>
                    {CATEGORIES.map((cat) => {
                        const progress = progressByCategory.get(cat.id);
                        const pct = progress && progress.total ? progress.learned / progress.total : 0;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.categoryCard, { borderColor: theme.COLORS.border }]}
                                onPress={() => handleCategoryPress(cat.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.categoryLabel, { color: theme.COLORS.textPrimary }]}>{cat.label}</Text>
                                <View style={[styles.progressBarBg, { backgroundColor: theme.COLORS.border }]}>
                                    <View style={[styles.progressBarFill, { backgroundColor: theme.COLORS.primary, width: `${Math.round(pct * 100)}%` }]} />
                                </View>
                                <Text style={[styles.progressText, { color: theme.COLORS.textSecondary }]}>{Math.round(pct * 100)}% complete</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Nunito-SemiBold',
        lineHeight: 30,
    },
    headerSubtitle: {
        fontSize: 13,
        fontFamily: 'Inter-Regular',
        lineHeight: 18,
        marginTop: 4,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 12,
    },
    categoryCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    categoryLabel: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        marginBottom: 8,
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        marginTop: 4,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterChipText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        lineHeight: 16,
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    resultsCount: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        lineHeight: 16,
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    phraseCard: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    // Removed cardHeader, replaced by playButtonContainer
    playButtonContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    learnedIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    codeText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        lineHeight: 16,
    },
    phraseText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 22,
        marginBottom: 12,
        flex: 1,
        textAlign: 'center',
    },
    // Removed cardFooter and tapToPlayText styles
});

export default BrowseScreen;
