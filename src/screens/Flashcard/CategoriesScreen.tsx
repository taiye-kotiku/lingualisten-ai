// src/screens/Flashcard/CategoriesScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { phrasesService, learnedPhrasesService } from '../../services/supabase.service';

interface CategoryStats {
  name: string;
  totalPhrases: number;
  practiced: number;
  mastered: number;
  masteryPercentage: number;
}

interface CategoriesScreenProps {
  navigation: any;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Load categories and user progress
   */
  const loadCategories = async () => {
    try {
      setError(null);

      // Get all categories
      const allCategories = await phrasesService.getCategories();

      // Get user stats
      const userStats = await learnedPhrasesService.getUserStats(user?.id || '');

      // Get phrases by category to count total
      const categoryStats: CategoryStats[] = [];

      for (const categoryName of allCategories) {
        const categoryPhrases = await phrasesService.getPhrasesByCategory(categoryName);
        const categoryLearned = await learnedPhrasesService.getUserLearnedPhrases(user?.id || '');

        const totalPhrases = categoryPhrases.length;
        const practiced = categoryLearned.filter(
          (lp: any) =>
            categoryPhrases.find((p: any) => p.id === lp.phrase_id)
        ).length;

        const mastered = categoryLearned.filter(
          (lp: any) =>
            categoryPhrases.find((p: any) => p.id === lp.phrase_id) &&
            lp.is_mastered
        ).length;

        const masteryPercentage = totalPhrases > 0
          ? Math.round((mastered / totalPhrases) * 100)
          : 0;

        categoryStats.push({
          name: categoryName,
          totalPhrases,
          practiced,
          mastered,
          masteryPercentage,
        });
      }

      // Sort by mastery (mastered first, then by practice count)
      categoryStats.sort((a, b) => {
        if (b.mastered !== a.mastered) return b.mastered - a.mastered;
        return b.practiced - a.practiced;
      });

      setCategories(categoryStats);
      setFilteredCategories(categoryStats);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  /**
   * Initial load
   */
  useEffect(() => {
    loadCategories();
  }, [user?.id]);

  /**
   * Handle refresh
   */
  const onRefresh = () => {
    setIsRefreshing(true);
    loadCategories();
  };

  /**
   * Handle search
   */
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCategories(
        categories.filter(cat =>
          cat.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, categories]);

  /**
   * Handle category select
   */
  const handleCategoryPress = (categoryName: string) => {
    navigation.navigate('Practice', {
      categoryName,
    });
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error && categories.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadCategories}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Learn Yoruba</Text>
        <Text style={styles.headerSubtitle}>
          {categories.length} categories available
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <FlatList
          data={filteredCategories}
          keyExtractor={item => item.name}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.gridContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#6366F1']}
            />
          }
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() => handleCategoryPress(item.name)}
            />
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories found</Text>
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearSearchButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

/**
 * Category Card Component
 */
interface CategoryCardProps {
  category: CategoryStats;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const getMasteryColor = (percentage: number) => {
    if (percentage === 100) return '#10B981'; // Green - Complete
    if (percentage >= 75) return '#3B82F6'; // Blue - Advanced
    if (percentage >= 50) return '#F59E0B'; // Amber - Intermediate
    if (percentage >= 25) return '#EF4444'; // Red - Beginner
    return '#9CA3AF'; // Gray - Not started
  };

  const getMasteryEmoji = (percentage: number) => {
    if (percentage === 100) return '🏆';
    if (percentage >= 75) return '⭐';
    if (percentage >= 50) return '📈';
    if (percentage >= 25) return '🌱';
    return '🆕';
  };

  return (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Mastery Badge */}
      <View
        style={[
          styles.masteryBadge,
          { backgroundColor: getMasteryColor(category.masteryPercentage) },
        ]}
      >
        <Text style={styles.masteryEmoji}>
          {getMasteryEmoji(category.masteryPercentage)}
        </Text>
      </View>

      {/* Category Name */}
      <Text style={styles.categoryName}>{category.name}</Text>

      {/* Stats */}
      <View style={styles.categoryStats}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total:</Text>
          <Text style={styles.statValue}>{category.totalPhrases}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Practiced:</Text>
          <Text style={styles.statValue}>{category.practiced}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Mastered:</Text>
          <Text style={styles.statValue}>{category.mastered}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${category.masteryPercentage}%`,
              backgroundColor: getMasteryColor(category.masteryPercentage),
            },
          ]}
        />
      </View>

      {/* Mastery Percentage */}
      <Text style={styles.masteryText}>
        {category.masteryPercentage}% mastered
      </Text>

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>
          {category.masteryPercentage === 100 ? 'Review' : 'Practice'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    padding: 0,
  },

  clearButton: {
    fontSize: 18,
    color: '#9CA3AF',
    marginLeft: 8,
  },

  // Grid
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
    gap: 8,
  },

  gridContainer: {
    paddingHorizontal: 4,
    paddingBottom: 20,
  },

  // Category Card
  categoryCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 240,
  },

  masteryBadge: {
    alignSelf: 'flex-end',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  masteryEmoji: {
    fontSize: 24,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },

  categoryStats: {
    marginBottom: 12,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  statValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },

  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  masteryText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 10,
    fontWeight: '500',
  },

  startButton: {
    paddingVertical: 8,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    alignItems: 'center',
  },

  startButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },

  clearSearchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },

  clearSearchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Loading & Error
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },

  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 24,
  },

  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    marginTop: 20,
  },

  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CategoriesScreen;