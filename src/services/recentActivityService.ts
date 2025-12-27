import { supabase } from './supabase.service';

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: 'view' | 'practice' | 'learn' | 'review';
  phrase_id?: string;
  timestamp: string;
  details?: any;
}

export const recentActivityService = {
  // Log a new activity
  async logActivity(
    userId: string,
    activityType: 'view' | 'practice' | 'learn' | 'review',
    phraseId?: string,
    details?: any
  ) {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          activity_type: activityType,
          phrase_id: phraseId,
          details: details || {},
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error('Log activity error:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Log activity error:', error);
      return null;
    }
  },

  // Get recent activities for a user
  async getRecentActivities(userId: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get recent activities error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get recent activities error:', error);
      return [];
    }
  },

  // Get activities by type
  async getActivitiesByType(
    userId: string,
    activityType: 'view' | 'practice' | 'learn' | 'review',
    limit: number = 10
  ) {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', activityType)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get activities by type error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get activities by type error:', error);
      return [];
    }
  },

  // Get activities for a specific phrase
  async getActivitiesForPhrase(userId: string, phraseId: string) {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .eq('phrase_id', phraseId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get phrase activities error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get phrase activities error:', error);
      return [];
    }
  },

  // Get activity statistics
  async getActivityStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('activity_type')
        .eq('user_id', userId);

      if (error) {
        console.error('Get activity stats error:', error);
        return {
          total: 0,
          view: 0,
          practice: 0,
          learn: 0,
          review: 0,
        };
      }

      const stats = {
        total: data?.length || 0,
        view: data?.filter((a: any) => a.activity_type === 'view').length || 0,
        practice: data?.filter((a: any) => a.activity_type === 'practice').length || 0,
        learn: data?.filter((a: any) => a.activity_type === 'learn').length || 0,
        review: data?.filter((a: any) => a.activity_type === 'review').length || 0,
      };

      return stats;
    } catch (error) {
      console.error('Get activity stats error:', error);
      return {
        total: 0,
        view: 0,
        practice: 0,
        learn: 0,
        review: 0,
      };
    }
  },

  // Clear old activities (older than days)
  async clearOldActivities(userId: string, daysOld: number = 30) {
    try {
      const date = new Date();
      date.setDate(date.getDate() - daysOld);
      const isoDate = date.toISOString();

      const { error } = await supabase
        .from('user_activity')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', isoDate);

      if (error) {
        console.error('Clear old activities error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Clear old activities error:', error);
      return false;
    }
  },
};

export default recentActivityService;