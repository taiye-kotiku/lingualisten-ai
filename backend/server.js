const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'LinguaListen AI Backend',
    timestamp: new Date().toISOString()
  });
});

// Gemini feedback endpoint
app.post('/api/gemini/feedback', async (req, res) => {
  try {
    const { expectedPhrase, userTranscription, context } = req.body;

    // For now, return mock data
    // In production, call actual Gemini API
    const mockFeedback = {
      isCorrect: userTranscription.toLowerCase().includes(expectedPhrase.toLowerCase()),
      accuracy: Math.random() * 100,
      userPhrase: userTranscription,
      correctPhrase: expectedPhrase,
      pronunciation: 'Your pronunciation was clear',
      encouragement: 'Great effort! Keep practicing.',
      tips: 'Try to emphasize the tonal marks (á, ā, à)',
      keyPoints: [
        'Focus on tone marks',
        'Slow down and enunciate',
        'Listen to native speakers'
      ]
    };

    res.json(mockFeedback);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Gemini chat endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, difficulty } = req.body;

    // For now, return mock response
    const mockResponse = {
      response: `That's a great question about Yoruba! Here's a helpful response: ${message}`,
      status: 'success'
    };

    res.json(mockResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LinguaListen AI Backend running on port ${PORT}`);
});