/**
 * useSuggestions Hook
 * Phase 3: Smart suggestion fetching with commit-signal triggers and minimum-change gate
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchSuggestions } from '../services/suggestionService';
import type { ContextType } from '../types';
import type { Suggestion } from '../components/SuggestionStrip';

interface UseSuggestionsOptions {
  text: string;
  context: ContextType;
  enabled?: boolean;
  debounceMs?: number;
  maxSuggestions?: number;
}

interface UseSuggestionsResult {
  suggestions: Suggestion[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

// Commit signals - characters that indicate user finished a thought unit
const COMMIT_SIGNALS = {
  WORD_COMMITTED: ' ',           // Space - word finished
  PUNCTUATION: ['.', ',', '?', '!', ';', ':'], // Punctuation
  NEWLINE: '\n',                 // Enter
};

// Gate rules to prevent excessive API calls
const GATE_RULES = {
  MIN_CHARS_SINCE_LAST: 3,       // Don't call if < 3 chars typed since last request (REDUCED)
  MIN_CURRENT_WORD_LENGTH: 2,    // Don't call if current word < 2 chars (REDUCED)
  PAUSE_THRESHOLD_MS: 350,       // Optional pause-based trigger (250-400ms)
  CACHE_SIMILARITY_THRESHOLD: 10, // Cache if context is similar (within 10 chars) (INCREASED)
};

/**
 * Hook for fetching and managing suggestions
 */
export function useSuggestions(options: UseSuggestionsOptions): UseSuggestionsResult {
  const {
    text,
    context,
    enabled = true,
    debounceMs = 500,
    maxSuggestions = 5,
  } = options;

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousTextRef = useRef<string>('');
  const lastRequestTextRef = useRef<string>(''); // Track text at last API call
  const lastRequestTimeRef = useRef<number>(0);  // Track when last request was made
  const cacheRef = useRef<Map<string, Suggestion[]>>(new Map());

  /**
   * Get current word being typed
   */
  const getCurrentWord = useCallback((txt: string): string => {
    const words = txt.split(/\s+/);
    return words[words.length - 1] || '';
  }, []);

  /**
   * Check if minimum-change gate passes
   */
  const passesGateRules = useCallback((txt: string): boolean => {
    // Rule 1: Don't call if less than MIN_CHARS_SINCE_LAST typed
    const charsSinceLastRequest = txt.length - lastRequestTextRef.current.length;
    if (Math.abs(charsSinceLastRequest) < GATE_RULES.MIN_CHARS_SINCE_LAST) {
      console.log(`⛔ Gate: Only ${charsSinceLastRequest} chars since last request (need ${GATE_RULES.MIN_CHARS_SINCE_LAST})`);
      return false;
    }

    // Rule 2: Don't call if current word is too short
    const currentWord = getCurrentWord(txt);
    if (currentWord.length > 0 && currentWord.length < GATE_RULES.MIN_CURRENT_WORD_LENGTH) {
      console.log(`⛔ Gate: Current word "${currentWord}" too short (need ${GATE_RULES.MIN_CURRENT_WORD_LENGTH} chars)`);
      return false;
    }

    // Rule 3: Check cache similarity - avoid redundant calls
    const similarity = Math.abs(txt.length - lastRequestTextRef.current.length);
    if (similarity < GATE_RULES.CACHE_SIMILARITY_THRESHOLD && cacheRef.current.has(`${context}:${lastRequestTextRef.current}`)) {
      console.log(`⛔ Gate: Context too similar to cached (${similarity} chars diff)`);
      return false;
    }

    return true;
  }, [context, getCurrentWord]);

  /**
   * Check if last character is a commit signal
   */
  const isCommitSignal = useCallback((txt: string, prevText: string): boolean => {
    if (!txt || txt === prevText) return false;

    const lastChar = txt[txt.length - 1];

    // Space = word committed
    if (lastChar === COMMIT_SIGNALS.WORD_COMMITTED) {
      console.log('✓ Commit signal: SPACE (word committed)');
      return true;
    }

    // Newline = enter pressed
    if (lastChar === COMMIT_SIGNALS.NEWLINE) {
      console.log('✓ Commit signal: ENTER');
      return true;
    }

    // Punctuation
    if (COMMIT_SIGNALS.PUNCTUATION.includes(lastChar)) {
      console.log(`✓ Commit signal: PUNCTUATION (${lastChar})`);
      return true;
    }

    return false;
  }, []);

  /**
   * Fetch suggestions from API
   */
  const fetchSuggestionsData = useCallback(async (bypassGate: boolean = false) => {
    console.log('\n🔄 fetchSuggestionsData called');
    console.log('   Text:', text);
    console.log('   Context:', context);
    console.log('   Bypass gate:', bypassGate);

    if (!enabled || !text || text.trim().length === 0) {
      console.log('   ❌ Skipped: Empty or disabled');
      setSuggestions([]);
      return;
    }

    // Apply gate rules unless bypassed
    if (!bypassGate && !passesGateRules(text)) {
      console.log('   ❌ BLOCKED BY GATE RULES');
      return;
    }

    // Check cache first (use context window for caching)
    const cacheKey = `${context}:${text}`;
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        console.log('   ✓ Cache hit - using cached suggestions');
        setSuggestions(cached);
        return;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    console.log('   ✅ CALLING API NOW...');
    setIsLoading(true);
    setError(null);

    // Track request
    lastRequestTextRef.current = text;
    lastRequestTimeRef.current = Date.now();

    try {
      const data = await fetchSuggestions(text, context, maxSuggestions);
      setSuggestions(data);

      // Cache the result
      cacheRef.current.set(cacheKey, data);

      // Limit cache size
      if (cacheRef.current.size > 50) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch suggestions'));
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [text, context, enabled, maxSuggestions, passesGateRules]);

  /**
   * Main effect: Trigger suggestion fetching based on commit signals
   */
  useEffect(() => {
    if (!enabled) {
      setSuggestions([]);
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if text changed
    if (text === previousTextRef.current) {
      return;
    }

    const prevText = previousTextRef.current;
    previousTextRef.current = text;

    // HIGH-CONFIDENCE TRIGGER: Commit signal detected
    if (isCommitSignal(text, prevText)) {
      console.log('⚡ Commit signal detected - fetching immediately');
      fetchSuggestionsData(false); // Apply gate rules
    }
    // OPTIONAL TRIGGER: Pause-based (350ms)
    else {
      console.log(`⏳ Pause trigger - waiting ${GATE_RULES.PAUSE_THRESHOLD_MS}ms`);
      timeoutRef.current = setTimeout(() => {
        console.log('⏱️ Pause threshold reached - checking gates');
        fetchSuggestionsData(false); // Apply gate rules
      }, GATE_RULES.PAUSE_THRESHOLD_MS);
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, enabled, fetchSuggestionsData, isCommitSignal]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Manual refresh
   */
  const refresh = useCallback(() => {
    fetchSuggestionsData(true);
  }, [fetchSuggestionsData]);

  return {
    suggestions,
    isLoading,
    error,
    refresh,
  };
}
