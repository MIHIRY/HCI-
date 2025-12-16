/**
 * Custom hook for managing optimized keyboard layouts
 */

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../contexts/store';
import type { ContextType, KeyboardLayout } from '../types';
import { generateOptimizedLayout, getLayoutRecommendation } from '../utils/layoutOptimizer';
import { keyFrequencyTracker } from '../utils/keyFrequencyTracker';

interface UseOptimizedLayoutReturn {
  optimizedLayout: KeyboardLayout | null;
  isOptimizationEnabled: boolean;
  toggleOptimization: () => void;
  regenerateLayout: () => void;
  recommendation: {
    shouldUseOptimized: boolean;
    reason: string;
    estimatedImprovement: number;
  };
  isLoading: boolean;
}

const OPTIMIZATION_STORAGE_KEY = 'contexttype_optimization_enabled';

export function useOptimizedLayout(): UseOptimizedLayoutReturn {
  const { currentContext, setLayout, currentLayout } = useAppStore();
  const [optimizedLayout, setOptimizedLayout] = useState<KeyboardLayout | null>(null);
  const [isOptimizationEnabled, setIsOptimizationEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(OPTIMIZATION_STORAGE_KEY);
    return stored === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState({
    shouldUseOptimized: false,
    reason: 'Collecting data...',
    estimatedImprovement: 0
  });

  // Generate optimized layout
  const generateLayout = useCallback((context: ContextType, usePersonalization: boolean) => {
    setIsLoading(true);
    try {
      const layout = generateOptimizedLayout(context, usePersonalization);
      return layout;
    } catch (error) {
      console.error('Failed to generate optimized layout:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Regenerate layout (useful when user adds more typing data)
  const regenerateLayout = useCallback(() => {
    const layout = generateLayout(currentContext, isOptimizationEnabled);
    if (layout) {
      setOptimizedLayout(layout);
      if (isOptimizationEnabled) {
        setLayout(layout);
      }
    }
  }, [currentContext, isOptimizationEnabled, generateLayout, setLayout]);

  // Toggle optimization on/off
  const toggleOptimization = useCallback(() => {
    setIsOptimizationEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem(OPTIMIZATION_STORAGE_KEY, String(newValue));

      if (newValue && optimizedLayout) {
        // Enable: switch to optimized layout
        setLayout(optimizedLayout);
      } else {
        // Disable: regenerate standard layout
        const standardLayout = generateLayout(currentContext, false);
        if (standardLayout) {
          setLayout(standardLayout);
        }
      }

      return newValue;
    });
  }, [optimizedLayout, currentContext, setLayout, generateLayout]);

  // Update recommendation
  useEffect(() => {
    const updateRecommendation = () => {
      const rec = getLayoutRecommendation(currentContext);
      setRecommendation(rec);
    };

    updateRecommendation();

    // Update recommendation every 30 seconds
    const interval = setInterval(updateRecommendation, 30000);
    return () => clearInterval(interval);
  }, [currentContext]);

  // Generate layout when context changes
  useEffect(() => {
    const layout = generateLayout(currentContext, isOptimizationEnabled);
    if (layout) {
      setOptimizedLayout(layout);

      // Only apply if optimization is enabled
      if (isOptimizationEnabled) {
        setLayout(layout);
      }
    }
  }, [currentContext, isOptimizationEnabled]);

  // Regenerate layout periodically if user is typing
  useEffect(() => {
    if (!isOptimizationEnabled) return;

    const interval = setInterval(() => {
      const stats = keyFrequencyTracker.getStats(currentContext);

      // Only regenerate if user has typed enough (every 100 new key presses)
      if (stats.totalPresses > 0 && stats.totalPresses % 100 === 0) {
        regenerateLayout();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [currentContext, isOptimizationEnabled, regenerateLayout]);

  return {
    optimizedLayout,
    isOptimizationEnabled,
    toggleOptimization,
    regenerateLayout,
    recommendation,
    isLoading
  };
}
