/**
 * Suggestion Service
 * Phase 3: API client for fetching suggestions with context window extraction
 */

import type { ContextType } from '../types';
import type { Suggestion } from '../components/SuggestionStrip';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Context window configuration - expanded for better LLM understanding
const CONTEXT_WINDOW = {
  MIN_WORDS: 6,
  MAX_WORDS: 15, // Increased from 12 to give more context
};

interface SuggestionsResponse {
  suggestions: Suggestion[];
  context: ContextType;
  timestamp: string;
}

/**
 * Extract the last N words as context window
 * Gives LLM focused, recent context for better predictions
 */
function extractContextWindow(text: string, minWords: number = 6, maxWords: number = 15): string {
  if (!text || text.trim().length === 0) {
    return text;
  }

  // Split by whitespace and filter empty strings
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);

  // If fewer words than minimum, return all text
  if (words.length <= minWords) {
    console.log(`📝 Context window: FULL TEXT (${words.length} words)`);
    return text;
  }

  // Take last MAX_WORDS words for context
  const contextWords = words.slice(-maxWords);
  const contextWindow = contextWords.join(' ');

  console.log(`📝 Context window: "${contextWindow}"`);
  console.log(`   ↳ (${contextWords.length} words from ${words.length} total)`);

  return contextWindow;
}

/**
 * Fetch suggestions from backend API
 * @param text - Current input text
 * @param context - Current context (code/email/chat)
 * @param maxSuggestions - Maximum number of suggestions to return
 * @returns Promise with suggestions
 */
export async function fetchSuggestions(
  text: string,
  context: ContextType,
  maxSuggestions: number = 5
): Promise<Suggestion[]> {
  try {
    console.log('\n🌐 FRONTEND: Calling backend API');
    console.log('   Full text:', text);
    console.log('   Context:', context);

    // SEND FULL TEXT - Don't extract context window here
    // Let backend do pattern matching on full text
    const response = await fetch(`${API_BASE_URL}/api/v1/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text, // Send FULL text for pattern matching
        context,
        max_suggestions: maxSuggestions,
      }),
    });

    console.log('   Response status:', response.status);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: SuggestionsResponse = await response.json();
    return data.suggestions || [];

  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    // Return fallback suggestions on error
    return getFallbackSuggestions(text, context);
  }
}

/**
 * Smart fallback suggestions based on context and text
 * Mirrors backend pattern matching logic for consistency
 */
function getFallbackSuggestions(text: string, context: ContextType): Suggestion[] {
  if (!text || text.trim().length === 0) {
    // Empty text - provide starter suggestions
    if (context === 'code') {
      return [
        { text: 'const', confidence: 0.90, type: 'keyword' },
        { text: 'function', confidence: 0.85, type: 'keyword' },
        { text: 'let', confidence: 0.80, type: 'keyword' },
        { text: 'import', confidence: 0.75, type: 'keyword' }
      ];
    } else if (context === 'email') {
      return [
        { text: 'Dear', confidence: 0.90, type: 'phrase' },
        { text: 'Hi', confidence: 0.85, type: 'word' },
        { text: 'Hello', confidence: 0.80, type: 'word' },
        { text: 'Good', confidence: 0.75, type: 'word' }
      ];
    } else {
      return [
        { text: 'hey', confidence: 0.90, type: 'word' },
        { text: 'hi', confidence: 0.85, type: 'word' },
        { text: '👋', confidence: 0.80, type: 'emoji' },
        { text: 'yo', confidence: 0.75, type: 'word' }
      ];
    }
  }

  const lowerText = text.toLowerCase().trim();
  const words = text.trim().split(/\s+/);
  const lastWord = words[words.length - 1] || '';
  const lastTwoWords = words.slice(-2).join(' ').toLowerCase();

  // Context-specific smart suggestions with pattern matching
  if (context === 'code') {
    return getCodeSuggestions(text, lowerText, lastWord, lastTwoWords);
  } else if (context === 'email') {
    return getEmailSuggestions(text, lowerText, lastWord, lastTwoWords);
  } else {
    return getChatSuggestions(text, lowerText, lastWord, lastTwoWords);
  }
}

/**
 * Code-specific suggestions with intelligent pattern matching and language detection
 */
function getCodeSuggestions(text: string, lowerText: string, lastWord: string, lastTwoWords: string): Suggestion[] {
  // Detect language
  const isJava = /\b(public|private|protected|class|void|static|String|int|double)\b/.test(text);
  const isPython = /\b(def|import|from|class|self|__init__|print)\b/.test(text);
  const isJavaScript = /\b(const|let|var|function|async|await|import|export)\b/.test(text);

  // Java-specific patterns
  if (isJava) {
    // After "public static void"
    if (/public\s+static\s+void\s+\w*$/i.test(text)) {
      return [
        { text: 'main', confidence: 0.98, type: 'identifier' },
        { text: 'execute', confidence: 0.85, type: 'identifier' },
        { text: 'run', confidence: 0.80, type: 'identifier' },
        { text: 'process', confidence: 0.75, type: 'identifier' }
      ];
    }

    // After "public class"
    if (/public\s+class\s+\w*$/i.test(text)) {
      return [
        { text: 'Main', confidence: 0.90, type: 'identifier' },
        { text: 'Application', confidence: 0.85, type: 'identifier' },
        { text: 'Service', confidence: 0.80, type: 'identifier' },
        { text: 'Controller', confidence: 0.75, type: 'identifier' }
      ];
    }

    // After "void"
    if (lowerText.endsWith('void')) {
      return [
        { text: 'main', confidence: 0.90, type: 'identifier' },
        { text: 'execute', confidence: 0.85, type: 'identifier' },
        { text: 'process', confidence: 0.80, type: 'identifier' },
        { text: 'handle', confidence: 0.75, type: 'identifier' }
      ];
    }
  }

  // Python-specific patterns
  if (isPython) {
    // After "def"
    if (lowerText.endsWith('def')) {
      return [
        { text: 'main', confidence: 0.90, type: 'identifier' },
        { text: 'init', confidence: 0.85, type: 'identifier' },
        { text: 'calculate', confidence: 0.80, type: 'identifier' },
        { text: 'process', confidence: 0.75, type: 'identifier' }
      ];
    }

    // After "import"
    if (lowerText.endsWith('import')) {
      return [
        { text: 'os', confidence: 0.90, type: 'identifier' },
        { text: 'sys', confidence: 0.85, type: 'identifier' },
        { text: 'numpy', confidence: 0.80, type: 'identifier' },
        { text: 'pandas', confidence: 0.75, type: 'identifier' }
      ];
    }
  }

  // JavaScript/TypeScript patterns (default)
  // After function keyword
  if (lowerText.endsWith('function')) {
    return [
      { text: 'handle', confidence: 0.95, type: 'identifier' },
      { text: 'calculate', confidence: 0.90, type: 'identifier' },
      { text: 'get', confidence: 0.85, type: 'identifier' },
      { text: 'fetch', confidence: 0.80, type: 'identifier' }
    ];
  }

  // After const/let/var without equals
  if (/\b(const|let|var)\s+\w*$/.test(text) && !text.includes('=')) {
    return [
      { text: 'result', confidence: 0.95, type: 'identifier' },
      { text: 'data', confidence: 0.90, type: 'identifier' },
      { text: 'response', confidence: 0.85, type: 'identifier' },
      { text: 'user', confidence: 0.80, type: 'identifier' }
    ];
  }

  // After variable name, before assignment
  if (/\b(const|let|var)\s+\w+$/.test(text)) {
    return [
      { text: '=', confidence: 0.98, type: 'keyword' },
      { text: ':', confidence: 0.85, type: 'keyword' },
      { text: ';', confidence: 0.70, type: 'keyword' }
    ];
  }

  // After equals sign
  if (text.trim().endsWith('=')) {
    return [
      { text: 'await', confidence: 0.90, type: 'keyword' },
      { text: 'new', confidence: 0.85, type: 'keyword' },
      { text: 'null', confidence: 0.80, type: 'keyword' },
      { text: '""', confidence: 0.75, type: 'keyword' }
    ];
  }

  // After await
  if (lowerText.endsWith('await')) {
    return [
      { text: 'fetch', confidence: 0.95, type: 'identifier' },
      { text: 'response', confidence: 0.90, type: 'identifier' },
      { text: 'Promise', confidence: 0.85, type: 'identifier' },
      { text: 'getData', confidence: 0.80, type: 'identifier' }
    ];
  }

  // After if
  if (lowerText.endsWith('if')) {
    return [
      { text: '(', confidence: 0.98, type: 'keyword' },
      { text: 'condition', confidence: 0.85, type: 'identifier' }
    ];
  }

  // After return
  if (lowerText.endsWith('return')) {
    return [
      { text: 'null', confidence: 0.90, type: 'keyword' },
      { text: 'true', confidence: 0.85, type: 'keyword' },
      { text: 'false', confidence: 0.85, type: 'keyword' },
      { text: 'result', confidence: 0.80, type: 'identifier' }
    ];
  }

  // After dot (method chaining)
  if (text.trim().endsWith('.')) {
    return [
      { text: 'map', confidence: 0.90, type: 'identifier' },
      { text: 'filter', confidence: 0.88, type: 'identifier' },
      { text: 'forEach', confidence: 0.85, type: 'identifier' },
      { text: 'then', confidence: 0.82, type: 'identifier' }
    ];
  }

  // After opening parenthesis
  if (text.trim().endsWith('(')) {
    return [
      { text: 'req', confidence: 0.85, type: 'identifier' },
      { text: 'data', confidence: 0.82, type: 'identifier' },
      { text: 'event', confidence: 0.80, type: 'identifier' },
      { text: 'item', confidence: 0.78, type: 'identifier' }
    ];
  }

  // Default code keywords
  return [
    { text: 'const', confidence: 0.85, type: 'keyword' },
    { text: 'function', confidence: 0.82, type: 'keyword' },
    { text: 'return', confidence: 0.80, type: 'keyword' },
    { text: 'await', confidence: 0.78, type: 'keyword' }
  ];
}

/**
 * Email-specific suggestions with intelligent pattern matching
 */
function getEmailSuggestions(text: string, lowerText: string, lastWord: string, lastTwoWords: string): Suggestion[] {
  const words = text.trim().split(/\s+/);

  // Greetings (beginning of email)
  if (words.length <= 3) {
    return [
      { text: 'Dear', confidence: 0.95, type: 'phrase' },
      { text: 'Hi', confidence: 0.90, type: 'word' },
      { text: 'Hello', confidence: 0.88, type: 'word' },
      { text: 'Good', confidence: 0.85, type: 'word' }
    ];
  }

  // After "I hope"
  if (lastTwoWords === 'i hope' || lowerText.endsWith('hope')) {
    return [
      { text: 'this', confidence: 0.95, type: 'word' },
      { text: 'you', confidence: 0.90, type: 'word' },
      { text: 'all', confidence: 0.85, type: 'word' }
    ];
  }

  // After "this email"
  if (lastTwoWords === 'this email') {
    return [
      { text: 'finds', confidence: 0.98, type: 'word' },
      { text: 'reaches', confidence: 0.85, type: 'word' }
    ];
  }

  // After "Thank you"
  if (lastTwoWords === 'thank you' || lowerText.includes('thank you')) {
    return [
      { text: 'for', confidence: 0.95, type: 'word' },
      { text: 'so', confidence: 0.88, type: 'word' },
      { text: 'very', confidence: 0.85, type: 'word' }
    ];
  }

  // Closing detection (many sentences)
  const sentenceCount = (text.match(/[.!?]/g) || []).length;
  if (sentenceCount >= 2) {
    return [
      { text: 'Best', confidence: 0.90, type: 'word' },
      { text: 'Sincerely,', confidence: 0.88, type: 'phrase' },
      { text: 'Thanks,', confidence: 0.85, type: 'phrase' },
      { text: 'Regards,', confidence: 0.82, type: 'phrase' }
    ];
  }

  // Default email words
  return [
    { text: 'the', confidence: 0.85, type: 'word' },
    { text: 'you', confidence: 0.83, type: 'word' },
    { text: 'and', confidence: 0.80, type: 'word' },
    { text: 'for', confidence: 0.78, type: 'word' }
  ];
}

/**
 * Chat-specific suggestions with intelligent context-aware pattern matching
 */
function getChatSuggestions(text: string, lowerText: string, lastWord: string, lastTwoWords: string): Suggestion[] {
  const words = text.trim().split(/\s+/);

  // Very short - greetings (1 word only)
  if (words.length <= 1) {
    return [
      { text: 'hey', confidence: 0.95, type: 'word' },
      { text: 'hi', confidence: 0.90, type: 'word' },
      { text: '👋', confidence: 0.88, type: 'emoji' },
      { text: 'yo', confidence: 0.85, type: 'word' }
    ];
  }

  // Common conversational patterns (exact matches)
  if (/\bhow\s+are\s+you\s*$/i.test(text)) {
    return [
      { text: 'doing', confidence: 0.95, type: 'word' },
      { text: '?', confidence: 0.90, type: 'punctuation' },
      { text: 'today', confidence: 0.85, type: 'word' },
      { text: 'feeling', confidence: 0.80, type: 'word' }
    ];
  }

  if (/\bwhat\s+are\s+you\s*$/i.test(text)) {
    return [
      { text: 'doing', confidence: 0.95, type: 'word' },
      { text: 'up', confidence: 0.90, type: 'word' },
      { text: 'saying', confidence: 0.85, type: 'word' },
      { text: 'thinking', confidence: 0.80, type: 'word' }
    ];
  }

  if (/\bare\s+you\s*$/i.test(text)) {
    return [
      { text: 'okay', confidence: 0.95, type: 'word' },
      { text: 'free', confidence: 0.90, type: 'word' },
      { text: 'ready', confidence: 0.85, type: 'word' },
      { text: 'good', confidence: 0.80, type: 'word' }
    ];
  }

  if (/\bi\s+am\s+doing\s*$/i.test(text)) {
    return [
      { text: 'well', confidence: 0.95, type: 'word' },
      { text: 'good', confidence: 0.90, type: 'word' },
      { text: 'fine', confidence: 0.85, type: 'word' },
      { text: 'great', confidence: 0.80, type: 'word' }
    ];
  }

  if (/\bsee\s+you\s*$/i.test(text)) {
    return [
      { text: 'soon', confidence: 0.95, type: 'word' },
      { text: 'later', confidence: 0.90, type: 'word' },
      { text: 'tomorrow', confidence: 0.85, type: 'word' },
      { text: 'tonight', confidence: 0.80, type: 'word' }
    ];
  }

  if (/\bdoing\s*$/i.test(text) && !lowerText.includes('am doing')) {
    return [
      { text: '?', confidence: 0.95, type: 'punctuation' },
      { text: 'today', confidence: 0.90, type: 'word' },
      { text: 'now', confidence: 0.85, type: 'word' },
      { text: 'there', confidence: 0.80, type: 'word' }
    ];
  }

  if (/\btalk\s+to\s+you\s*$/i.test(text)) {
    return [
      { text: 'soon', confidence: 0.95, type: 'word' },
      { text: 'later', confidence: 0.90, type: 'word' },
      { text: 'tomorrow', confidence: 0.85, type: 'word' }
    ];
  }

  if (/\bthank\s+you\s*$/i.test(text) || /\bthanks\s*$/i.test(text)) {
    return [
      { text: '!', confidence: 0.95, type: 'punctuation' },
      { text: 'so', confidence: 0.90, type: 'word' },
      { text: 'a', confidence: 0.85, type: 'word' },
      { text: 'for', confidence: 0.80, type: 'word' }
    ];
  }

  // Partial phrase completions
  if (/\bhow\s+are\s*$/i.test(text)) {
    return [
      { text: 'you', confidence: 0.98, type: 'word' },
      { text: 'things', confidence: 0.85, type: 'word' },
      { text: 'ya', confidence: 0.80, type: 'word' }
    ];
  }

  // After "I'm"
  if (lowerText.endsWith("i'm") || lowerText.endsWith('im')) {
    return [
      { text: 'good', confidence: 0.90, type: 'word' },
      { text: 'fine', confidence: 0.88, type: 'word' },
      { text: 'doing', confidence: 0.85, type: 'word' },
      { text: 'excited', confidence: 0.82, type: 'word' }
    ];
  }

  // After "that's"
  if (lowerText.endsWith("that's") || lowerText.endsWith('thats')) {
    return [
      { text: 'cool', confidence: 0.95, type: 'word' },
      { text: 'awesome', confidence: 0.90, type: 'word' },
      { text: 'great', confidence: 0.88, type: 'word' },
      { text: 'sick', confidence: 0.85, type: 'word' }
    ];
  }

  // After excitement
  if (text.includes('!')) {
    return [
      { text: '!', confidence: 0.90, type: 'punctuation' },
      { text: '😂', confidence: 0.88, type: 'emoji' },
      { text: 'lol', confidence: 0.85, type: 'expression' },
      { text: '😊', confidence: 0.82, type: 'emoji' }
    ];
  }

  // Default: return generic chat words
  return [
    { text: 'yeah', confidence: 0.85, type: 'word' },
    { text: 'ok', confidence: 0.82, type: 'word' },
    { text: '😊', confidence: 0.80, type: 'emoji' },
    { text: 'lol', confidence: 0.78, type: 'expression' }
  ];
}
