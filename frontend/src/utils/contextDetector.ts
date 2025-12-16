/**
 * Client-Side Context Detection
 * Detects whether text is code, email, or chat based on patterns
 */

import type { ContextType } from '../types';

export interface DetectionResult {
  context: ContextType;
  confidence: number;
  scores: {
    code: number;
    email: number;
    chat: number;
  };
}

/**
 * Code indicators and patterns
 */
const CODE_PATTERNS = {
  keywords: [
    'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
    'return', 'import', 'export', 'class', 'interface', 'type',
    'async', 'await', 'try', 'catch', 'throw', 'new', 'this',
    'public', 'private', 'protected', 'static', 'void', 'int',
    'string', 'boolean', 'null', 'undefined', 'true', 'false'
  ],
  symbols: ['{}', '()', '[]', '=>', '===', '!==', '&&', '||', '++', '--'],
  patterns: [
    /function\s+\w+\(/,
    /const\s+\w+\s*=/,
    /let\s+\w+\s*=/,
    /var\s+\w+\s*=/,
    /if\s*\(/,
    /for\s*\(/,
    /while\s*\(/,
    /=>\s*{/,
    /\/\/.+/,  // Single-line comments
    /\/\*[\s\S]*?\*\//,  // Multi-line comments
    /<\w+>/,  // HTML/JSX tags
    /import .+ from/,
    /export (default|const|function)/
  ]
};

/**
 * Email indicators and patterns
 */
const EMAIL_PATTERNS = {
  keywords: [
    'dear', 'hi', 'hello', 'regards', 'sincerely', 'best', 'thank',
    'thanks', 'please', 'attached', 'forwarded', 'meeting', 'schedule',
    'appointment', 'regarding', 'subject', 'cc', 'bcc', 'from', 'to'
  ],
  greetings: ['Dear', 'Hi', 'Hello', 'Good morning', 'Good afternoon'],
  closings: ['Best regards', 'Sincerely', 'Thanks', 'Thank you', 'Cheers'],
  patterns: [
    /@\w+\.\w+/,  // Email addresses
    /Dear\s+\w+/,
    /Hi\s+\w+/,
    /Best\s+regards/i,
    /Sincerely/i,
    /Thank\s+you/i,
    /Please\s+find\s+attached/i,
    /I\s+hope\s+this\s+email\s+finds\s+you\s+well/i
  ]
};

/**
 * Chat indicators and patterns
 */
const CHAT_PATTERNS = {
  keywords: [
    'lol', 'omg', 'btw', 'brb', 'gtg', 'idk', 'tbh', 'imo', 'fyi',
    'gonna', 'wanna', 'yeah', 'yup', 'nope', 'hey', 'yo', 'sup',
    'ok', 'okay', 'cool', 'awesome', 'nice', 'haha', 'hehe', 'lmao'
  ],
  emojis: /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u,
  patterns: [
    /!{2,}/,  // Multiple exclamation marks
    /\?{2,}/,  // Multiple question marks
    /haha|hehe|lol|lmao/i,
    /omg|wtf|btw|fyi/i,
    /gonna|wanna|gotta/i,
    /^(hey|hi|yo|sup)\s/i
  ]
};

/**
 * Calculate score for code context
 */
function calculateCodeScore(text: string): number {
  let score = 0;

  // Check for keywords (higher weight)
  CODE_PATTERNS.keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      score += matches.length * 5; // Increased from 2 to 5
    }
  });

  // Check for symbols (higher weight)
  CODE_PATTERNS.symbols.forEach(symbol => {
    const count = (text.match(new RegExp(symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    score += count * 3; // Increased from 1.5 to 3
  });

  // Check for patterns (higher weight)
  CODE_PATTERNS.patterns.forEach(pattern => {
    if (pattern.test(text)) {
      score += 8; // Increased from 3 to 8
    }
  });

  // Check for common code characters (higher weight)
  const codeChars = ['{', '}', '(', ')', '[', ']', ';', ':', '=', '<', '>'];
  codeChars.forEach(char => {
    const count = (text.split(char).length - 1);
    score += count * 2; // Increased from 0.5 to 2
  });

  // Check for camelCase or snake_case (higher weight)
  if (/[a-z][A-Z]/.test(text) || /\w+_\w+/.test(text)) {
    score += 5; // Increased from 2 to 5
  }

  return score;
}

/**
 * Calculate score for email context
 */
function calculateEmailScore(text: string): number {
  let score = 0;
  const lowerText = text.toLowerCase();

  // Check for keywords
  EMAIL_PATTERNS.keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
  });

  // Check for greetings
  EMAIL_PATTERNS.greetings.forEach(greeting => {
    if (text.includes(greeting)) {
      score += 5;
    }
  });

  // Check for closings
  EMAIL_PATTERNS.closings.forEach(closing => {
    if (lowerText.includes(closing.toLowerCase())) {
      score += 5;
    }
  });

  // Check for patterns
  EMAIL_PATTERNS.patterns.forEach(pattern => {
    if (pattern.test(text)) {
      score += 4;
    }
  });

  // Check for formal language indicators
  if (/[A-Z][a-z]+\s+[A-Z][a-z]+/.test(text)) {  // Proper capitalization
    score += 2;
  }

  // Check for complete sentences (periods at end)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 1) {
    score += sentences.length;
  }

  return score;
}

/**
 * Calculate score for chat context
 */
function calculateChatScore(text: string): number {
  let score = 0;

  // Check for keywords
  CHAT_PATTERNS.keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      score += matches.length * 3;
    }
  });

  // Check for emojis
  const emojiMatches = text.match(new RegExp(CHAT_PATTERNS.emojis, 'gu'));
  if (emojiMatches) {
    score += emojiMatches.length * 5;
  }

  // Check for patterns
  CHAT_PATTERNS.patterns.forEach(pattern => {
    if (pattern.test(text)) {
      score += 3;
    }
  });

  // Check for informal punctuation - STRONGLY favor chat for exclamations
  if (/!{2,}|\?{2,}/.test(text)) {
    score += 8; // Multiple exclamations/questions = definitely chat
  }

  // Single exclamation marks in chat context (not at sentence end in formal email)
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 0) {
    // Each "!" adds to chat score - chat uses "!" liberally
    score += exclamationCount * 3;
  }

  // Check for short messages (typical in chat)
  const words = text.trim().split(/\s+/);
  if (words.length < 20 && words.length > 0) {
    score += 2;
  }

  // Check for lack of capitalization (informal)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let uncapitalized = 0;
  sentences.forEach(sentence => {
    if (sentence.trim().length > 0 && sentence.trim()[0] === sentence.trim()[0].toLowerCase()) {
      uncapitalized++;
    }
  });
  if (uncapitalized > 0) {
    score += uncapitalized * 1.5;
  }

  return score;
}

/**
 * Detect context from text
 */
export function detectContext(text: string): DetectionResult {
  if (!text || text.trim().length === 0) {
    return {
      context: 'code',
      confidence: 0,
      scores: { code: 0, email: 0, chat: 0 }
    };
  }

  // Calculate scores for each context
  const codeScore = calculateCodeScore(text);
  const emailScore = calculateEmailScore(text);
  const chatScore = calculateChatScore(text);

  // Determine winner
  const totalScore = codeScore + emailScore + chatScore;

  let context: ContextType = 'code';
  let winnerScore = codeScore;

  if (emailScore > codeScore && emailScore > chatScore) {
    context = 'email';
    winnerScore = emailScore;
  } else if (chatScore > codeScore && chatScore > emailScore) {
    context = 'chat';
    winnerScore = chatScore;
  }

  // Calculate confidence (0-1)
  const confidence = totalScore > 0 ? winnerScore / totalScore : 0;

  return {
    context,
    confidence,
    scores: {
      code: codeScore,
      email: emailScore,
      chat: chatScore
    }
  };
}

// Track last context switch time for cooldown
let lastSwitchTime = 0;
let lastSwitchContext: ContextType | null = null;

/**
 * Detect strong code patterns that should trigger immediate switch
 * Patterns detect partial code as user types, not just complete syntax
 */
function hasStrongCodeSignal(text: string): boolean {
  const strongPatterns = [
    // Java/C-style with access modifiers
    /\b(public|private|protected)\s+(static\s+)?(void|int|String|boolean|class|final)/i,

    // Function declarations (partial typing supported)
    /\bfunction\s+\w+/i,  // "function calculate" is enough
    /\bdef\s+\w+/i,       // Python "def calculate"

    // Variable declarations with assignment
    /\b(const|let|var)\s+\w+\s*=\s*(await\s+)?/i,  // "const user = await"

    // Import/export statements
    /\b(import|export)\s+/i,

    // Class/interface declarations
    /\b(class|interface)\s+\w+/i,

    // Common code symbols (multiple in sequence)
    /[{}\(\)\[\]]{2,}/,  // Multiple brackets
    /=>\s*{/,            // Arrow functions
    /\w+\.\w+\(/,        // Method calls like "user.getName("
  ];

  for (const pattern of strongPatterns) {
    if (pattern.test(text)) {
      console.log(`🔵 Strong CODE signal detected: ${pattern}`);
      return true;
    }
  }
  return false;
}

/**
 * Detect strong email patterns
 */
function hasStrongEmailSignal(text: string): boolean {
  const strongPatterns = [
    /^(Dear|Hi|Hello)\s+[A-Z]/,
    /Best\s+regards,?$/i,
    /Sincerely,?$/i,
    /(Thank\s+you|Thanks)\s+for\s+your/i,
    /I\s+hope\s+this\s+email\s+finds/i,
    /Please\s+let\s+me\s+know/i,
  ];

  for (const pattern of strongPatterns) {
    if (pattern.test(text)) {
      console.log(`📧 Strong EMAIL signal detected: ${pattern}`);
      return true;
    }
  }
  return false;
}

/**
 * Detect strong chat patterns
 */
function hasStrongChatSignal(text: string): boolean {
  const strongPatterns = [
    /^(hey|hi|yo|sup|what's up|wassup)\b/i,
    /\b(lol|lmao|omg|wtf|btw|tbh|imo)\b/i,
    /[\u{1F600}-\u{1F64F}]/u,  // Emojis
    /!{2,}|\?{2,}/,  // Multiple punctuation
  ];

  for (const pattern of strongPatterns) {
    if (pattern.test(text)) {
      console.log(`💬 Strong CHAT signal detected: ${pattern}`);
      return true;
    }
  }
  return false;
}

/**
 * Check if text ends with sentence boundary
 * Only allow context switches at natural breakpoints
 */
function isAtSentenceBoundary(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0) return true;

  // Check if text ends with sentence-ending punctuation
  const lastChar = trimmed[trimmed.length - 1];
  if (['.', '!', '?', '\n'].includes(lastChar)) {
    return true;
  }

  // Check if text ends with multiple spaces (indicates pause/break)
  if (text.endsWith('  ')) {
    return true;
  }

  return false;
}

/**
 * Calculate context score for recent text only (last 50 characters)
 * Gives more weight to what user is typing NOW vs. old text
 */
function getRecentTextContext(text: string): DetectionResult {
  // Focus on last sentence or last 100 chars (whichever is shorter)
  const sentences = text.split(/[.!?\n]+/).filter(s => s.trim().length > 0);
  const lastSentence = sentences[sentences.length - 1] || text;
  const recentText = text.length > 100 ? text.slice(-100) : text;

  // Use last sentence for scoring if it's substantial
  const analysisText = lastSentence.trim().length > 10 ? lastSentence : recentText;

  return detectContext(analysisText);
}

/**
 * Ignore code keywords when surrounded by natural language
 * Prevents false positives like "planning for dinner"
 */
function isCodeKeywordInNaturalContext(text: string, keyword: string): boolean {
  const lowerText = text.toLowerCase();
  const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
  const matches = lowerText.match(keywordRegex);

  if (!matches) return false;

  // Check if keyword appears in natural language phrases
  const naturalPhrases = [
    `for the`, `for you`, `for me`, `for dinner`, `for lunch`,
    `for a`, `for an`, `planning for`, `waiting for`, `looking for`,
    `while you`, `while i`, `while we`, `if you`, `if i`, `if we`,
    `what are you`, `how are you`, `where are you`
  ];

  for (const phrase of naturalPhrases) {
    if (lowerText.includes(phrase)) {
      return true; // It's natural language, not code
    }
  }

  return false;
}

/**
 * Detect context with previous context consideration
 * Adds hysteresis to prevent rapid context switching
 */
export function detectContextWithHistory(
  text: string,
  previousContext?: ContextType,
  switchThreshold: number = 0.65
): DetectionResult {
  // Get recent context (focus on what user is typing NOW)
  const recentResult = getRecentTextContext(text);

  // Also get full text context for comparison
  const fullResult = detectContext(text);

  // Weighted average: 70% recent, 30% full text
  const weightedResult: DetectionResult = {
    context: recentResult.context,
    confidence: recentResult.confidence * 0.7 + fullResult.confidence * 0.3,
    scores: {
      code: recentResult.scores.code * 0.7 + fullResult.scores.code * 0.3,
      email: recentResult.scores.email * 0.7 + fullResult.scores.email * 0.3,
      chat: recentResult.scores.chat * 0.7 + fullResult.scores.chat * 0.3
    }
  };

  // If no previous context, return weighted result
  if (!previousContext) {
    return weightedResult;
  }

  // STRONG SIGNAL OVERRIDE: If we detect strong patterns, allow immediate switch
  const hasStrongCode = hasStrongCodeSignal(text);
  const hasStrongEmail = hasStrongEmailSignal(text);
  const hasStrongChat = hasStrongChatSignal(text);

  if (hasStrongCode && weightedResult.context === 'code') {
    console.log(`✅ Strong CODE signal - immediate switch allowed`);
    lastSwitchTime = Date.now();
    lastSwitchContext = 'code';
    return {
      context: 'code',
      confidence: Math.max(weightedResult.confidence, 0.9), // Boost confidence
      scores: weightedResult.scores
    };
  }

  if (hasStrongEmail && weightedResult.context === 'email') {
    console.log(`✅ Strong EMAIL signal - immediate switch allowed`);
    lastSwitchTime = Date.now();
    lastSwitchContext = 'email';
    return {
      context: 'email',
      confidence: Math.max(weightedResult.confidence, 0.9),
      scores: weightedResult.scores
    };
  }

  if (hasStrongChat && weightedResult.context === 'chat') {
    console.log(`✅ Strong CHAT signal - immediate switch allowed`);
    lastSwitchTime = Date.now();
    lastSwitchContext = 'chat';
    return {
      context: 'chat',
      confidence: Math.max(weightedResult.confidence, 0.9),
      scores: weightedResult.scores
    };
  }

  // RULE 1: Cooldown period - don't switch if we just switched (reduced to 3 seconds)
  const now = Date.now();
  const timeSinceLastSwitch = now - lastSwitchTime;
  const COOLDOWN_MS = 3000; // Reduced from 8 to 3 seconds

  if (weightedResult.context !== previousContext && timeSinceLastSwitch < COOLDOWN_MS) {
    console.log(`⏸️ Context switch blocked: cooldown active (${Math.round((COOLDOWN_MS - timeSinceLastSwitch) / 1000)}s remaining)`);
    return {
      context: previousContext,
      confidence: weightedResult.confidence,
      scores: weightedResult.scores
    };
  }

  // RULE 2: Sentence boundary - don't switch mid-sentence unless confidence is high
  const atBoundary = isAtSentenceBoundary(text);
  if (weightedResult.context !== previousContext && !atBoundary) {
    // Lowered from 0.85 to 0.75 for mid-sentence
    const midSentenceThreshold = 0.75;
    if (weightedResult.confidence < midSentenceThreshold) {
      console.log(`⏸️ Context switch blocked: mid-sentence (confidence ${weightedResult.confidence.toFixed(2)} < ${midSentenceThreshold})`);
      return {
        context: previousContext,
        confidence: weightedResult.confidence,
        scores: weightedResult.scores
      };
    }
  }

  // RULE 3: Check for code keywords in natural language (only single keywords)
  if (weightedResult.context === 'code' && previousContext !== 'code') {
    const codeKeywords = ['for', 'while', 'if'];
    for (const keyword of codeKeywords) {
      if (isCodeKeywordInNaturalContext(text, keyword)) {
        console.log(`⏸️ Context switch blocked: "${keyword}" detected in natural language context`);
        return {
          context: previousContext,
          confidence: weightedResult.confidence,
          scores: weightedResult.scores
        };
      }
    }
  }

  // RULE 4: Standard hysteresis - require confidence to switch away from current context
  // Lowered thresholds
  const effectiveThreshold = atBoundary ? 0.55 : 0.65; // Lowered from 0.65/0.75
  if (weightedResult.context !== previousContext) {
    if (weightedResult.confidence < effectiveThreshold) {
      console.log(`⏸️ Context switch blocked: confidence ${weightedResult.confidence.toFixed(2)} < threshold ${effectiveThreshold}`);
      return {
        context: previousContext,
        confidence: weightedResult.confidence,
        scores: weightedResult.scores
      };
    }
  }

  // Allow the switch - update tracking
  if (weightedResult.context !== previousContext) {
    lastSwitchTime = now;
    lastSwitchContext = weightedResult.context;
    console.log(`✅ Context switch allowed: ${previousContext} → ${weightedResult.context} (confidence: ${weightedResult.confidence.toFixed(2)})`);
  }

  return weightedResult;
}
