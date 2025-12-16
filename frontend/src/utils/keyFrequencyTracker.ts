/**
 * Key Frequency Tracker
 * Tracks which keys are pressed most frequently to optimize layout
 */

import type { ContextType } from '../types';

export interface KeyFrequency {
  key: string;
  count: number;
  frequency: number; // Normalized 0-1
  lastPressed: number; // Timestamp
  context: ContextType;
}

export interface FrequencyMap {
  [key: string]: KeyFrequency;
}

export interface ContextFrequencies {
  code: FrequencyMap;
  email: FrequencyMap;
  chat: FrequencyMap;
}

const STORAGE_KEY = 'contexttype_key_frequencies';
const DECAY_FACTOR = 0.95; // Slowly decay old frequencies

export class KeyFrequencyTracker {
  private frequencies: ContextFrequencies;
  private totalPresses: { [K in ContextType]: number };

  constructor() {
    this.frequencies = {
      code: {},
      email: {},
      chat: {}
    };

    this.totalPresses = {
      code: 0,
      email: 0,
      chat: 0
    };

    this.loadFromStorage();
  }

  /**
   * Record a key press
   */
  recordKeyPress(key: string, context: ContextType): void {
    const contextFreqs = this.frequencies[context];

    if (!contextFreqs[key]) {
      contextFreqs[key] = {
        key,
        count: 0,
        frequency: 0,
        lastPressed: Date.now(),
        context
      };
    }

    // Increment count
    contextFreqs[key].count++;
    contextFreqs[key].lastPressed = Date.now();

    // Increment total
    this.totalPresses[context]++;

    // Recalculate frequencies
    this.recalculateFrequencies(context);

    // Save to storage
    this.saveToStorage();
  }

  /**
   * Recalculate normalized frequencies for a context
   */
  private recalculateFrequencies(context: ContextType): void {
    const contextFreqs = this.frequencies[context];
    const total = this.totalPresses[context];

    if (total === 0) return;

    // Calculate frequencies (normalized 0-1)
    Object.values(contextFreqs).forEach(keyFreq => {
      keyFreq.frequency = keyFreq.count / total;
    });
  }

  /**
   * Get frequency for a specific key in a context
   */
  getKeyFrequency(key: string, context: ContextType): number {
    const keyFreq = this.frequencies[context][key];
    return keyFreq ? keyFreq.frequency : 0;
  }

  /**
   * Get all key frequencies for a context
   */
  getContextFrequencies(context: ContextType): KeyFrequency[] {
    return Object.values(this.frequencies[context]).sort(
      (a, b) => b.frequency - a.frequency
    );
  }

  /**
   * Get top N most frequent keys for a context
   */
  getTopKeys(context: ContextType, n: number = 10): KeyFrequency[] {
    return this.getContextFrequencies(context).slice(0, n);
  }

  /**
   * Apply time decay to frequencies
   * Older key presses become less important over time
   */
  applyDecay(): void {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    Object.keys(this.frequencies).forEach(contextKey => {
      const context = contextKey as ContextType;
      const contextFreqs = this.frequencies[context];

      Object.values(contextFreqs).forEach(keyFreq => {
        const daysSincePress = (now - keyFreq.lastPressed) / oneDay;

        // Apply exponential decay
        if (daysSincePress > 0) {
          const decayMultiplier = Math.pow(DECAY_FACTOR, daysSincePress);
          keyFreq.count *= decayMultiplier;
        }
      });

      this.recalculateFrequencies(context);
    });

    this.saveToStorage();
  }

  /**
   * Get heatmap data for visualization
   */
  getHeatmapData(context: ContextType): Array<{ key: string; intensity: number }> {
    const freqs = this.getContextFrequencies(context);

    if (freqs.length === 0) return [];

    // Find max frequency for normalization
    const maxFreq = Math.max(...freqs.map(f => f.frequency));

    return freqs.map(keyFreq => ({
      key: keyFreq.key,
      intensity: maxFreq > 0 ? keyFreq.frequency / maxFreq : 0
    }));
  }

  /**
   * Reset frequencies for a context
   */
  resetContext(context: ContextType): void {
    this.frequencies[context] = {};
    this.totalPresses[context] = 0;
    this.saveToStorage();
  }

  /**
   * Reset all frequencies
   */
  resetAll(): void {
    this.frequencies = {
      code: {},
      email: {},
      chat: {}
    };

    this.totalPresses = {
      code: 0,
      email: 0,
      chat: 0
    };

    this.saveToStorage();
  }

  /**
   * Get statistics for a context
   */
  getStats(context: ContextType): {
    totalKeys: number;
    totalPresses: number;
    avgPressesPerKey: number;
    mostFrequentKey: KeyFrequency | null;
  } {
    const contextFreqs = this.frequencies[context];
    const keys = Object.values(contextFreqs);

    const totalKeys = keys.length;
    const totalPresses = this.totalPresses[context];
    const avgPressesPerKey = totalKeys > 0 ? totalPresses / totalKeys : 0;

    const mostFrequentKey = keys.length > 0
      ? keys.reduce((max, key) => key.frequency > max.frequency ? key : max)
      : null;

    return {
      totalKeys,
      totalPresses,
      avgPressesPerKey,
      mostFrequentKey
    };
  }

  /**
   * Export data for analysis
   */
  exportData(): ContextFrequencies {
    return JSON.parse(JSON.stringify(this.frequencies));
  }

  /**
   * Import data
   */
  importData(data: ContextFrequencies): void {
    this.frequencies = data;

    // Recalculate totals
    Object.keys(this.frequencies).forEach(contextKey => {
      const context = contextKey as ContextType;
      const total = Object.values(this.frequencies[context])
        .reduce((sum, keyFreq) => sum + keyFreq.count, 0);
      this.totalPresses[context] = total;
    });

    this.saveToStorage();
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        frequencies: this.frequencies,
        totalPresses: this.totalPresses,
        lastUpdated: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save key frequencies:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.frequencies = data.frequencies || this.frequencies;
        this.totalPresses = data.totalPresses || this.totalPresses;
      }
    } catch (error) {
      console.error('Failed to load key frequencies:', error);
    }
  }

  /**
   * Get aggregated frequencies across all contexts
   */
  getGlobalFrequencies(): FrequencyMap {
    const global: FrequencyMap = {};

    Object.values(this.frequencies).forEach(contextFreqs => {
      Object.entries(contextFreqs).forEach(([key, keyFreq]) => {
        const freq = keyFreq as KeyFrequency;
        if (!global[key]) {
          global[key] = {
            key,
            count: 0,
            frequency: 0,
            lastPressed: freq.lastPressed,
            context: freq.context
          };
        }

        global[key].count += freq.count;
        global[key].lastPressed = Math.max(
          global[key].lastPressed,
          freq.lastPressed
        );
      });
    });

    // Calculate global frequencies
    const totalCount = Object.values(global).reduce((sum, kf) => sum + kf.count, 0);
    Object.values(global).forEach(keyFreq => {
      keyFreq.frequency = totalCount > 0 ? keyFreq.count / totalCount : 0;
    });

    return global;
  }
}

// Singleton instance
export const keyFrequencyTracker = new KeyFrequencyTracker();

// Apply decay periodically (every hour)
if (typeof window !== 'undefined') {
  setInterval(() => {
    keyFrequencyTracker.applyDecay();
  }, 60 * 60 * 1000);
}
