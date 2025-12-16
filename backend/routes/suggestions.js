import express from 'express';
import { getSuggestions } from '../services/groq.js';

const router = express.Router();

/**
 * POST /api/v1/suggestions
 * Get context-aware suggestions for the current text
 */
router.post('/suggestions', async (req, res) => {
  try {
    const { text, context, max_suggestions = 5 } = req.body;

    // LOG INCOMING REQUEST
    console.log('\n=== SUGGESTION REQUEST ===');
    console.log('Text:', JSON.stringify(text));
    console.log('Context:', context);
    console.log('Length:', text?.length);
    console.log('==========================\n');

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    if (!['code', 'email', 'chat'].includes(context)) {
      return res.status(400).json({
        error: 'Context must be one of: code, email, chat'
      });
    }

    // Get suggestions from Groq
    const suggestions = await getSuggestions(text, context, max_suggestions);

    res.json({
      suggestions,
      context,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Suggestions endpoint error:', error);
    res.status(500).json({
      error: 'Failed to fetch suggestions',
      message: error.message
    });
  }
});

export default router;
