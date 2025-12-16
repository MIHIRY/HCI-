/**
 * Mobile Layout Configuration
 * Phase 1: Mobile-First Layout Foundation
 *
 * This file contains all configuration constants for mobile keyboard layouts
 */

import type { ContextType } from '../types';

// ============================================
// Phase 1 Key Size Constraints - COMPACT MODE
// ============================================
export const KEY_SIZE_CONSTRAINTS = {
  MIN_SIZE: 28,  // Compact mobile keyboard (Google Gboard style)
  MAX_SIZE: 50,  // Maximum size for visual balance
  BASE_SIZE: 35, // Default key size for mobile (realistic)
} as const;

// ============================================
// Grid Configuration - COMPACT MODE
// ============================================
export const GRID_CONFIG = {
  COLUMNS_MOBILE_PORTRAIT: 10,   // 10 columns in portrait mode
  COLUMNS_MOBILE_LANDSCAPE: 12,  // 12 columns in landscape mode
  COLUMNS_TABLET: 12,             // 12 columns on tablets
  GAP: 2,                         // Compact gap like Google Gboard (2px)
  ROW_HEIGHT_VH: 6,              // Compact row height
} as const;

// ============================================
// Fitts' Law Mobile Configuration - COMPACT MODE
// ============================================
export const FITTS_LAW_MOBILE = {
  // Very subtle personalization for compact keyboard
  MIN_BOOST_PERCENT: 0,    // 0% boost for rare keys
  MAX_BOOST_PERCENT: 10,   // Max 10% size boost (very subtle for compact)

  // Frequency thresholds
  FREQ_THRESHOLD_LOW: 0.05,   // Below this = no boost
  FREQ_THRESHOLD_HIGH: 0.25,  // Above this = max boost

  // Grid constraints
  KEEP_GRID_BASED: true,      // Always maintain grid alignment
  ALLOW_POSITION_SHIFT: false, // Don't move keys around (Phase 1)
} as const;

// ============================================
// Mobile Keyboard Layouts (Standard)
// ============================================

/**
 * Letter keyboard layout (like real phone keyboards)
 */
export const LETTER_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
] as const;

/**
 * Context-specific symbol/number layouts
 */
export const NUMBER_SYMBOL_ROWS: Record<ContextType, readonly string[][]> = {
  code: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['(', ')', '{', '}', '[', ']', '<', '>'],
    ['=', '+', '-', '*', '/', '&', '|', ';'],
    [':', '.', ',', '!', '?', '@', '#', '$'],
  ],
  email: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['@', '.', '-', '_', '/', ':', ';', '!', '?'],
    [',', '(', ')', '&', '+', '=', '#', '$'],
  ],
  chat: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['😊', '😂', '❤️', '👍', '🔥', '😎', '🎉', '💯'],
    ['!', '?', '.', ',', '-', '_', '/', '@'],
  ],
} as const;

/**
 * Special keys (always present)
 */
export const SPECIAL_KEYS = {
  SPACE: '␣',
  BACKSPACE: '⌫',
  ENTER: '↵',
  SHIFT: '⇧',
  MODE_SWITCH_TO_NUM: '123',
  MODE_SWITCH_TO_ABC: 'ABC',
} as const;

// ============================================
// Context Theme Colors
// ============================================
export const CONTEXT_COLORS: Record<ContextType, {
  base: string;
  hover: string;
  active: string;
  text: string;
}> = {
  code: {
    base: '#3b82f6',    // Blue
    hover: '#2563eb',
    active: '#1d4ed8',
    text: '#ffffff',
  },
  email: {
    base: '#6b7280',    // Gray
    hover: '#4b5563',
    active: '#374151',
    text: '#ffffff',
  },
  chat: {
    base: '#8b5cf6',    // Purple
    hover: '#7c3aed',
    active: '#6d28d9',
    text: '#ffffff',
  },
} as const;

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate key size with gentle Fitts' Law boost
 */
export function calculateKeySize(
  baseSize: number,
  frequency: number
): { width: number; height: number } {
  const { MIN_SIZE, MAX_SIZE } = KEY_SIZE_CONSTRAINTS;
  const { MIN_BOOST_PERCENT, MAX_BOOST_PERCENT, FREQ_THRESHOLD_LOW, FREQ_THRESHOLD_HIGH } = FITTS_LAW_MOBILE;

  // No boost for low-frequency keys
  if (frequency < FREQ_THRESHOLD_LOW) {
    return {
      width: Math.max(MIN_SIZE, Math.min(MAX_SIZE, baseSize)),
      height: Math.max(MIN_SIZE, Math.min(MAX_SIZE, baseSize)),
    };
  }

  // Calculate boost percentage based on frequency
  const normalizedFreq = Math.min(1, (frequency - FREQ_THRESHOLD_LOW) / (FREQ_THRESHOLD_HIGH - FREQ_THRESHOLD_LOW));
  const boostPercent = MIN_BOOST_PERCENT + (normalizedFreq * (MAX_BOOST_PERCENT - MIN_BOOST_PERCENT));

  // Apply boost
  const boostedSize = baseSize * (1 + boostPercent / 100);

  // Constrain to min/max
  const finalSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, boostedSize));

  return {
    width: finalSize,
    height: finalSize,
  };
}

/**
 * Get grid position for key (row, column)
 */
export function getGridPosition(
  rowIndex: number,
  colIndex: number,
  _columns: number,
  gap: number,
  keyWidth: number,
  keyHeight: number
): { x: number; y: number } {
  // Calculate position in grid
  const x = colIndex * (keyWidth + gap) + gap;
  const y = rowIndex * (keyHeight + gap) + gap;

  return { x, y };
}

/**
 * Get color based on frequency (for visual feedback)
 */
export function getKeyColorWithFrequency(
  context: ContextType,
  frequency: number
): string {
  const colors = CONTEXT_COLORS[context];

  // Slightly brighten high-frequency keys
  if (frequency > 0.2) {
    return colors.hover;
  } else if (frequency > 0.1) {
    return colors.base;
  } else {
    // Dim low-frequency keys slightly
    return colors.base + 'cc'; // Add alpha for dimming
  }
}
