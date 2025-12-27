import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { VoicePracticeCard, VoicePracticeFeedback } from '../../components/ai/VoicePracticeCard';
import { AITutorChat } from '../components/ai/AITutorChat';
import { activityService, authService } from '../services/supabase.service';

export const ContentDisplayScreen = ({ route }: any) => {
  const { phrase } = route.params;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoicePractice, setShowVoicePractice] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();
    logView();
  }, []);

  const getCurrentUser = async () => {
    const user = await authService.getCurrentUser();
    if (user) {
      setUserId(user.id);
    }
  };

  const logView = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        await activityService.logActivity(
          user.id,
          phrase.id,
          'view'
        );
      }
    } catch (error) {
      console.error('Log view error:', error);
    }
  };

  const playAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setSound(null);
        setIsPlaying(false);
        return;
      }

      if (!phrase.audio_url) {
        Alert.alert('No audio', 'This phrase does not have audio yet');
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: phrase.audio_url },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate(status => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setIsPlaying(false);
          setSound(null);
        }
      });

      await newSound.playAsync();
    } catch (error) {
      console.error('Audio error:', error);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Phrase display */}
      <View style={styles.phraseSection}>
        <Text style={styles.code}>{phrase.code}</Text>
        <Text style={styles.yorubaText}>{phrase.phrase}</Text>
        <Text style={styles.englishText}>{phrase.translation}</Text>
        <Text style={styles.categoryBadge}>{phrase.category}</Text>
      </View>

      {/* Audio playback */}
      {phrase.audio_url && (
        <View style={styles.audioSection}>
          <TouchableOpacity
            onPress={playAudio}
            style={[
              styles.playButton,
              isPlaying && styles.playButtonActive,
            ]}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️ Playing...' : '▶️ Play Audio'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.audioHint}>Listen to native pronunciation</Text>
        </View>
      )}

      {/* Pronunciation guide */}
      {phrase.pronunciation_guide && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>📝 Pronunciation</Text>
          <Text style={styles.infoText}>{phrase.pronunciation_guide}</Text>
        </View>
      )}

      {/* Tone marks */}
      {phrase.tone_marks && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>🎵 Tone Marks</Text>
          <Text style={styles.infoText}>{phrase.tone_marks}</Text>
        </View>
      )}

      {/* Example usage */}
      {phrase.example_usage && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>💬 Example Usage</Text>
          <Text style={styles.infoText}>{phrase.example_usage}</Text>
        </View>
      )}

      {/* Cultural notes */}
      {phrase.cultural_notes && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>🌍 Cultural Context</Text>
          <Text style={styles.infoText}>{phrase.cultural_notes}</Text>
        </View>
      )}

      {/* Practice options */}
      <View style={styles.practiceSection}>
        <Text style={styles.sectionTitle}>🎓 Learning Options</Text>

        {/* Voice practice */}
        <TouchableOpacity
          onPress={() => setShowVoicePractice(!showVoicePractice)}
          style={styles.practiceButton}
        >
          <Text style={styles.practiceButtonIcon}>🎤</Text>
          <View style={styles.practiceButtonContent}>
            <Text style={styles.practiceButtonTitle}>Practice Speaking</Text>
            <Text style={styles.practiceButtonDesc}>
              Record and get AI feedback
            </Text>
          </View>
        </TouchableOpacity>

        {/* AI tutor */}
        <TouchableOpacity
          onPress={() => setShowAIChat(!showAIChat)}
          style={styles.practiceButton}
        >
          <Text style={styles.practiceButtonIcon}>🤖</Text>
          <View style={styles.practiceButtonContent}>
            <Text style={styles.practiceButtonTitle}>Chat with AI Tutor</Text>
            <Text style={styles.practiceButtonDesc}>
              Have a conversation
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Voice practice card */}
      {showVoicePractice && userId && (
        <View style={styles.expandedSection}>
          <VoicePracticeCard
            phrase={phrase}
            userId={userId}
            onFeedback={async (feedback: VoicePracticeFeedback) => {
              console.log('Feedback:', feedback);
              // Log to Supabase
              if (feedback.isCorrect) {
            await activityService.logActivity(
              userId,
              phrase.id,
              'voice_practice',
              { is_correct: true, accuracy_score: feedback.accuracy }
            );
              }
            }}
          />
        </View>
      )}

      {/* AI chat */}
      {showAIChat && userId && (
        <View style={styles.expandedSection}>
          <AITutorChat phrase={phrase} userId={userId} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  phraseSection: {
    padding: 20,
    backgroundColor: '#F3E8FF',
    borderBottomWidth: 2,
    borderBottomColor: '#A855F7',
  },
  code: {
    fontSize: 12,
    color: '#A855F7',
    fontWeight: '700',
    marginBottom: 8,
  },
  yorubaText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  englishText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A855F7',
    backgroundColor: '#F9E6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  audioSection: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  playButton: {
    backgroundColor: '#78B242',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  playButtonActive: {
    backgroundColor: '#65A528',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  audioHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#78B242',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  practiceSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#78B242',
  },
  practiceButtonIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  practiceButtonContent: {
    flex: 1,
  },
  practiceButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  practiceButtonDesc: {
    fontSize: 13,
    color: '#666',
  },
  expandedSection: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
    borderRadius: 8,
    maxHeight: 500,
  },
});