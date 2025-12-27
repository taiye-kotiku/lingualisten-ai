import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { learnedPhrasesService } from '../../services/supabase.service';

interface UserStats {
  totalPhrasesPracticed: number;
  masteredPhrases: number;
  averageAccuracy: number;
  totalPracticeAttempts: number;
}

/**
 * ProfileScreen - Display user profile and learning statistics
 */
export default function ProfileScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalPhrasesPracticed: 0,
    masteredPhrases: 0,
    averageAccuracy: 0,
    totalPracticeAttempts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userStats = await learnedPhrasesService.getUserStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    // Note: Check your AuthContext for the correct logout/signOut method
    // If your context exports logout(), use that instead
    try {
      console.log('Sign out requested');
      // Example: if your context has it: await logout();
      // For now, this is a placeholder
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.noUserText}>Please log in to see your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user.user_metadata?.full_name || user.email || 'Yoruba Learner'}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#A855F7" />
          ) : (
            <>
              {/* Stats Cards Grid */}
              <View style={styles.statsGrid}>
                {/* Card 1: Total Practiced */}
                <View style={[styles.statCard, styles.statCard1]}>
                  <Text style={styles.statIcon}>📚</Text>
                  <Text style={styles.statValue}>{stats.totalPhrasesPracticed}</Text>
                  <Text style={styles.statLabel}>Phrases Practiced</Text>
                </View>

                {/* Card 2: Mastered */}
                <View style={[styles.statCard, styles.statCard2]}>
                  <Text style={styles.statIcon}>⭐</Text>
                  <Text style={styles.statValue}>{stats.masteredPhrases}</Text>
                  <Text style={styles.statLabel}>Mastered</Text>
                </View>

                {/* Card 3: Average Accuracy */}
                <View style={[styles.statCard, styles.statCard3]}>
                  <Text style={styles.statIcon}>🎯</Text>
                  <Text style={styles.statValue}>{stats.averageAccuracy}%</Text>
                  <Text style={styles.statLabel}>Avg. Accuracy</Text>
                </View>

                {/* Card 4: Total Attempts */}
                <View style={[styles.statCard, styles.statCard4]}>
                  <Text style={styles.statIcon}>🔄</Text>
                  <Text style={styles.statValue}>{stats.totalPracticeAttempts}</Text>
                  <Text style={styles.statLabel}>Total Attempts</Text>
                </View>
              </View>

              {/* Achievement Section */}
              <View style={styles.achievementSection}>
                <Text style={styles.achievementTitle}>Achievements</Text>

                {stats.totalPhrasesPracticed >= 5 && (
                  <View style={styles.achievementItem}>
                    <Text style={styles.achievementEmoji}>🌟</Text>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementName}>Getting Started</Text>
                      <Text style={styles.achievementDesc}>
                        Practiced 5 phrases
                      </Text>
                    </View>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}

                {stats.totalPhrasesPracticed >= 10 && (
                  <View style={styles.achievementItem}>
                    <Text style={styles.achievementEmoji}>🔥</Text>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementName}>On Fire</Text>
                      <Text style={styles.achievementDesc}>
                        Practiced 10 phrases
                      </Text>
                    </View>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}

                {stats.masteredPhrases >= 5 && (
                  <View style={styles.achievementItem}>
                    <Text style={styles.achievementEmoji}>👑</Text>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementName}>Master</Text>
                      <Text style={styles.achievementDesc}>
                        Mastered 5 phrases
                      </Text>
                    </View>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}

                {stats.averageAccuracy >= 80 && (
                  <View style={styles.achievementItem}>
                    <Text style={styles.achievementEmoji}>🎤</Text>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementName}>Great Speaker</Text>
                      <Text style={styles.achievementDesc}>
                        80%+ average accuracy
                      </Text>
                    </View>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}

                {stats.totalPhrasesPracticed === 0 && (
                  <View style={styles.noAchievements}>
                    <Text style={styles.noAchievementsText}>
                      Start practicing phrases to unlock achievements! 🚀
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>🌐 Language</Text>
            <Text style={styles.settingValue}>Yoruba</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>🔔 Notifications</Text>
            <Text style={styles.settingValue}>Enabled</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>📧 Email</Text>
            <Text style={styles.settingValue}>{user.email}</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    fontSize: 32,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statCard1: {
    backgroundColor: '#EDE9FE',
  },
  statCard2: {
    backgroundColor: '#FEF3C7',
  },
  statCard3: {
    backgroundColor: '#DBEAFE',
  },
  statCard4: {
    backgroundColor: '#D1FAE5',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementSection: {
    marginTop: 24,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#A855F7',
  },
  achievementEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkmark: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '700',
  },
  noAchievements: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    alignItems: 'center',
  },
  noAchievementsText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    textAlign: 'center',
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  signOutButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 32,
  },
  signOutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  noUserText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});