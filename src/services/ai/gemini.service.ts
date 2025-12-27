import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface SpeechFeedback {
  isCorrect: boolean;
  accuracy: number;
  userPhrase: string;
  correctPhrase: string;
  pronunciation: string;
  toneCorrections?: string;
  grammarNotes?: string;
  encouragement: string;
  tips: string;
  exampleUsage?: string;
  keyPoints: string[];
}

export interface ChatResponse {
  response: string;
  status: string;
}

class GeminiService {
  private apiBaseUrl = API_BASE_URL;

  // Get feedback on spoken phrase
  async getSpeechFeedback(
    expectedPhrase: string,
    userTranscription: string,
    context: string = 'Learning Yoruba'
  ): Promise<SpeechFeedback> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/api/gemini/feedback`,
        {
          expectedPhrase,
          userTranscription,
          context
        },
        {
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Speech feedback error:', error);
      throw error;
    }
  }

  // Chat with AI tutor
  async getChatResponse(
    message: string,
    phraseContext: string = '',
    difficulty: string = 'beginner'
  ): Promise<ChatResponse> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/api/gemini/chat`,
        {
          message,
          phraseContext,
          difficulty
        },
        {
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }
}

export default new GeminiService();