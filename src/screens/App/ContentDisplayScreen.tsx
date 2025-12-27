import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

/**
 * ContentDisplayScreen - Shows detailed information about a phrase
 * Used to display phrase details, translation, pronunciation guide, etc.
 */
export default function ContentDisplayScreen({ route, navigation }: any) {
  const { phraseId, phraseName = 'Phrase Details' } = route?.params || {};

  React.useEffect(() => {
    // Set navigation title
    navigation.setOptions({
      title: phraseName,
    });
  }, [phraseName, navigation]);

  const handlePractice = () => {
    if (phraseId) {
      navigation.navigate('VoicePractice', { phraseId, phraseName });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{phraseName}</Text>
        <View style={styles.spacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Phrase Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Phrase</Text>
          <Text style={styles.cardValue}>{phraseName || 'Loading...'}</Text>
        </View>

        {/* Translation Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Translation</Text>
          <Text style={styles.cardValue}>English translation here</Text>
        </View>

        {/* Category Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Category</Text>
          <Text style={styles.cardValue}>Greetings</Text>
        </View>

        {/* Pronunciation Guide Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pronunciation Guide</Text>
          <Text style={styles.cardDescription}>
            Listen to the audio above to hear the correct pronunciation.
          </Text>
        </View>

        {/* Usage Tips Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Usage Tips</Text>
          <Text style={styles.cardDescription}>
            This phrase is commonly used in everyday conversations. Pay
            attention to the tone marks, which are important in Yoruba.
          </Text>
        </View>

        {/* Practice Button */}
        <TouchableOpacity
          style={styles.practiceButton}
          onPress={handlePractice}
          activeOpacity={0.8}
        >
          <Text style={styles.practiceButtonText}>🎤 Practice Pronunciation</Text>
        </TouchableOpacity>

        {/* Learn More Button */}
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
          <Text style={styles.secondaryButtonText}>📚 Learn More</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Padding */}
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3E8FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9D5FF',
  },
  backButton: {
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#A855F7',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  spacer: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 4,
    borderLeftColor: '#A855F7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  practiceButton: {
    backgroundColor: '#A855F7',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: '#E9D5FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D8B4FE',
  },
  secondaryButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    height: 40,
  },
});