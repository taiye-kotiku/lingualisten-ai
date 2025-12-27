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

interface SearchResult {
  id: string;
  phrase: string;
  translation: string;
  category: string;
}

/**
 * SearchScreen - Search for phrases by text
 * Displays search results with filters
 */
export default function SearchScreen({ navigation }: any) {
  const { user } = useAuth();
  const [allPhrases, setAllPhrases] = useState<SearchResult[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadAllPhrases();
  }, []);

  const loadAllPhrases = async () => {
    try {
      setLoading(true);
      const phrases = await phrasesService.getAllPhrases();
      setAllPhrases(phrases || []);
    } catch (error) {
      console.error('Load phrases error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const results = allPhrases.filter(
      (phrase) =>
        phrase.phrase.toLowerCase().includes(query.toLowerCase()) ||
        phrase.translation.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setSearching(false);
  };

  const handleResultPress = (result: SearchResult) => {
    navigation.navigate('ContentDisplay', {
      phraseId: result.id,
      phraseName: result.phrase,
    });
  };

  const renderResultItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultPhrase}>{item.phrase}</Text>
        <Text style={styles.resultTranslation}>{item.translation}</Text>
        {item.category && (
          <Text style={styles.resultCategory}>{item.category}</Text>
        )}
      </View>
      <Text style={styles.resultArrow}>›</Text>
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
        <Text style={styles.headerTitle}>Search Phrases</Text>
        <Text style={styles.headerSubtitle}>Find phrases instantly</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by phrase or translation..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="always"
        />
      </View>

      {/* Search Results */}
      {searchQuery.length > 0 ? (
        <>
          {searching ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#A855F7" />
            </View>
          ) : searchResults.length > 0 ? (
            <>
              <Text style={styles.resultsCount}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </Text>
              <FlatList
                data={searchResults}
                renderItem={renderResultItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.resultsList}
                scrollEnabled={true}
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateTitle}>No phrases found</Text>
              <Text style={styles.emptyStateSubtitle}>
                Try a different search term
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>💡</Text>
          <Text style={styles.emptyStateTitle}>Start searching</Text>
          <Text style={styles.emptyStateSubtitle}>
            Type a phrase or translation to get started
          </Text>
          <View style={styles.suggestedPhrases}>
            <Text style={styles.suggestedTitle}>Popular searches:</Text>
            <TouchableOpacity
              style={styles.suggestedChip}
              onPress={() => handleSearch('hello')}
            >
              <Text style={styles.suggestedChipText}>Hello</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.suggestedChip}
              onPress={() => handleSearch('thank')}
            >
              <Text style={styles.suggestedChipText}>Thank you</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.suggestedChip}
              onPress={() => handleSearch('good morning')}
            >
              <Text style={styles.suggestedChipText}>Good morning</Text>
            </TouchableOpacity>
          </View>
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
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 8,
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultItem: {
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
  resultContent: {
    flex: 1,
  },
  resultPhrase: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resultTranslation: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 11,
    fontWeight: '500',
    color: '#A855F7',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  resultArrow: {
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
  suggestedPhrases: {
    alignItems: 'center',
  },
  suggestedTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestedChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  suggestedChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A855F7',
  },
});