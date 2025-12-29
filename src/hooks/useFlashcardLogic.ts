// src/hooks/useFlashcardLogic.ts

import { useState, useCallback, useEffect } from 'react';
import { learnedPhrasesService, activityService } from '../services/supabase.service';

export interface FlashcardState {
  id: string;
  phrase: string;
  translation: string;
  pronunciation: string;
  category: string;
  isFlipped: boolean;
  practiced_count: number;
  accuracy_score: number;
  last_practiced: string | null;
}

export interface RepetitionSchedule {
  interval: number; // days until next review
  easeFactor: number; // difficulty multiplier (1.3 - 2.5)
}

export type UserRating = 'again' | 'hard' | 'good' | 'easy';

interface SessionStats {
  totalCards: number;
  cardsReviewed: number;
  masteredThisSession: number;
  hardCards: number;
  accuracy: number;
  timeSpent: number; // milliseconds
}

/**
 * SM-2 Spaced Repetition Algorithm
 * Implements the SuperMemo 2 algorithm for optimal review scheduling
 */
function calculateNextReview(
  userRating: UserRating,
  previousInterval: number = 1,
  previousEase: number = 2.5
): RepetitionSchedule {
  let newEase = previousEase;
  let newInterval: number;

  // Quality: 0 (again) to 5 (easy)
  const qualityMap = {
    again: 0,
    hard: 2,
    good: 4,
    easy: 5,
  };

  const quality = qualityMap[userRating];

  // SM-2 formula
  newEase = Math.max(
    1.3,
    previousEase + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  if (quality < 3) {
    // Again or Hard - reset interval
    newInterval = 1;
  } else {
    // Good or Easy - increase interval
    newInterval = Math.ceil(
      previousInterval * newEase * (userRating === 'easy' ? 1.3 : 1.0)
    );
  }

  return {
    interval: Math.max(1, newInterval), // Minimum 1 day
    easeFactor: newEase,
  };
}

/**
 * Determine if a card is due for review
 */
function isCardDue(card: FlashcardState): boolean {
  // First time? Always due
  if (!card.last_practiced) return true;

  const lastPracticed = new Date(card.last_practiced).getTime();
  const now = new Date().getTime();
  const daysSince = (now - lastPracticed) / (1000 * 60 * 60 * 24);

  // Simplified - in real app, would use stored interval
  // For now, all cards due if not practiced today
  return daysSince >= 0.5;
}

/**
 * Filter cards for study session
 */
function filterStudyCards(cards: FlashcardState[]): FlashcardState[] {
  // Due cards first, then new cards
  const due = cards.filter(isCardDue);
  const newCards = cards.filter(c => !c.last_practiced);

  // Prioritize: due > new
  const allCards = [
    ...due.filter(c => c.last_practiced),
    ...newCards.filter(c => !c.last_practiced),
  ];

  // Limit to 20 cards per session (optional)
  return allCards.slice(0, 20);
}

/**
 * Main flashcard logic hook
 */
export function useFlashcardLogic(userId: string, categoryName: string) {
  const [cards, setCards] = useState<FlashcardState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalCards: 0,
    cardsReviewed: 0,
    masteredThisSession: 0,
    hardCards: 0,
    accuracy: 0,
    timeSpent: 0,
  });

  const [sessionStartTime] = useState(Date.now());
  const [sessionCardRatings, setSessionCardRatings] = useState<{
    [cardId: string]: UserRating;
  }>({});

  /**
   * Load cards for the category
   */
  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get all phrases in category
        const { phrasesService } = await import('../services/supabase.service');
        const categoryPhrases = await phrasesService.getPhrasesByCategory(
          categoryName
        );

        // Get user's learning progress
        const learnedData = await learnedPhrasesService.getUserLearnedPhrases(
          userId
        );

        // Combine data
        const enrichedCards: FlashcardState[] = categoryPhrases.map(
          (phrase: any) => {
            const learned = learnedData.find(l => l.phrase_id === phrase.id);

            return {
              id: phrase.id,
              phrase: phrase.phrase,
              translation: phrase.translation,
              pronunciation: phrase.pronunciation || '',
              category: phrase.category,
              isFlipped: false,
              practiced_count: learned?.practice_count || 0,
              accuracy_score: learned?.accuracy_score || 0,
              last_practiced: learned?.last_practiced || null,
            };
          }
        );

        // Filter for study session
        const studyCards = filterStudyCards(enrichedCards);

        setCards(studyCards);
        setSessionStats(prev => ({
          ...prev,
          totalCards: studyCards.length,
        }));
      } catch (err) {
        console.error('Error loading cards:', err);
        setError('Failed to load phrases. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, [categoryName, userId]);

  /**
   * Get current card
   */
  const currentCard = cards[currentIndex] || null;

  /**
   * Flip current card
   */
  const flipCard = useCallback(() => {
    if (!currentCard) return;

    setCards(prev => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        isFlipped: !updated[currentIndex].isFlipped,
      };
      return updated;
    });
  }, [currentIndex, currentCard]);

  /**
   * Rate the current card and move to next
   */
  const rateCard = useCallback(
    async (rating: UserRating) => {
      if (!currentCard) return;

      try {
        // Store rating for session
        setSessionCardRatings(prev => ({
          ...prev,
          [currentCard.id]: rating,
        }));

        // Calculate new interval
        const schedule = calculateNextReview(
          rating,
          currentCard.practiced_count,
          currentCard.accuracy_score || 2.5
        );

        // Calculate accuracy (simplified)
        const newAccuracy =
          rating === 'easy' ? 100 : rating === 'good' ? 80 : rating === 'hard' ? 50 : 0;

        // Update in database
        await learnedPhrasesService.markPhrasePracticed(
          userId,
          currentCard.id,
          newAccuracy
        );

        // Log activity
        await activityService.logActivity(userId, 'practice', currentCard.id);

        // Update stats
        setSessionStats(prev => {
          const isMastered =
            (prev.masteredThisSession || 0) +
            (rating === 'easy' ? 1 : 0);
          const isHard =
            (prev.hardCards || 0) + (rating === 'hard' ? 1 : 0);

          return {
            ...prev,
            cardsReviewed: prev.cardsReviewed + 1,
            masteredThisSession: isMastered,
            hardCards: isHard,
            accuracy:
              ((newAccuracy + (prev.accuracy * prev.cardsReviewed)) /
                (prev.cardsReviewed + 1)) || 0,
            timeSpent: Date.now() - sessionStartTime,
          };
        });

        // Move to next card
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          // Session complete
          return { sessionComplete: true, stats: sessionStats };
        }
      } catch (err) {
        console.error('Error rating card:', err);
        setError('Failed to save progress. Please try again.');
      }
    },
    [currentCard, currentIndex, cards.length, userId, sessionStartTime, sessionStats]
  );

  /**
   * Skip card (don't rate)
   */
  const skipCard = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, cards.length]);

  /**
   * Restart session
   */
  const restartSession = useCallback(() => {
    setCurrentIndex(0);
    setSessionCardRatings({});
    setSessionStats({
      totalCards: cards.length,
      cardsReviewed: 0,
      masteredThisSession: 0,
      hardCards: 0,
      accuracy: 0,
      timeSpent: 0,
    });

    // Unflip all cards
    setCards(prev =>
      prev.map(card => ({
        ...card,
        isFlipped: false,
      }))
    );
  }, [cards.length]);

  /**
   * Check if session is complete
   */
  const isSessionComplete = currentIndex >= cards.length;

  /**
   * Get progress percentage
   */
  const progressPercentage =
    cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  return {
    // State
    cards,
    currentCard,
    currentIndex,
    isLoading,
    error,
    sessionStats,
    isSessionComplete,
    progressPercentage,

    // Actions
    flipCard,
    rateCard,
    skipCard,
    restartSession,

    // Info
    totalCards: cards.length,
    cardsReviewed: sessionStats.cardsReviewed,
  };
}

export default useFlashcardLogic;