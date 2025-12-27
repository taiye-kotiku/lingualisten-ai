import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import { phrasesService } from '../../services/supabase.service';

export const BrowseScreen = ({ navigation }: any) => {
  const [phrases, setPhrases] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allPhrases, allCategories] = await Promise.all([
        phrasesService.getAllPhrases(),
        phrasesService.getCategories(),
      ]);

      setPhrases(allPhrases);
      setCategories(['All', ...allCategories]);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query) {
      const results = await phrasesService.searchPhrases(query);
      setPhrases(results);
    } else {
      const all = await phrasesService.getAllPhrases();
      setPhrases(all);
    }
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      const all = await phrasesService.getAllPhrases();
      setPhrases(all);
    } else {
      const byCategory = await phrasesService.getPhrasesByCategory(category);
      setPhrases(byCategory);
    }
  };

  const filteredPhrases = selectedCategory === 'All'
    ? phrases
    : phrases.filter(p => p.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search phrases..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => handleCategorySelect(cat)}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Phrases List */}
      <FlatList
        data={filteredPhrases}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Phrase', { phrase: item })}
            style={styles.phraseCard}
          >
            <Text style={styles.phraseCode}>{item.code}</Text>
            <Text style={styles.phraseText}>{item.phrase}</Text>
            <Text style={styles.translationText}>{item.translation}</Text>
            <Text style={styles.categoryBadge}>{item.category}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Loading...' : 'No phrases found'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 14,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#78B242',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#78B242',
  },
  categoryText: {
    color: '#78B242',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  phraseCard: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#78B242',
  },
  phraseCode: {
    fontSize: 12,
    color: '#78B242',
    fontWeight: '600',
    marginBottom: 4,
  },
  phraseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  translationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryBadge: {
    fontSize: 11,
    color: '#78B242',
    marginTop: 8,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});