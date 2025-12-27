import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Custom storage for Expo
const ExpoSecureStorage = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : ExpoSecureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Type definitions
export interface User {
  id: string;
  email: string;
  username?: string;
  profile_picture_url?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

export interface Phrase {
  id: string;
  code: string;
  phrase: string;
  translation: string;
  pronunciation_guide?: string;
  category: string;
  difficulty: string;
  audio_url?: string;
  tone_marks?: string;
  example_usage?: string;
  cultural_notes?: string;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  phrase_id: string;
  activity_type: 'view' | 'voice_practice' | 'chat' | 'correct';
  is_correct?: boolean;
  accuracy_score?: number;
  attempts: number;
  feedback?: string;
  created_at: string;
}

export interface VoicePractice {
  id: string;
  user_id: string;
  phrase_id: string;
  user_audio_url?: string;
  user_transcription: string;
  is_correct: boolean;
  accuracy_score: number;
  pronunciation_feedback: string;
  tone_feedback?: string;
  grammar_notes?: string;
  ai_response_audio_url?: string;
  created_at: string;
}

// Auth functions
export const authService = {
  async signUp(email: string, password: string, username: string) {
    try {
      // Create auth user
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            username,
            level: 'beginner',
          });

        if (profileError) throw profileError;
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session?.user || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
};

// Phrases functions
export const phrasesService = {
  async getPhrase(code: string): Promise<Phrase | null> {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .eq('code', code)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get phrase error:', error);
      return null;
    }
  },

  async getPhrasesByCategory(category: string): Promise<Phrase[]> {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .eq('category', category)
        .order('code');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get phrases by category error:', error);
      return [];
    }
  },

  async getAllPhrases(): Promise<Phrase[]> {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .order('code');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get all phrases error:', error);
      return [];
    }
  },

  async searchPhrases(query: string): Promise<Phrase[]> {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('*')
        .or(
          `code.ilike.%${query}%,phrase.ilike.%${query}%,translation.ilike.%${query}%`
        );

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Search phrases error:', error);
      return [];
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('phrases')
        .select('category')
        .order('category');

      if (error) throw error;

      // Get unique categories
      const categories = [...new Set(data?.map(p => p.category) || [])] as string[];
      return categories;
    } catch (error) {
      console.error('Get categories error:', error);
      return [];
    }
  },
};

// User activity functions
export const activityService = {
  async logActivity(
    userId: string,
    phraseId: string,
    activityType: string,
    data: Partial<UserActivity> = {}
  ) {
    try {
      const { error } = await supabase.from('user_activity').insert({
        user_id: userId,
        phrase_id: phraseId,
        activity_type: activityType,
        ...data,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Log activity error:', error);
      throw error;
    }
  },

  async getUserActivity(userId: string): Promise<UserActivity[]> {
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

  async getPhrasePracticeCount(userId: string, phraseId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('user_activity')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('phrase_id', phraseId)
        .eq('activity_type', 'voice_practice');

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Get phrase practice count error:', error);
      return 0;
    }
  },
};

// Voice practice functions
export const voiceService = {
  async savePracticeFeedback(practice: Omit<VoicePractice, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('voice_practices')
        .insert(practice)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save voice practice error:', error);
      throw error;
    }
  },

  async getUserVoicePractices(userId: string): Promise<VoicePractice[]> {
    try {
      const { data, error } = await supabase
        .from('voice_practices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user voice practices error:', error);
      return [];
    }
  },

  async getPhrasePracticeHistory(userId: string, phraseId: string): Promise<VoicePractice[]> {
    try {
      const { data, error } = await supabase
        .from('voice_practices')
        .select('*')
        .eq('user_id', userId)
        .eq('phrase_id', phraseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get phrase practice history error:', error);
      return [];
    }
  },
};

// Conversations functions
export const conversationService = {
  async createConversation(userId: string, phraseId?: string) {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          phrase_context: phraseId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create conversation error:', error);
      throw error;
    }
  },

  async addMessage(conversationId: string, sender: 'user' | 'ai', content: string) {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
          sender,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation
      await supabase
        .from('ai_conversations')
        .update({ message_count: supabase.rpc('increment', { x: 1 }) })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      console.error('Add message error:', error);
      throw error;
    }
  },

  async getConversationMessages(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get conversation messages error:', error);
      return [];
    }
  },

  async getUserConversations(userId: string) {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user conversations error:', error);
      return [];
    }
  },
};

// File upload functions
export const storageService = {
  async uploadVoiceRecording(userId: string, file: Buffer, fileName: string) {
    try {
      const path = `voice-recordings/${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('user-uploads')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(path);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Upload voice recording error:', error);
      throw error;
    }
  },

  async uploadProfilePicture(userId: string, file: Buffer, fileName: string) {
    try {
      const path = `profile-pictures/${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('user-uploads')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true, // Replace old picture
        });

      if (error) throw error;

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(path);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Upload profile picture error:', error);
      throw error;
    }
  },
};

export default supabase;