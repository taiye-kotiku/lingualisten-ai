import { supabase } from './supabaseClient';

/**
 * Recent Activity Service - Track and fetch user activities
 * Includes proper authentication checks
 */
export const recentActivityService = {
  /**
   * Log a user activity - only if user is authenticated
   */
  async logActivity(
    userId: string | null | undefined,
    activityType: 'view' | 'practice' | 'complete',
    phraseId?: string
  ) {
    try {
      // Check if user is authenticated
      if (!userId) {
        console.warn('Cannot log activity: user not authenticated');
        return false;
      }

      if (!supabase) {
        console.error('Supabase not initialized');
        return false;
      }

      // Only insert required fields, make phrase_id optional
      const insertData: any = {
        user_id: userId,
        activity_type: activityType,
      };

      // Only add phrase_id if provided
      if (phraseId) {
        insertData.phrase_id = phraseId;
      }

      const { error } = await supabase
        .from('user_activity')
        .insert(insertData);

      if (error) {
        console.error('Log activity error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Activity log error:', error);
      return false;
    }
  },

  /**
   * Get recent activities for a user (without joins)
   */
  async getRecentActivities(userId: string | null | undefined, limit: number = 5) {
    try {
      if (!userId) {
        console.warn('Cannot fetch activities: user not authenticated');
        return [];
      }

      if (!supabase) {
        console.error('Supabase not initialized');
        return [];
      }

      // Simple query without joins - no foreign key relationships
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get recent activities error:', error);
      return [];
    }
  },

  /**
   * Get activity statistics for a user
   */
  async getActivityStats(userId: string | null | undefined) {
    try {
      if (!userId) {
        console.warn('Cannot fetch stats: user not authenticated');
        return {
          totalActivities: 0,
          practiceCount: 0,
          viewCount: 0,
          completeCount: 0,
        };
      }

      if (!supabase) {
        console.error('Supabase not initialized');
        return {
          totalActivities: 0,
          practiceCount: 0,
          viewCount: 0,
          completeCount: 0,
        };
      }

      const { data, error } = await supabase
        .from('user_activity')
        .select('activity_type')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching activity stats:', error);
        return {
          totalActivities: 0,
          practiceCount: 0,
          viewCount: 0,
          completeCount: 0,
        };
      }

      const activities = data || [];
      const totalActivities = activities.length;
      const practiceCount = activities.filter(
        (a: any) => a.activity_type === 'practice'
      ).length;
      const viewCount = activities.filter(
        (a: any) => a.activity_type === 'view'
      ).length;
      const completeCount = activities.filter(
        (a: any) => a.activity_type === 'complete'
      ).length;

      return {
        totalActivities,
        practiceCount,
        viewCount,
        completeCount,
      };
    } catch (error) {
      console.error('Activity stats error:', error);
      return {
        totalActivities: 0,
        practiceCount: 0,
        viewCount: 0,
        completeCount: 0,
      };
    }
  },

  /**
   * Clear activities for a user (useful for testing)
   */
  async clearActivities(userId: string | null | undefined) {
    try {
      if (!userId) {
        console.warn('Cannot clear activities: user not authenticated');
        return false;
      }

      if (!supabase) {
        console.error('Supabase not initialized');
        return false;
      }

      const { error } = await supabase
        .from('user_activity')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing activities:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Clear activities error:', error);
      return false;
    }
  },
};

export default recentActivityService;