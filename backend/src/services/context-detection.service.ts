import { v4 as uuidv4 } from 'uuid';

export interface ContextDetectionResult {
  context: 'code' | 'email' | 'chat';
  confidence: number;
  detectionId: string;
  alternativeContexts: Array<{
    context: string;
    confidence: number;
  }>;
}

export class ContextDetectionService {
  // Rule-based keyword patterns from documentation
  private readonly CODE_KEYWORDS = [
    'function', 'class', 'def', 'const', 'let', 'var', 'import', 'return',
    'if', 'else', 'while', 'for', 'async', 'await', 'export', 'interface',
    'type', 'enum', 'public', 'private', 'protected', 'void'
  ];

  private readonly CODE_SYMBOLS = [
    '{', '}', '[', ']', '(', ')', '=>', '===', '!==', '++;', '//', '/*', '*/',
    ';', ':', '&&', '||'
  ];

  private readonly EMAIL_KEYWORDS = [
    'dear', 'sincerely', 'regards', 'best regards', 'thank you', 'thanks',
    'please find attached', 'subject:', 'to:', 'from:', 'cc:', 'bcc:',
    'furthermore', 'regarding', 'utilize', 'attached', 'meeting'
  ];

  private readonly EMAIL_PHRASES = [
    'i hope this email finds you',
    'thank you for',
    'please let me know',
    'looking forward',
    'i would like to',
    'could you please'
  ];

  private readonly CHAT_KEYWORDS = [
    'lol', 'omg', 'btw', 'brb', 'tbh', 'ngl', 'idk', 'imo', 'imho',
    'gonna', 'wanna', 'kinda', 'sorta', 'yeah', 'yep', 'nope',
    'sup', 'hey', 'haha', 'hehe'
  ];

  private readonly EMOJI_PATTERN = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  /**
   * Main detection method - implements hybrid rule-based approach
   */
  public detect(text: string, previousContext?: string): ContextDetectionResult {
    const textLower = text.toLowerCase();
    const tokens = this.tokenize(textLower);

    // Calculate scores for each context
    const codeScore = this.calculateCodeScore(text, textLower, tokens);
    const emailScore = this.calculateEmailScore(text, textLower, tokens);
    const chatScore = this.calculateChatScore(text, textLower, tokens);

    // Normalize scores
    const total = codeScore + emailScore + chatScore;
    const normalizedScores = {
      code: total > 0 ? codeScore / total : 0.33,
      email: total > 0 ? emailScore / total : 0.33,
      chat: total > 0 ? chatScore / total : 0.33
    };

    // Find highest score
    const scores = [
      { context: 'code' as const, confidence: normalizedScores.code },
      { context: 'email' as const, confidence: normalizedScores.email },
      { context: 'chat' as const, confidence: normalizedScores.chat }
    ];

    scores.sort((a, b) => b.confidence - a.confidence);

    let detectedContext = scores[0].context;
    let confidence = scores[0].confidence;

    // Apply smoothing: if confidence is low and we have previous context, maintain it
    if (confidence < 0.6 && previousContext) {
      detectedContext = previousContext as 'code' | 'email' | 'chat';
      confidence = 0.5; // Indicate low confidence but maintained context
    }

    return {
      context: detectedContext,
      confidence: Math.round(confidence * 100) / 100,
      detectionId: uuidv4(),
      alternativeContexts: scores.slice(1).map(s => ({
        context: s.context,
        confidence: Math.round(s.confidence * 100) / 100
      }))
    };
  }

  /**
   * Calculate code context score
   */
  private calculateCodeScore(originalText: string, lowerText: string, tokens: string[]): number {
    let score = 0;

    // Check for code keywords
    this.CODE_KEYWORDS.forEach(keyword => {
      const pattern = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = originalText.match(pattern);
      if (matches) {
        score += matches.length * 3; // Weight: 3 per keyword
      }
    });

    // Check for code symbols
    this.CODE_SYMBOLS.forEach(symbol => {
      const count = (originalText.match(new RegExp('\\' + symbol.split('').join('\\'), 'g')) || []).length;
      score += count * 2; // Weight: 2 per symbol
    });

    // Check for camelCase
    const camelCasePattern = /\b[a-z]+[A-Z][a-zA-Z]*\b/g;
    const camelCaseMatches = originalText.match(camelCasePattern);
    if (camelCaseMatches) {
      score += camelCaseMatches.length * 2;
    }

    // Check for snake_case
    const snakeCasePattern = /\b[a-z]+_[a-z_]+\b/g;
    const snakeCaseMatches = originalText.match(snakeCasePattern);
    if (snakeCaseMatches) {
      score += snakeCaseMatches.length * 2;
    }

    return score;
  }

  /**
   * Calculate email context score
   */
  private calculateEmailScore(originalText: string, lowerText: string, tokens: string[]): number {
    let score = 0;

    // Check for email keywords
    this.EMAIL_KEYWORDS.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 4; // Weight: 4 per keyword (formal language is strong indicator)
      }
    });

    // Check for email phrases
    this.EMAIL_PHRASES.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        score += 5; // Weight: 5 per phrase
      }
    });

    // Check for formal punctuation (commas, periods)
    const commas = (originalText.match(/,/g) || []).length;
    const periods = (originalText.match(/\./g) || []).length;
    score += (commas + periods) * 0.5;

    // Check for proper capitalization (sentences starting with capital letters)
    const sentences = originalText.split(/[.!?]+/);
    let properCapitalization = 0;
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.length > 0 && trimmed[0] === trimmed[0].toUpperCase()) {
        properCapitalization++;
      }
    });
    score += properCapitalization * 1.5;

    return score;
  }

  /**
   * Calculate chat context score
   */
  private calculateChatScore(originalText: string, lowerText: string, tokens: string[]): number {
    let score = 0;

    // Check for chat keywords/slang
    this.CHAT_KEYWORDS.forEach(keyword => {
      const pattern = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(pattern);
      if (matches) {
        score += matches.length * 5; // Weight: 5 per slang term (strong indicator)
      }
    });

    // Check for emojis
    const emojiMatches = originalText.match(new RegExp(this.EMOJI_PATTERN, 'gu'));
    if (emojiMatches) {
      score += emojiMatches.length * 6; // Weight: 6 per emoji (very strong indicator)
    }

    // Check for repeated punctuation (!!!, ???, ...)
    const repeatedPunctuation = originalText.match(/[!?]{2,}|\.{3,}/g);
    if (repeatedPunctuation) {
      score += repeatedPunctuation.length * 3;
    }

    // Check for ALL CAPS words
    const allCapsWords = originalText.match(/\b[A-Z]{2,}\b/g);
    if (allCapsWords) {
      score += allCapsWords.length * 2;
    }

    // Check for informal contractions
    const contractions = ['gonna', 'wanna', 'kinda', 'sorta', 'gotta', 'lemme'];
    contractions.forEach(contraction => {
      if (lowerText.includes(contraction)) {
        score += 4;
      }
    });

    // Lack of proper punctuation (informal)
    const hasMinimalPunctuation = (originalText.match(/[,.;:]/g) || []).length < 2;
    if (hasMinimalPunctuation && originalText.length > 30) {
      score += 2;
    }

    return score;
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .split(/\s+/)
      .filter(token => token.length > 0);
  }
}
