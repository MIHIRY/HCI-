/**
 * Alternate Character Mappings
 * Phase 2: Long-press alternate characters for mobile keyboard
 */

export type AlternateKeyMap = Record<string, string[]>;

/**
 * Common alternate characters for letters (accented variants)
 */
export const LETTER_ALTERNATES: AlternateKeyMap = {
  // Vowels with accents
  'a': ['à', 'á', 'â', 'ä', 'æ', 'ã', 'å', 'ā'],
  'e': ['è', 'é', 'ê', 'ë', 'ē', 'ė', 'ę', '€'],
  'i': ['ì', 'í', 'î', 'ï', 'ī', 'į', 'ı'],
  'o': ['ò', 'ó', 'ô', 'ö', 'õ', 'ø', 'ō', 'œ'],
  'u': ['ù', 'ú', 'û', 'ü', 'ū', 'ų'],
  'y': ['ý', 'ÿ', 'ŷ'],

  // Consonants with variants
  'c': ['ç', 'ć', 'č', '¢'],
  'n': ['ñ', 'ń', 'ň'],
  's': ['ś', 'š', 'ş', 'ß', '$'],
  'z': ['ź', 'ž', 'ż'],
  'l': ['ł'],
  'd': ['đ'],
  't': ['þ'],
};

/**
 * Punctuation and symbol alternates
 * Context: code, email, chat
 */
export const PUNCTUATION_ALTERNATES: AlternateKeyMap = {
  // Period variants
  '.': ['...', ',', '?', '!', '·', '•'],

  // Comma variants
  ',': [';', ':', '...'],

  // Question and exclamation
  '?': ['¿', '‽'],
  '!': ['¡', '‼'],

  // Quotes
  "'": ['"', '`', '\u2018', '\u2019', '\u201A'],
  '"': ["'", '\u201C', '\u201D', '\u201E'],

  // Dash variants
  '-': ['–', '—', '_', '−'],
  '_': ['-', '–', '—'],

  // Slash variants
  '/': ['\\', '|', '÷'],
  '\\': ['/', '|'],

  // Parentheses and brackets
  '(': ['[', '{', '<', '⟨'],
  ')': [']', '}', '>', '⟩'],
  '[': ['(', '{', '<'],
  ']': [')', '}', '>'],
  '{': ['[', '(', '<'],
  '}': [']', ')', '>'],

  // Math and symbols
  '+': ['±', '×', '÷'],
  '=': ['≈', '≠', '≤', '≥'],
  '*': ['×', '•', '°', '†'],
  '&': ['§', '¶', '©', '®', '™'],
  '%': ['‰', '‱'],

  // Currency
  '$': ['€', '£', '¥', '¢', '₹', '₽'],

  // At sign variants (email context)
  '@': ['©', '®', '™'],

  // Hash/number
  '#': ['№', '♯'],
};

/**
 * Number alternates
 * Useful for code, math, and special contexts
 */
export const NUMBER_ALTERNATES: AlternateKeyMap = {
  '0': ['°', '⁰', '₀', '∅', 'Ø'],
  '1': ['¹', '₁', '①', '⅟', '½', '⅓', '¼'],
  '2': ['²', '₂', '②', '⅔', '½'],
  '3': ['³', '₃', '③', '¾', '⅓'],
  '4': ['⁴', '₄', '④', '¼'],
  '5': ['⁵', '₅', '⑤'],
  '6': ['⁶', '₆', '⑥'],
  '7': ['⁷', '₇', '⑦'],
  '8': ['⁸', '₈', '⑧', '∞'],
  '9': ['⁹', '₉', '⑨'],
};

/**
 * Code-specific alternates
 * For programming symbols
 */
export const CODE_ALTERNATES: AlternateKeyMap = {
  ';': [':', ','],
  ':': [';', '::'],
  '=': ['==', '===', '!=', '!==', '<=', '>=', '=>'],
  '>': ['>=', '=>', '>>'],
  '<': ['<=', '<<', '<>'],
  '|': ['||', '|>'],
  '&': ['&&', '&='],
  '+': ['++', '+='],
  '-': ['--', '-=', '->'],
  '*': ['**', '*='],
  '/': ['//', '/*', '*/'],
};

/**
 * Emoji alternates for chat context
 */
export const EMOJI_ALTERNATES: Record<string, string[]> = {
  '😊': ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆'],
  '❤': ['💙', '💚', '💛', '🧡', '💜', '🖤', '💕', '💖'],
  '👍': ['👎', '👌', '✌', '🤞', '🤟', '🤘', '👏', '🙌'],
};

/**
 * Get alternates for a key based on context
 */
export function getAlternatesForKey(
  key: string,
  context: 'code' | 'email' | 'chat'
): string[] | null {
  // Check letters first (common across all contexts)
  if (LETTER_ALTERNATES[key]) {
    return LETTER_ALTERNATES[key];
  }

  // Check numbers (common across all contexts)
  if (NUMBER_ALTERNATES[key]) {
    return NUMBER_ALTERNATES[key];
  }

  // Context-specific alternates
  if (context === 'code' && CODE_ALTERNATES[key]) {
    return CODE_ALTERNATES[key];
  }

  // General punctuation alternates
  if (PUNCTUATION_ALTERNATES[key]) {
    return PUNCTUATION_ALTERNATES[key];
  }

  // Emoji alternates for chat
  if (context === 'chat' && EMOJI_ALTERNATES[key]) {
    return EMOJI_ALTERNATES[key];
  }

  return null;
}

/**
 * Check if a key has alternates
 */
export function hasAlternates(key: string, context: 'code' | 'email' | 'chat'): boolean {
  return getAlternatesForKey(key, context) !== null;
}
