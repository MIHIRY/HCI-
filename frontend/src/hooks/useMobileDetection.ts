/**
 * useMobileDetection Hook
 * Detects mobile viewport and provides responsive layout information
 */

import { useState, useEffect } from 'react';

interface MobileDetectionResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  viewportWidth: number;
  viewportHeight: number;
  orientation: 'portrait' | 'landscape';
  columns: number; // Recommended grid columns for keyboard
}

// Breakpoints
const BREAKPOINTS = {
  mobile: 768,   // < 768px = mobile
  tablet: 1024,  // 768-1024px = tablet
  // > 1024px = desktop
};

/**
 * Hook to detect mobile viewport and provide layout recommendations
 */
export function useMobileDetection(): MobileDetectionResult {
  const [detection, setDetection] = useState<MobileDetectionResult>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 1080,
    orientation: 'landscape',
    columns: 10,
  });

  useEffect(() => {
    const updateDetection = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const isMobile = width < BREAKPOINTS.mobile;
      const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
      const isDesktop = width >= BREAKPOINTS.tablet;

      const orientation: 'portrait' | 'landscape' = height > width ? 'portrait' : 'landscape';

      // Calculate recommended columns based on viewport
      // Adaptive: fewer columns for very small screens
      let columns = 10; // default
      if (isMobile) {
        if (width < 360) {
          // Very small phones
          columns = orientation === 'portrait' ? 8 : 10;
        } else if (width < 400) {
          // Small phones
          columns = orientation === 'portrait' ? 9 : 11;
        } else {
          // Regular phones
          columns = orientation === 'portrait' ? 10 : 12;
        }
      } else if (isTablet) {
        columns = 12;
      } else {
        columns = 12; // desktop can handle more
      }

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        viewportWidth: width,
        viewportHeight: height,
        orientation,
        columns,
      });
    };

    // Initial detection
    updateDetection();

    // Listen for resize and orientation changes
    window.addEventListener('resize', updateDetection);
    window.addEventListener('orientationchange', updateDetection);

    return () => {
      window.removeEventListener('resize', updateDetection);
      window.removeEventListener('orientationchange', updateDetection);
    };
  }, []);

  return detection;
}

/**
 * Get recommended key size range for current viewport
 * COMPACT MODE - Like Google Gboard
 */
export function getKeyConstraints(viewportWidth: number): {
  minSize: number;
  maxSize: number;
  baseSize: number;
} {
  // Compact mobile keyboard sizes (Google Gboard style)
  let MIN_SIZE = 28; // Small compact keys
  let MAX_SIZE = 50; // Not too large even on big screens

  // Slightly larger on tablets/desktop
  if (viewportWidth >= 768) {
    MIN_SIZE = 40;
    MAX_SIZE = 60;
  } else if (viewportWidth >= 600) {
    MIN_SIZE = 35;
    MAX_SIZE = 55;
  }

  // Compact base size
  const isMobile = viewportWidth < BREAKPOINTS.mobile;
  const baseSize = isMobile ? 35 : 45; // Much smaller!

  return {
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
    baseSize,
  };
}

/**
 * Calculate key width based on viewport and columns
 * COMPACT & ADAPTIVE - Responsive to screen size
 */
export function calculateKeyWidth(
  viewportWidth: number,
  columns: number,
  gap: number = 2
): number {
  // Balanced padding - enough to prevent cutoff but still compact
  const SIDE_PADDING = 12; // 6px each side - balanced

  // Total gap space between keys (not at edges)
  const totalGapSpace = gap * (columns - 1);

  // Available width for all keys
  const availableWidth = viewportWidth - SIDE_PADDING - totalGapSpace;

  // Width per key
  let keyWidth = availableWidth / columns;

  // Apply min/max constraints
  const { minSize, maxSize } = getKeyConstraints(viewportWidth);
  keyWidth = Math.max(minSize, Math.min(maxSize, keyWidth));

  return Math.floor(keyWidth); // Floor to avoid subpixel issues
}
