import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { phrasesService } from '../../services/supabase.service';

interface Phrase {
  id: string;
  code: string;
  phrase: string;
  translation: string;
  category: string;
}

/**
 * BrowseScreen - Browse and search through all phrases
 * Displays a list of phrases with search functionality
 */
export default function BrowseScreen({ navigation }: any) {
  const { user } = useAuth();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [filteredPhrases, setFilteredPhrases] = useState<Phrase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadPhrases();
  }, []);

  const loadPhrases = async () => {
    try {
      setLoading(true);
      const allPhrases = await phrasesService.getAllPhrases();
      setPhrases(allPhrases || []);
      setFilteredPhrases(allPhrases || []);
    } catch (error) {
      console.error('Load phrases error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPhrases(query, selectedCategory);
  };

  const filterPhrases = (query: string, category: string | null) => {
    let filtered = phrases;

    if (query.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.phrase.toLowerCase().includes(query.toLowerCase()) ||
          p.translation.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    setFilteredPhrases(filtered);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    filterPhrases(searchQuery, category);
  };

  const handlePhrasePress = (phrase: Phrase) => {
    navigation.navigate('ContentDisplay', {
      phraseId: phrase.id,
      phraseName: phrase.phrase,
    });

    // Log activity
    if (user) {
      // Uncomment when service is available
      // recentActivityService.logActivity(user.id, 'view', phrase.id, { phrase: phrase.phrase });
    }
  };

  const categories = Array.from(new Set(phrases.map((p) => p.category))).filter(
    Boolean
  );

  const renderPhraseItem = ({ item }: { item: Phrase }) => (
    <TouchableOpacity
      style={styles.phraseItem}
      onPress={() => handlePhrasePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.phraseContent}>
        <Text style={styles.phraseText}>{item.phrase}</Text>
        <Text style={styles.translationText}>{item.translation}</Text>
        {item.category && (
          <Text style={styles.categoryBadge}>{item.category}</Text>
        )}
      </View>
      <Text style={styles.arrowIcon}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={styles.loadingText}>Loading phrases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Phrases</Text>
        <Text style={styles.headerSubtitle}>
          {filteredPhrases.length} phrases
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search phrases..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      {categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === null && styles.categoryButtonActive,
            ]}
            onPress={() => handleCategoryFilter(null)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === null && styles.categoryButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => handleCategoryFilter(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Phrases List */}
      {filteredPhrases.length > 0 ? (
        <FlatList
          data={filteredPhrases}
          renderItem={renderPhraseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateTitle}>No phrases found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try adjusting your search or filter
          </Text>
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => handleSearch('')}
            >
              <Text style={styles.resetButtonText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F3E8FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9D5FF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    marginLeft: 8,
    fontSize: 18,
    color: '#9CA3AF',
    padding: 8,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#A855F7',
    borderColor: '#A855F7',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#A855F7',
  },
  phraseContent: {
    flex: 1,
  },
  phraseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '500',
    color: '#A855F7',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  arrowIcon: {
    fontSize: 24,
    color: '#D1D5DB',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#A855F7',
    borderRadius: 6,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});