// src/screens/Flashcard/FlashcardScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFlashcardLogic } from '../../hooks/useFlashcardLogic';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

interface FlashcardScreenProps {
  route: any;
  navigation: any;
}

/**
 * Review Screen - Shows session results
 */
const ReviewScreen: React.FC<{
  stats: any;
  navigation: any;
  onRestart: () => void;
  categoryName: string;
}> = ({ stats, navigation, onRestart, categoryName }) => {
  const getMasteryEmoji = (percentage: number) => {
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '⭐';
    if (percentage >= 60) return '📈';
    if (percentage >= 40) return '🌱';
    return '🆕';
  };

  return (
    <SafeAreaView style={styles.reviewContainer}>
      <View style={styles.reviewContent}>
        {/* Header */}
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewEmoji}>
            {getMasteryEmoji(Math.round(stats.accuracy))}
          </Text>
          <Text style={styles.reviewTitle}>Session Complete!</Text>
          <Text style={styles.reviewSubtitle}>{categoryName}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{stats.cardsReviewed}</Text>
            <Text style={styles.statBoxLabel}>Cards Reviewed</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{stats.masteredThisSession}</Text>
            <Text style={styles.statBoxLabel}>Mastered</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>
              {Math.round(stats.accuracy)}%
            </Text>
            <Text style={styles.statBoxLabel}>Accuracy</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>
              {Math.round(stats.timeSpent / 1000 / 60)}m
            </Text>
            <Text style={styles.statBoxLabel}>Time Spent</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cards Marked Easy</Text>
            <View style={[styles.badge, styles.easyBadge]}>
              <Text style={styles.badgeText}>{stats.masteredThisSession}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cards Marked Hard</Text>
            <View style={[styles.badge, styles.hardBadge]}>
              <Text style={styles.badgeText}>{stats.hardCards}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Needs Review</Text>
            <View style={[styles.badge, styles.againBadge]}>
              <Text style={styles.badgeText}>
                {stats.cardsReviewed - stats.masteredThisSession - stats.hardCards}
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.reviewButtonContainer}>
          <TouchableOpacity
            style={[styles.reviewButton, styles.reviewButtonPrimary]}
            onPress={onRestart}
          >
            <Text style={styles.reviewButtonText}>Practice Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reviewButton, styles.reviewButtonSecondary]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.reviewButtonTextSecondary}>
              Back to Categories
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Main Flashcard Screen
 */
export const FlashcardScreen: React.FC<FlashcardScreenProps> = ({
  route,
  navigation,
}) => {
  const { user } = useAuth();
  const categoryName = route.params?.categoryName || 'Greetings';

  const {
    currentCard,
    isLoading,
    error,
    sessionStats,
    isSessionComplete,
    progressPercentage,
    flipCard,
    rateCard,
    skipCard,
    restartSession,
    totalCards,
    cardsReviewed,
  } = useFlashcardLogic(user?.id || '', categoryName);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isRating, setIsRating] = useState(false);

  const handleFlip = useCallback(() => {
    flipCard();
    setIsFlipped(prev => !prev);
  }, [flipCard]);

  const handleRating = useCallback(
    async (rating: 'again' | 'hard' | 'good' | 'easy') => {
      try {
        setIsRating(true);
        await rateCard(rating);
        setIsFlipped(false); // Reset flip for next card
      } catch (err) {
        console.error('Rating error:', err);
      } finally {
        setIsRating(false);
      }
    },
    [rateCard]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading phrases...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isSessionComplete) {
    return (
      <ReviewScreen
        stats={sessionStats}
        navigation={navigation}
        onRestart={restartSession}
        categoryName={categoryName}
      />
    );
  }

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No cards available</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalCards_ = totalCards || 1;
  const progress = ((cardsReviewed + 1) / totalCards_) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.categoryTitle}>{categoryName}</Text>
          <Text style={styles.progressCountText}>
            {cardsReviewed + 1} / {totalCards_}
          </Text>
        </View>
        <View style={styles.accuracyBox}>
          <Text style={styles.accuracyText}>
            {Math.round(sessionStats.accuracy)}%
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Card Container */}
      <View style={styles.cardArea}>
        <TouchableOpacity
          style={[
            styles.card,
            isFlipped && styles.cardFlipped,
          ]}
          onPress={handleFlip}
          activeOpacity={0.9}
          disabled={isRating}
        >
          {!isFlipped ? (
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Yoruba</Text>
              <Text style={styles.cardPhrase}>{currentCard.phrase}</Text>
              <Text style={styles.pronunciation}>
                {currentCard.pronunciation}
              </Text>
              <Text style={styles.tapText}>Tap card to reveal</Text>
            </View>
          ) : (
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>English</Text>
              <Text style={styles.cardTranslation}>
                {currentCard.translation}
              </Text>
              <View style={styles.cardStats}>
                <Text style={styles.statSmall}>
                  Practiced: {currentCard.practiced_count}x
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsSection}>
        {/* Rating Buttons */}
        <View style={styles.ratingButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.ratingButton,
              styles.ratingButtonAgain,
              isRating && styles.buttonDisabled,
            ]}
            onPress={() => handleRating('again')}
            disabled={isRating}
          >
            <Text style={styles.ratingButtonEmoji}>❌</Text>
            <Text style={styles.ratingButtonLabel}>Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ratingButton,
              styles.ratingButtonHard,
              isRating && styles.buttonDisabled,
            ]}
            onPress={() => handleRating('hard')}
            disabled={isRating}
          >
            <Text style={styles.ratingButtonEmoji}>😕</Text>
            <Text style={styles.ratingButtonLabel}>Hard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ratingButton,
              styles.ratingButtonGood,
              isRating && styles.buttonDisabled,
            ]}
            onPress={() => handleRating('good')}
            disabled={isRating}
          >
            <Text style={styles.ratingButtonEmoji}>👍</Text>
            <Text style={styles.ratingButtonLabel}>Good</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ratingButton,
              styles.ratingButtonEasy,
              isRating && styles.buttonDisabled,
            ]}
            onPress={() => handleRating('easy')}
            disabled={isRating}
          >
            <Text style={styles.ratingButtonEmoji}>🎉</Text>
            <Text style={styles.ratingButtonLabel}>Easy</Text>
          </TouchableOpacity>
        </View>

        {/* Skip Button */}
        <TouchableOpacity
          style={[styles.skipButton, isRating && styles.buttonDisabled]}
          onPress={skipCard}
          disabled={isRating}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {isRating && (
        <View style={styles.ratingIndicator}>
          <ActivityIndicator size="small" color="#6366F1" />
          <Text style={styles.ratingIndicatorText}>Saving...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  backButtonContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  backButton: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '700',
  },

  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },

  progressCountText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  accuracyBox: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },

  accuracyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
  },

  // Progress Bar
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
  },

  // Card
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  card: {
    width: CARD_WIDTH,
    height: 280,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  cardFlipped: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },

  cardContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  cardLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },

  cardPhrase: {
    fontSize: 42,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },

  pronunciation: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
  },

  cardTranslation: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6366F1',
    textAlign: 'center',
    marginBottom: 16,
  },

  cardStats: {
    marginTop: 12,
  },

  statSmall: {
    fontSize: 11,
    color: '#6B7280',
  },

  tapText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },

  // Buttons Section
  buttonsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },

  ratingButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  ratingButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingButtonAgain: {
    backgroundColor: '#FEE2E2',
  },

  ratingButtonHard: {
    backgroundColor: '#FEF3C7',
  },

  ratingButtonGood: {
    backgroundColor: '#DBEAFE',
  },

  ratingButtonEasy: {
    backgroundColor: '#D1FAE5',
  },

  ratingButtonEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },

  ratingButtonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },

  skipButton: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },

  skipButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  // Rating Indicator
  ratingIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  ratingIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Review Screen
  reviewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  reviewContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  reviewHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },

  reviewEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },

  reviewTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },

  reviewSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },

  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  statBoxValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6366F1',
    marginBottom: 4,
  },

  statBoxLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },

  detailsBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  easyBadge: {
    backgroundColor: '#D1FAE5',
  },

  hardBadge: {
    backgroundColor: '#FEF3C7',
  },

  againBadge: {
    backgroundColor: '#FEE2E2',
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },

  reviewButtonContainer: {
    gap: 12,
    marginBottom: 24,
  },

  reviewButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  reviewButtonPrimary: {
    backgroundColor: '#6366F1',
  },

  reviewButtonSecondary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },

  reviewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  reviewButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
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

  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FlashcardScreen;