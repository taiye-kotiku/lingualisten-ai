import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ============================================================================
// AUTH SERVICE
// ============================================================================

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, username: string) {
    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: authError?.message || 'Sign up failed',
        };
      }

      // 2. Create user profile in users table
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        username,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue even if profile creation fails
      }

      return {
        success: true,
        user: authData.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return {
          success: false,
          error: error?.message || 'Sign in failed',
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign out failed',
      };
    }
  },

  // Password reset
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'lingualisten://reset-password',
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
      };
    }
  },
};

// ============================================================================
// PHRASES SERVICE
// ============================================================================

export const phrasesService = {
  // Get a single phrase by ID
  async getPhrase(id: string) {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get phrase error:', error);
      return null;
    }
  },

  // Get all phrases
  async getAllPhrases() {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all phrases error:', error);
      return [];
    }
  },

  // Get phrases by category
  async getPhrasesByCategory(category: string) {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .eq('category', category)
        .order('code', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get phrases by category error:', error);
      return [];
    }
  },

  // Search phrases
  async searchPhrases(query: string) {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .or(`phrase.ilike.%${query}%,translation.ilike.%${query}%`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Search phrases error:', error);
      return [];
    }
  },
};

// ============================================================================
// USER ACTIVITY SERVICE
// ============================================================================

export const userActivityService = {
  // Log user activity
  async logActivity(userId: string, phraseId: string, activityData: any) {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          phrase_id: phraseId,
          ...activityData,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Log activity error:', error);
      return null;
    }
  },

  // Get user activity
  async getUserActivity(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user activity error:', error);
      return [];
    }
  },
};

// ============================================================================
// VOICE PRACTICE SERVICE
// ============================================================================

export const voicePracticeService = {
  // Save voice practice
  async savePractice(userId: string, phraseId: string, practiceData: any) {
    try {
      const { data, error } = await supabase
        .from('voice_practices')
        .insert({
          user_id: userId,
          phrase_id: phraseId,
          ...practiceData,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Save voice practice error:', error);
      return null;
    }
  },

  // Get user voice practices
  async getUserPractices(userId: string) {
    try {
      const { data, error } = await supabase
        .from('voice_practices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user practices error:', error);
      return [];
    }
  },
};

// ============================================================================
// AI CONVERSATION SERVICE
// ============================================================================

export const aiConversationService = {
  // Create a new conversation
  async createConversation(userId: string, phraseId: string) {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          phrase_id: phraseId,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Create conversation error:', error);
      return null;
    }
  },

  // Add message to conversation
  async addMessage(
    conversationId: string,
    sender: 'user' | 'ai',
    content: string
  ) {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
          sender,
          content,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Add message error:', error);
      return null;
    }
  },

  // Get conversation messages
  async getMessages(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get messages error:', error);
      return [];
    }
  },
};

export default supabase;