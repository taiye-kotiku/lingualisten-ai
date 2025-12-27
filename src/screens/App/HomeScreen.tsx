import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { recentActivityService } from '../../services/recentActivityService';
import { phrasesService } from '../../services/supabase.service';

interface RecentActivity {
  id: string;
  user_id: string;
  phrase_id?: string;
  activity_type: 'view' | 'practice' | 'learn' | 'review';
  details?: any;
  created_at: string;
}

// Recent Activity Item Component
function RecentActivityItem({ activity }: { activity: RecentActivity }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return '👁️';
      case 'practice':
        return '🎤';
      case 'learn':
        return '📚';
      case 'review':
        return '🔄';
      default:
        return '📝';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'view':
        return 'Viewed';
      case 'practice':
        return 'Practiced';
      case 'learn':
        return 'Learned';
      case 'review':
        return 'Reviewed';
      default:
        return 'Activity';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityIconText}>{getActivityIcon(activity.activity_type)}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityLabel}>
          {getActivityLabel(activity.activity_type)}
        </Text>
        <Text style={styles.activityTime}>{getTimeAgo(activity.created_at)}</Text>
      </View>
      <Text style={styles.activityType}>{activity.activity_type}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [phrases, setPhrases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPhrases: 0,
    learnedToday: 0,
    practiceToday: 0,
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load recent activities
      const activities = await recentActivityService.getRecentActivities(user.id, 5);
      setRecentActivities(activities);

      // Load all phrases
      const allPhrases = await phrasesService.getAllPhrases();
      setPhrases(allPhrases || []);

      // Calculate stats
      const todayActivities = activities.filter((a: any) => {
        const date = new Date(a.created_at);
        const today = new Date();
        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      });

      setStats({
        totalPhrases: allPhrases?.length || 0,
        learnedToday: todayActivities.filter((a: any) => a.activity_type === 'learn')
          .length,
        practiceToday: todayActivities.filter((a: any) => a.activity_type === 'practice')
          .length,
      });
    } catch (error) {
      console.error('Load home data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeNow = () => {
    // Log the activity
    if (user) {
      recentActivityService.logActivity(
        user.id,
        'practice',
        undefined,
        { screen: 'home' }
      );
    }
    navigation.navigate('VoicePractice');
  };

  const handleBrowsePhrases = () => {
    navigation.navigate('Browse');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={styles.loadingText}>Loading your learning data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.subGreeting}>Keep learning Yoruba</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPhrases}</Text>
          <Text style={styles.statLabel}>Total Phrases</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.learnedToday}</Text>
          <Text style={styles.statLabel}>Learned Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.practiceToday}</Text>
          <Text style={styles.statLabel}>Practiced Today</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handlePracticeNow}
        >
          <Text style={styles.buttonText}>🎤 Practice Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleBrowsePhrases}
        >
          <Text style={styles.buttonText}>📖 Browse Phrases</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activities Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={loadData}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {recentActivities.length > 0 ? (
          <FlatList
            data={recentActivities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RecentActivityItem activity={item} />}
            scrollEnabled={false}
            nestedScrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent activities</Text>
            <Text style={styles.emptyStateSubtext}>Start practicing to see your activity here!</Text>
          </View>
        )}
      </View>

      {/* Learning Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Learning Tip</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            Practice pronunciation daily for 10-15 minutes to improve your accent. Consistency is
            key to language learning!
          </Text>
        </View>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#F3E8FF',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#A855F7',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A855F7',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#A855F7',
  },
  secondaryButton: {
    backgroundColor: '#E9D5FF',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshText: {
    color: '#A855F7',
    fontWeight: '600',
    fontSize: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityType: {
    fontSize: 11,
    color: '#A855F7',
    fontWeight: '600',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  tipCard: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#FBBF24',
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  footer: {
    height: 40,
  },
});