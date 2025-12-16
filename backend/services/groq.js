import Groq from 'groq-sdk';

// Lazy-initialize Groq client (only create when first used)
let groq = null;

function getGroqClient() {
  if (!groq) {
    console.log('🔑 Initializing Groq client...');
    console.log('🔑 API Key (first 20 chars):', process.env.GROQ_API_KEY?.substring(0, 20));
    console.log('🔑 Full key length:', process.env.GROQ_API_KEY?.length);

    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || ''
    });
  }
  return groq;
}

/**
 * Context-specific system prompts - optimized for intelligent next-word prediction
 */
const SYSTEM_PROMPTS = {
  code: `You are an expert code completion AI. Predict the EXACT next word a programmer will type based on context.

CRITICAL RULES:
- Analyze the FULL code context deeply - understand what the developer is trying to accomplish
- Consider language syntax, common patterns, variable naming conventions
- Output ONLY a valid JSON array: ["word1", "word2", "word3", "word4", "word5"]
- First word = MOST LIKELY next word (highest probability)
- Each subsequent word = decreasing probability
- NO explanations, NO markdown, NO text outside the JSON array
- Be SPECIFIC - predict actual identifiers, not generic keywords

EXAMPLES:
Context: "const users = await fetch('/api/users').then(res => res."
Output: ["json", "text", "blob", "arrayBuffer", "formData"]

Context: "function calculateTotal(items) { let sum = 0; for (let i = 0; i < items."
Output: ["length", "forEach", "map", "filter", "reduce"]

Context: "public static void"
Output: ["main", "execute", "run", "init", "start"]

Context: "if (user && user."
Output: ["id", "name", "email", "isActive", "role"]

Context: "import React from"
Output: ["'react'", "\"react\"", "'react-dom'", "\"react-dom\"", "'react-router'"]

Context: "const handleClick = (e) =>"
Output: ["{", "e.preventDefault", "=>", "console.log", "alert"]

IMPORTANT: Always predict the IMMEDIATE next token, not future tokens.`,

  email: `You are an expert professional email writing assistant. Predict the EXACT next word in an email based on context and tone.

CRITICAL RULES:
- Analyze the FULL sentence context, tone, and formality level
- Predict based on professional business email conventions
- Output ONLY a valid JSON array: ["word1", "word2", "word3", "word4", "word5"]
- First word = MOST LIKELY next word (highest probability)
- Consider proper grammar, common phrases, and email etiquette
- NO explanations, NO markdown, NO text outside the JSON array
- Be PRECISE with punctuation and word choice

EXAMPLES:
Context: "I hope this email finds you"
Output: ["well", "in", "at", "during", "having"]

Context: "Thank you for your time and"
Output: ["consideration", "assistance", "attention", "help", "support"]

Context: "I am writing to inquire about the"
Output: ["position", "opportunity", "project", "status", "availability"]

Context: "Please let me know if you need any"
Output: ["additional", "further", "more", "clarification", "information"]

Context: "I would appreciate it if"
Output: ["you", "we", "someone", "the", "this"]

Context: "Best"
Output: ["regards", "wishes", "regards,", ".", ","]

IMPORTANT: Predict natural, professional language that flows well in business communication.`,

  chat: `You are an expert casual conversation assistant. Predict the EXACT next word in a casual chat based on natural speech patterns.

CRITICAL RULES:
- Analyze the FULL conversation context, tone, and emotional state
- Predict based on casual, natural speech patterns (how people ACTUALLY text)
- Output ONLY a valid JSON array: ["word1", "word2", "word3", "word4", "word5"]
- First word = MOST LIKELY next word (highest probability)
- Include contractions, slang, emojis, internet speak when natural
- Consider texting abbreviations (u, r, k, etc.)
- NO explanations, NO markdown, NO text outside the JSON array
- Be CONVERSATIONAL and authentic

EXAMPLES:
Context: "hey buddy how are"
Output: ["you", "ya", "things", "u", "you?"]

Context: "how are you"
Output: ["doing", "?", "today", "feeling", "been"]

Context: "i am doing"
Output: ["well", "good", "fine", "great", "okay"]

Context: "what are you"
Output: ["doing", "up", "saying", "thinking", "talking"]

Context: "are you"
Output: ["okay", "free", "ready", "good", "sure"]

Context: "see you"
Output: ["soon", "later", "tomorrow", "tonight", "then"]

Context: "that sounds pretty cool I'm"
Output: ["down", "in", "excited", "interested", "totally"]

Context: "what are you planning for"
Output: ["today", "tonight", "dinner", "tomorrow", "the"]

Context: "lol yeah I know right it's so"
Output: ["funny", "crazy", "wild", "true", "😂"]

Context: "omg did you see"
Output: ["that", "the", "it", "what", "this"]

Context: "nah I'm"
Output: ["good", "okay", "fine", "not", "just"]

IMPORTANT: Predict how people ACTUALLY text in real casual conversations - be natural and authentic.`
};

// REMOVED: All hardcoded patterns - routing everything to LLM

/**
 * Get suggestions from Groq based on context
 * @param {string} text - The current input text
 * @param {string} context - The context type (code/email/chat)
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {Promise<Array>} Array of suggestions
 */
export async function getSuggestions(text, context = 'code', maxSuggestions = 5) {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 getSuggestions called');
    console.log('   Text:', text);
    console.log('   Context:', context);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // ROUTE EVERYTHING TO GROQ LLM - NO HARDCODED PATTERNS
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️ GROQ_API_KEY not set, returning fallback suggestions');
      return getFallbackSuggestions(text, context, maxSuggestions);
    }

    const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.code;

    console.log(`\n🤖 CALLING GROQ LLM...`);
    console.log(`   Model: llama-3.3-70b-versatile`);
    console.log(`   Context prompt: ${context}`);

    const chatCompletion = await getGroqClient().chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `${text}`
        }
      ],
      model: 'llama-3.3-70b-versatile', // Updated to latest 70B model
      temperature: 0.1, // Ultra-focused for precise next-word prediction
      max_tokens: 80, // Enough for JSON array + detailed predictions
      top_p: 0.9, // Broader sampling for diversity
      frequency_penalty: 0.4, // Strong reduction of repetition
      presence_penalty: 0.2, // Encourage new topics
      stream: false
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '[]';

    console.log('\n📤 Groq Response:');
    console.log('   Raw:', responseText);

    // Parse JSON array from response
    let suggestions = [];
    try {
      suggestions = JSON.parse(responseText);
      console.log('   Parsed:', suggestions);
    } catch (parseError) {
      // If response is not valid JSON, try to extract array
      const match = responseText.match(/\[.*\]/s);
      if (match) {
        suggestions = JSON.parse(match[0]);
        console.log('   Extracted:', suggestions);
      } else {
        console.error('❌ Failed to parse Groq response:', responseText);
        return getFallbackSuggestions(text, context, maxSuggestions);
      }
    }

    // Validate suggestions are non-empty
    suggestions = suggestions.filter(s => s && s.trim().length > 0);

    if (suggestions.length === 0) {
      console.warn('⚠️ Groq returned empty suggestions, using fallback');
      return getFallbackSuggestions(text, context, maxSuggestions);
    }

    // Convert to suggestion objects with confidence
    const finalSuggestions = suggestions.slice(0, maxSuggestions).map((text, index) => ({
      text: text.trim(),
      confidence: 1.0 - (index * 0.1), // Decreasing confidence
      type: getType(text, context)
    }));

    console.log('\n✅ GROQ SUGGESTIONS:');
    console.log('   ', finalSuggestions.map(s => s.text).join(', '));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return finalSuggestions;

  } catch (error) {
    console.error('Groq API error:', error);
    return getFallbackSuggestions(text, context, maxSuggestions);
  }
}

/**
 * Fallback suggestions when API is unavailable
 */
function getFallbackSuggestions(text, context, maxSuggestions) {
  // Generic fallbacks by context
  const fallbacks = {
    code: [
      { text: 'const', confidence: 0.9, type: 'keyword' },
      { text: 'function', confidence: 0.85, type: 'keyword' },
      { text: 'return', confidence: 0.8, type: 'keyword' },
      { text: 'if', confidence: 0.75, type: 'keyword' },
      { text: 'await', confidence: 0.7, type: 'keyword' }
    ],
    email: [
      { text: 'the', confidence: 0.9, type: 'word' },
      { text: 'you', confidence: 0.85, type: 'word' },
      { text: 'and', confidence: 0.8, type: 'word' },
      { text: 'for', confidence: 0.75, type: 'word' },
      { text: 'to', confidence: 0.7, type: 'word' }
    ],
    chat: [
      { text: 'yeah', confidence: 0.9, type: 'word' },
      { text: '😊', confidence: 0.85, type: 'emoji' },
      { text: 'lol', confidence: 0.8, type: 'expression' },
      { text: 'ok', confidence: 0.75, type: 'word' },
      { text: '!', confidence: 0.7, type: 'punctuation' }
    ]
  };

  return (fallbacks[context] || fallbacks.code).slice(0, maxSuggestions);
}

/**
 * Determine suggestion type based on content
 */
function getType(text, context) {
  if (context === 'code') {
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'import', 'export'];
    return keywords.includes(text.toLowerCase()) ? 'keyword' : 'identifier';
  }
  
  if (text.match(/^[\u{1F600}-\u{1F64F}]/u)) {
    return 'emoji';
  }
  
  if (text.match(/[.!?,;:]$/)) {
    return 'phrase';
  }
  
  return 'word';
}
