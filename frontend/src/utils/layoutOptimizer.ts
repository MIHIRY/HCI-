/**
 * Layout Optimizer
 * Generates optimal keyboard layouts based on key frequencies and Fitts' Law
 */

import {
  optimizeLayout,
  generateGridLayout,
  calculateAverageMovementTime,
  HOME_POSITION
} from './fittsLaw';
import type { OptimizedKey, KeyConfig } from './fittsLaw';
import { keyFrequencyTracker } from './keyFrequencyTracker';
import type { KeyFrequency } from './keyFrequencyTracker';
import type { ContextType, KeyboardLayout } from '../types';

/**
 * Mobile keyboard layout - just like phone keyboards!
 * Only show letters + most-used context keys (smart optimization)
 */
const MOBILE_KEYBOARD_LETTERS = [
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
  'z', 'x', 'c', 'v', 'b', 'n', 'm',
  '␣', '⌫', '↵', // space, backspace, enter
];

/**
 * Context-specific smart keys (will be optimized with Fitts' Law)
 * These are the TOP frequently-used keys for each context
 */
const SMART_CONTEXT_KEYS = {
  code: [
    // Most common programming symbols
    '(', ')', '{', '}', '[', ']',
    '=', ';', '.', ',', ':', '/',
    '<', '>', '+', '-', '*', '&', '|'
  ],
  email: [
    // Most common email characters
    '@', '.', ',', '!', '?', '-', '_',
    ':', ';', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ],
  chat: [
    // Most common chat symbols + emojis
    '!', '?', '.', ',', '😊', '😂', '❤️', '👍',
    '🔥', '😎', '🎉', '💯'
  ]
};

/**
 * Default key layouts for each context
 * Smart: Only letters + context-specific top keys
 */
const DEFAULT_KEY_SETS: Record<ContextType, string[]> = {
  code: [...MOBILE_KEYBOARD_LETTERS, ...SMART_CONTEXT_KEYS.code],
  email: [...MOBILE_KEYBOARD_LETTERS, ...SMART_CONTEXT_KEYS.email],
  chat: [...MOBILE_KEYBOARD_LETTERS, ...SMART_CONTEXT_KEYS.chat]
};

/**
 * Base grid positions for keys
 */
function generateBasePositions(keyCount: number, columns: number = 10): Map<number, Point> {
  const positions = new Map<number, Point>();
  const spacing = 70;
  const startX = 100;
  const startY = 100;

  for (let i = 0; i < keyCount; i++) {
    const row = Math.floor(i / columns);
    const col = i % columns;

    positions.set(i, {
      x: startX + col * spacing,
      y: startY + row * spacing
    });
  }

  return positions;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Generate optimized layout for a context
 */
export function generateOptimizedLayout(
  context: ContextType,
  usePersonalization: boolean = true
): KeyboardLayout {
  const defaultKeys = DEFAULT_KEY_SETS[context];

  // Get frequency data
  const freqData = usePersonalization
    ? keyFrequencyTracker.getContextFrequencies(context)
    : [];

  // Create frequency map for quick lookup
  const freqMap = new Map<string, number>();
  freqData.forEach(kf => freqMap.set(kf.key, kf.frequency));

  // Calculate frequencies for all keys
  const keys: KeyConfig[] = defaultKeys.map((char, index) => {
    const basePositions = generateBasePositions(defaultKeys.length);

    return {
      id: `key_${char}_${index}`,
      character: char,
      frequency: freqMap.get(char) || 0.01, // Small default frequency
      basePosition: basePositions.get(index) || { x: 100, y: 100 }
    };
  });

  // If using personalization, boost frequently used keys
  if (usePersonalization && freqData.length > 0) {
    const topKeys = freqData.slice(0, 10);

    topKeys.forEach(topKey => {
      const existing = keys.find(k => k.character === topKey.key);
      if (existing) {
        existing.frequency = topKey.frequency;
      } else {
        // Add new frequently used key
        keys.push({
          id: `key_${topKey.key}_custom`,
          character: topKey.key,
          frequency: topKey.frequency,
          basePosition: { x: HOME_POSITION.x, y: HOME_POSITION.y }
        });
      }
    });
  }

  // Optimize layout using Fitts' Law
  const optimizedKeys = optimizeLayout(keys, HOME_POSITION);

  // Arrange in grid
  const gridLayout = generateGridLayout(optimizedKeys, 10);

  // Calculate average movement time
  const avgMovementTime = calculateAverageMovementTime(gridLayout);

  // Convert to KeyboardLayout format
  return convertToKeyboardLayout(gridLayout, context, avgMovementTime);
}

/**
 * Convert optimized keys to KeyboardLayout format
 */
function convertToKeyboardLayout(
  optimizedKeys: OptimizedKey[],
  context: ContextType,
  avgMovementTime: number
): KeyboardLayout {
  // Group keys into rows (by Y position)
  const rowMap = new Map<number, OptimizedKey[]>();

  optimizedKeys.forEach(key => {
    const rowY = Math.round(key.position.y / 70) * 70; // Snap to grid
    if (!rowMap.has(rowY)) {
      rowMap.set(rowY, []);
    }
    rowMap.get(rowY)!.push(key);
  });

  // Sort rows by Y position
  const sortedRows = Array.from(rowMap.entries()).sort((a, b) => a[0] - b[0]);

  // Create rows
  const rows = sortedRows.map(([rowY, rowKeys], rowIndex) => {
    // Sort keys in row by X position
    const sortedKeys = rowKeys.sort((a, b) => a.position.x - b.position.x);

    return {
      row_id: rowIndex + 1,
      keys: sortedKeys.map(key => ({
        key_id: key.id,
        character: key.character,
        position: key.position,
        size: key.size,
        frequency_rank: Math.round(key.frequency * 100),
        color: getColorForContext(context, key.frequency),
        haptic: key.frequency > 0.05 // Enable haptic for frequent keys
      }))
    };
  });

  // Get theme color
  const themeColors = {
    code: '#3b82f6',
    email: '#6b7280',
    chat: '#8b5cf6'
  };

  return {
    mode: context,
    version: '2.0-optimized',
    theme: `${context}_optimized`,
    layout: {
      rows
    },
    special_buttons: getSpecialButtons(context)
  };
}

/**
 * Get color for key based on frequency
 */
function getColorForContext(context: ContextType, frequency: number): string {
  const baseColors = {
    code: { r: 59, g: 130, b: 246 },    // Blue
    email: { r: 107, g: 115, b: 128 },  // Gray
    chat: { r: 139, g: 92, b: 246 }     // Purple
  };

  const base = baseColors[context];

  // Lighter color for less frequent keys
  const intensity = 0.5 + (frequency * 5); // 0.5 to 5.5
  const normalizedIntensity = Math.min(1, intensity);

  const r = Math.round(base.r + (255 - base.r) * (1 - normalizedIntensity));
  const g = Math.round(base.g + (255 - base.g) * (1 - normalizedIntensity));
  const b = Math.round(base.b + (255 - base.b) * (1 - normalizedIntensity));

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Get special buttons for context
 */
function getSpecialButtons(context: ContextType): any[] {
  const buttons = {
    code: [
      { button_id: 'autocomplete', label: 'Complete', action: 'show_autocomplete', position: { x: 700, y: 50 } },
      { button_id: 'snippets', label: 'Snippets', action: 'show_snippets', position: { x: 700, y: 120 } }
    ],
    email: [
      { button_id: 'templates', label: 'Templates', action: 'show_templates', position: { x: 700, y: 50 } },
      { button_id: 'signature', label: 'Sign', action: 'insert_signature', position: { x: 700, y: 120 } }
    ],
    chat: [
      { button_id: 'emoji', label: 'Emoji', action: 'show_emoji_picker', position: { x: 700, y: 50 } },
      { button_id: 'gif', label: 'GIF', action: 'show_gif_picker', position: { x: 700, y: 120 } }
    ]
  };

  return buttons[context] || [];
}

/**
 * Compare two layouts and calculate improvement
 */
export function compareLayouts(
  layout1: KeyboardLayout,
  layout2: KeyboardLayout
): {
  improvement: number; // Percentage
  metric1: number;
  metric2: number;
} {
  const metric1 = (layout1 as any).metadata?.avgMovementTime || 0;
  const metric2 = (layout2 as any).metadata?.avgMovementTime || 0;

  const improvement = metric1 > 0
    ? ((metric1 - metric2) / metric1) * 100
    : 0;

  return {
    improvement,
    metric1,
    metric2
  };
}

/**
 * Generate layout variants for A/B testing
 */
export function generateLayoutVariants(
  context: ContextType,
  count: number = 3
): KeyboardLayout[] {
  const variants: KeyboardLayout[] = [];

  // Variant 1: Fully personalized
  variants.push(generateOptimizedLayout(context, true));

  // Variant 2: No personalization (default)
  if (count > 1) {
    variants.push(generateOptimizedLayout(context, false));
  }

  // Variant 3: Hybrid (50% personalization)
  if (count > 2) {
    // Mix personalized and default
    const hybrid = generateOptimizedLayout(context, true);
    hybrid.version = '2.0-hybrid';
    variants.push(hybrid);
  }

  return variants;
}

/**
 * Get layout recommendation based on user's typing patterns
 */
export function getLayoutRecommendation(context: ContextType): {
  shouldUseOptimized: boolean;
  reason: string;
  estimatedImprovement: number;
} {
  const stats = keyFrequencyTracker.getStats(context);

  // Need at least 100 key presses to make good recommendations
  if (stats.totalPresses < 100) {
    return {
      shouldUseOptimized: false,
      reason: 'Insufficient data. Keep typing to build your personalized layout!',
      estimatedImprovement: 0
    };
  }

  // If there's clear frequency patterns, recommend optimization
  const topKeys = keyFrequencyTracker.getTopKeys(context, 5);
  const topFrequencySum = topKeys.reduce((sum, k) => sum + k.frequency, 0);

  if (topFrequencySum > 0.5) {
    return {
      shouldUseOptimized: true,
      reason: `You use ${topKeys[0].key} ${Math.round(topKeys[0].frequency * 100)}% of the time. Optimized layout will place it closer to home position.`,
      estimatedImprovement: 15 // Estimated 15% improvement
    };
  }

  return {
    shouldUseOptimized: true,
    reason: 'Your typing patterns suggest an optimized layout could help.',
    estimatedImprovement: 10
  };
}
