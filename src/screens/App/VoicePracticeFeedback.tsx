import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

interface FeedbackData {
  accuracy: number;
  toneScore: number;
  feedback: string;
  suggestions: string[];
}

/**
 * VoicePracticeFeedback - Shows pronunciation feedback and practice results
 * Displays accuracy scores, tone feedback, and improvement suggestions
 */
export default function VoicePracticeFeedback({ route, navigation }: any) {
  const { user } = useAuth();
  const { phraseId, phraseName = 'Practice' } = route?.params || {};

  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Set navigation title
    navigation.setOptions({
      title: 'Practice Results',
    });

    // Simulate loading feedback data
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock feedback data
      const mockFeedback: FeedbackData = {
        accuracy: 85,
        toneScore: 78,
        feedback: 'Good pronunciation! Your accent is clear and easy to understand.',
        suggestions: [
          'Pay attention to the rising tone at the end',
          'Emphasize the vowel sound in the middle',
          'Try slowing down slightly for clarity',
        ],
      };

      setFeedbackData(mockFeedback);

      // Animate score in
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Load feedback error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeAgain = () => {
    // Reset and practice again
    setFeedbackData(null);
    setLoading(true);
    loadFeedback();
  };

  const handleNext = () => {
    navigation.goBack();
  };

  if (loading || !feedbackData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={styles.loadingText}>Analyzing your pronunciation...</Text>
      </View>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return '#10B981';
    if (accuracy >= 70) return '#F59E0B';
    return '#EF4444';
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

      {/* Feedback Content */}
      <View style={styles.content}>
        {/* Phrase Being Practiced */}
        <View style={styles.phraseCard}>
          <Text style={styles.phraseLabel}>Phrase Practiced</Text>
          <Text style={styles.phraseValue}>{phraseName}</Text>
        </View>

        {/* Accuracy Score */}
        <Animated.View
          style={[
            styles.scoreCard,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.scoreCircle}>
            <Text
              style={[
                styles.scoreValue,
                { color: getAccuracyColor(feedbackData.accuracy) },
              ]}
            >
              {feedbackData.accuracy}%
            </Text>
            <Text style={styles.scoreLabel}>Accuracy</Text>
          </View>
          <View style={styles.scoreDetails}>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreRowLabel}>Pronunciation</Text>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      width: `${feedbackData.accuracy}%`,
                      backgroundColor: getAccuracyColor(feedbackData.accuracy),
                    },
                  ]}
                />
              </View>
              <Text style={styles.scoreRowValue}>{feedbackData.accuracy}%</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreRowLabel}>Tone</Text>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      width: `${feedbackData.toneScore}%`,
                      backgroundColor: getAccuracyColor(feedbackData.toneScore),
                    },
                  ]}
                />
              </View>
              <Text style={styles.scoreRowValue}>{feedbackData.toneScore}%</Text>
            </View>
          </View>
        </Animated.View>

        {/* Feedback Message */}
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackLabel}>Feedback</Text>
          <Text style={styles.feedbackText}>{feedbackData.feedback}</Text>
        </View>

        {/* Suggestions */}
        {feedbackData.suggestions.length > 0 && (
          <View style={styles.suggestionsCard}>
            <Text style={styles.suggestionsLabel}>💡 Tips for Improvement</Text>
            {feedbackData.suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Text style={styles.suggestionNumber}>{index + 1}</Text>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.practiceButton}
          onPress={handlePracticeAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.practiceButtonText}>🎤 Practice Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>→ Next Phrase</Text>
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
  phraseCard: {
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 4,
    borderLeftColor: '#A855F7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  phraseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phraseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  scoreCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0F2FE',
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  scoreDetails: {
    width: '100%',
  },
  scoreRow: {
    marginBottom: 16,
  },
  scoreRowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreRowValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  feedbackCard: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  feedbackText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  suggestionsCard: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  suggestionsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  suggestionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
    marginRight: 12,
    minWidth: 24,
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 18,
  },
  practiceButton: {
    backgroundColor: '#A855F7',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
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
  nextButton: {
    backgroundColor: '#E9D5FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D8B4FE',
  },
  nextButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    height: 40,
  },
});