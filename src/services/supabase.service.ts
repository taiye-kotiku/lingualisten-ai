import { supabase } from './supabaseClient';

/**
 * Phrases Service - Handle all phrase-related operations
 */
export const phrasesService = {
  /**
   * Get all phrases from Supabase
   */
  async getAllPhrases() {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching phrases:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Phrases service error:', error);
      return [];
    }
  },

  /**
   * Get phrase by ID
   */
  async getPhraseById(phraseId: string) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return null;
      }

      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .eq('id', phraseId)
        .single();

      if (error) {
        console.error('Error fetching phrase:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Phrase fetch error:', error);
      return null;
    }
  },

  /**
   * Search phrases by text
   */
  async searchPhrases(query: string) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .or(
          `phrase.ilike.%${query}%,translation.ilike.%${query}%`
        )
        .order('category', { ascending: true });

      if (error) {
        console.error('Error searching phrases:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },

  /**
   * Get phrases by category
   */
  async getPhrasesByCategory(category: string) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .eq('category', category)
        .order('phrase');

      if (error) {
        console.error('Error fetching phrases by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Category fetch error:', error);
      return [];
    }
  },

  /**
   * Get all unique categories
   */
  async getCategories() {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      // Get all phrases and extract unique categories
      const { data, error } = await supabase
        .from('phrases')
        .select('category');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      // Extract unique categories and sort
      const uniqueCategories = Array.from(new Set(
        data?.map((item: any) => item.category).filter(Boolean) || []
      )).sort();

      return uniqueCategories;
    } catch (error) {
      console.error('Categories fetch error:', error);
      return [];
    }
  },

  /**
   * Get random phrases (for home screen featured section)
   */
  async getRandomPhrases(limit = 5) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error fetching random phrases:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Random phrases error:', error);
      return [];
    }
  },
};

/**
 * Learned Phrases Service - Handle user progress tracking
 */
export const learnedPhrasesService = {
  /**
   * Mark a phrase as practiced/learned by user
   * Creates new record or updates existing one
   */
  async markPhrasePracticed(
    userId: string,
    phraseId: string,
    accuracyScore: number = 0
  ) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return null;
      }

      // First, try to fetch existing record
      const { data: existing, error: fetchError } = await supabase
        .from('learned_phrases')
        .select('*')
        .eq('user_id', userId)
        .eq('phrase_id', phraseId)
        .single();

      if (existing) {
        // Update existing record
        const newAccuracy =
          (existing.accuracy_score + accuracyScore) / 2;

        const { data, error } = await supabase
          .from('learned_phrases')
          .update({
            practice_count: existing.practice_count + 1,
            accuracy_score: newAccuracy,
            last_practiced: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .eq('phrase_id', phraseId)
          .select()
          .single();

        if (error) {
          console.error('Error updating learned phrase:', error);
          return null;
        }
        return data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('learned_phrases')
          .insert({
            user_id: userId,
            phrase_id: phraseId,
            practice_count: 1,
            accuracy_score: accuracyScore,
            last_practiced: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating learned phrase:', error);
          return null;
        }
        return data;
      }
    } catch (error) {
      console.error('Mark practice error:', error);
      return null;
    }
  },

  /**
   * Get all learned phrases for a user (with phrase details)
   */
  async getUserLearnedPhrases(userId: string) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      const { data, error } = await supabase
        .from('learned_phrases')
        .select('*, phrases(*)')
        .eq('user_id', userId)
        .order('last_practiced', { ascending: false });

      if (error) {
        console.error('Error fetching learned phrases:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Learned phrases error:', error);
      return [];
    }
  },

  /**
   * Get mastered phrases for a user
   */
  async getUserMasteredPhrases(userId: string) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      const { data, error } = await supabase
        .from('learned_phrases')
        .select('*, phrases(*)')
        .eq('user_id', userId)
        .eq('is_mastered', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching mastered phrases:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Mastered phrases error:', error);
      return [];
    }
  },

  /**
   * Mark a phrase as mastered
   */
  async markPhraseMastered(userId: string, phraseId: string) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return null;
      }

      const { data, error } = await supabase
        .from('learned_phrases')
        .update({
          is_mastered: true,
        })
        .eq('user_id', userId)
        .eq('phrase_id', phraseId)
        .select()
        .single();

      if (error) {
        console.error('Error marking mastered:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Mark mastered error:', error);
      return null;
    }
  },

  /**
   * Get comprehensive user statistics
   */
  async getUserStats(userId: string) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return {
          totalPhrasesPracticed: 0,
          masteredPhrases: 0,
          averageAccuracy: 0,
          totalPracticeAttempts: 0,
        };
      }

      const { data, error } = await supabase
        .from('learned_phrases')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching stats:', error);
        return {
          totalPhrasesPracticed: 0,
          masteredPhrases: 0,
          averageAccuracy: 0,
          totalPracticeAttempts: 0,
        };
      }

      const phrases = data || [];
      const totalPhrasesPracticed = phrases.length;
      const masteredPhrases = phrases.filter((p: any) => p.is_mastered).length;
      const totalPracticeAttempts = phrases.reduce(
        (sum: number, p: any) => sum + (p.practice_count || 0),
        0
      );
      const averageAccuracy =
        phrases.length > 0
          ? Math.round(
              phrases.reduce((sum: number, p: any) => sum + (p.accuracy_score || 0), 0) /
                phrases.length
            )
          : 0;

      return {
        totalPhrasesPracticed,
        masteredPhrases,
        averageAccuracy,
        totalPracticeAttempts,
      };
    } catch (error) {
      console.error('Stats error:', error);
      return {
        totalPhrasesPracticed: 0,
        masteredPhrases: 0,
        averageAccuracy: 0,
        totalPracticeAttempts: 0,
      };
    }
  },

  /**
   * Get recently practiced phrases for a user
   */
  async getRecentlyPracticed(userId: string, limit: number = 10) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      const { data, error } = await supabase
        .from('learned_phrases')
        .select('*, phrases(*)')
        .eq('user_id', userId)
        .order('last_practiced', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recently practiced:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Recently practiced error:', error);
      return [];
    }
  },
};

/**
 * Activity Service - Track user interactions
 */
export const activityService = {
  /**
   * Log user activity
   */
  async logActivity(
    userId: string,
    activityType: 'view' | 'practice' | 'complete',
    phraseId?: string
  ) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return false;
      }

      const { error } = await supabase
        .from('recent_activity')
        .insert({
          user_id: userId,
          activity_type: activityType,
          phrase_id: phraseId || null,
        });

      if (error) {
        console.error('Error logging activity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Activity log error:', error);
      return false;
    }
  },

  /**
   * Get recent activity for user
   */
  async getRecentActivity(userId: string, limit: number = 20) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      const { data, error } = await supabase
        .from('recent_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activity:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Recent activity error:', error);
      return [];
    }
  },
};

// EXPORT THE SUPABASE CLIENT SO IT CAN BE IMPORTED BY AuthContext
export { supabase };