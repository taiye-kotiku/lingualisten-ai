import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import geminiService from '../../services/ai/gemini.service';

interface VoicePracticeCardProps {
  phrase: {
    id: string;
    code: string;
    phrase: string;
    translation: string;
    category: string;
  };
  userId: string;
  onFeedback?: (feedback: any) => void;
}

interface FeedbackState {
  loading: boolean;
  feedback: any | null;
  error: string | null;
  isCorrect: boolean | null;
}

export const VoicePracticeCard: React.FC<VoicePracticeCardProps> = ({
  phrase,
  userId,
  onFeedback,
}) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    loading: false,
    feedback: null,
    error: null,
    isCorrect: null,
  });

  // Start recording
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      const newRecording = new Audio.Recording();
      
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      setFeedbackState({ loading: false, feedback: null, error: null, isCorrect: null });
    } catch (error) {
      console.error('Recording error:', error);
      setFeedbackState(prev => ({
        ...prev,
        error: 'Failed to start recording'
      }));
    }
  };

  // Stop recording and process
  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setFeedbackState(prev => ({ ...prev, loading: true }));
      
      await recording.stopAndUnloadAsync();

      // For now, use a mock transcription
      // In production, use Google Speech-to-Text API
      const mockTranscription = phrase.phrase;

      // Get feedback from Gemini
      const feedback = await geminiService.getSpeechFeedback(
        phrase.phrase,
        mockTranscription,
        phrase.category
      );

      setFeedbackState({
        loading: false,
        feedback,
        error: null,
        isCorrect: feedback.isCorrect,
      });

      // Call parent callback
      onFeedback?.(feedback);
    } catch (error) {
      console.error('Error processing recording:', error);
      setFeedbackState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to process your speech',
      }));
    } finally {
      setRecording(null);
    }
  };

  // Clear feedback
  const clearFeedback = () => {
    setFeedbackState({
      loading: false,
      feedback: null,
      error: null,
      isCorrect: null,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Phrase to practice */}
      <View style={styles.phraseSection}>
        <Text style={styles.sectionTitle}>Practice This Phrase</Text>
        <View style={styles.phraseBox}>
          <Text style={styles.phraseText}>{phrase.phrase}</Text>
          <Text style={styles.translationText}>{phrase.translation}</Text>
        </View>
      </View>

      {/* Recording controls */}
      <View style={styles.recordingSection}>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          disabled={feedbackState.loading}
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive,
            feedbackState.loading && styles.recordButtonDisabled,
          ]}
        >
          {feedbackState.loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.recordButtonText}>
              {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
            </Text>
          )}
        </TouchableOpacity>

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <Text style={styles.recordingText}>Recording...</Text>
          </View>
        )}
      </View>

      {/* Error message */}
      {feedbackState.error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {feedbackState.error}</Text>
        </View>
      )}

      {/* Feedback section */}
      {feedbackState.feedback && (
        <View style={[
          styles.feedbackBox,
          feedbackState.isCorrect ? styles.feedbackSuccess : styles.feedbackNeeds
        ]}>
          <View style={styles.accuracySection}>
            <Text style={styles.accuracyLabel}>Accuracy</Text>
            <View style={styles.accuracyBar}>
              <View
                style={[
                  styles.accuracyFill,
                  { width: `${feedbackState.feedback.accuracy}%` }
                ]}
              />
            </View>
            <Text style={styles.accuracyText}>
              {feedbackState.feedback.accuracy}%
            </Text>
          </View>

          <View style={styles.feedbackItem}>
            <Text style={styles.feedbackLabel}>Feedback</Text>
            <Text style={styles.feedbackValue}>
              {feedbackState.feedback.encouragement}
            </Text>
          </View>

          {feedbackState.feedback.pronunciation && (
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackLabel}>Pronunciation</Text>
              <Text style={styles.feedbackValue}>
                {feedbackState.feedback.pronunciation}
              </Text>
            </View>
          )}

          {feedbackState.feedback.tips && (
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackLabel}>💡 Tips</Text>
              <Text style={styles.feedbackValue}>
                {feedbackState.feedback.tips}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={clearFeedback}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  phraseSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  phraseBox: {
    backgroundColor: '#F3E8FF',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#A855F7',
  },
  phraseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 16,
    color: '#666',
  },
  recordingSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#F97316',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#EF4444',
  },
  recordButtonDisabled: {
    opacity: 0.6,
  },
  recordButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordingIndicator: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  recordingText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontWeight: '500',
  },
  feedbackBox: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  feedbackSuccess: {
    backgroundColor: '#F0FDF4',
    borderLeftColor: '#22C55E',
  },
  feedbackNeeds: {
    backgroundColor: '#FEF3C7',
    borderLeftColor: '#F59E0B',
  },
  accuracySection: {
    marginBottom: 16,
  },
  accuracyLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  accuracyBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  accuracyFill: {
    height: '100%',
    backgroundColor: '#22C55E',
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  feedbackItem: {
    marginBottom: 12,
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  feedbackValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  clearButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#0369A1',
    fontWeight: '600',
  },
});