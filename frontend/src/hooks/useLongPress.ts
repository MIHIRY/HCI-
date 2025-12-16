/**
 * useLongPress Hook
 * Detects long-press gestures on both touch and mouse events
 * Phase 2: Mobile UX gestures
 */

import { useCallback, useRef, useState } from 'react';

interface LongPressOptions {
  threshold?: number; // ms to trigger long-press (default 300ms)
  onLongPress?: () => void;
  onPress?: () => void;
  onCancel?: () => void;
}

interface LongPressResult {
  isLongPressing: boolean;
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
  };
}

/**
 * Hook to detect long-press gestures
 * Works with both touch and mouse events
 */
export function useLongPress(options: LongPressOptions): LongPressResult {
  const {
    threshold = 300, // 300ms default for long-press
    onLongPress,
    onPress,
    onCancel,
  } = options;

  const [isLongPressing, setIsLongPressing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const start = useCallback(() => {
    isLongPressTriggered.current = false;
    setIsLongPressing(true);

    timerRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      onLongPress?.();
    }, threshold);
  }, [onLongPress, threshold]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLongPressing(false);

    // If long-press was not triggered, treat as regular press
    if (!isLongPressTriggered.current) {
      onPress?.();
    } else {
      onCancel?.();
    }

    isLongPressTriggered.current = false;
    touchStartPos.current = null;
  }, [onPress, onCancel]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      start();
    },
    [start]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      cancel();
    },
    [cancel]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsLongPressing(false);
      touchStartPos.current = null;
    },
    []
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      start();
    },
    [start]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      cancel();
    },
    [cancel]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      // Cancel long-press if finger moves too much (swipe detection)
      if (touchStartPos.current) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

        // If moved more than 10px, cancel long-press
        if (deltaX > 10 || deltaY > 10) {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          setIsLongPressing(false);
          isLongPressTriggered.current = false;
        }
      }
    },
    []
  );

  return {
    isLongPressing,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
    },
  };
}
